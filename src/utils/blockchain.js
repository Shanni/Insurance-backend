const Web3 = require('web3');
const crypto = require('crypto');
require('dotenv').config();

const CONTRACT_ABI = require('../../Insurance.json');

class BlockchainService {
  constructor() {
    this.web3 = new Web3(new Web3.providers.HttpProvider(process.env.ETHEREUM_NODE_URL));
    this.contract = new this.web3.eth.Contract(
      CONTRACT_ABI,
      process.env.CONTRACT_ADDRESS
    );
  }

  // Hash customer ID for privacy
  hashCustomerId(customerId) {
    const hash = crypto.createHash('sha256').update(customerId).digest('hex');
    return '0x' + hash; // Convert to bytes32 format for blockchain
  }

  // Convert claim data for blockchain
  formatClaimForBlockchain(claim) {
    return {
      customerIdHash: claim.customerIdHash,
      claimId: this.web3.utils.numberToHex(claim.claimId),
      amount: this.web3.utils.toWei(claim.amount.toString(), 'ether'),
      claimDate: Math.floor(new Date(claim.claimDate).getTime() / 1000),
      status: this.getStatusCode(claim.status)
    };
  }

  getStatusCode(status) {
    const statusCodes = {
      'PENDING': 0,
      'APPROVED': 1,
      'REJECTED': 2,
      'PAID': 3
    };
    return statusCodes[status];
  }

  async submitClaimToBlockchain(claim, walletAddress) {
    const formattedClaim = this.formatClaimForBlockchain(claim);
    
    const tx = this.contract.methods.submitClaim(
      formattedClaim.customerIdHash,
      formattedClaim.claimId,
      formattedClaim.amount,
      formattedClaim.claimDate
    );

    const gas = await tx.estimateGas({ from: walletAddress });
    
    const signedTx = await this.web3.eth.accounts.signTransaction(
      {
        to: process.env.CONTRACT_ADDRESS,
        data: tx.encodeABI(),
        gas,
        gasPrice: await this.web3.eth.getGasPrice(),
      },
      process.env.PRIVATE_KEY
    );

    const receipt = await this.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    return receipt;
  }

  async updateClaimStatus(claimId, status, walletAddress) {
    const statusCode = this.getStatusCode(status);
    const tx = this.contract.methods.updateClaimStatus(claimId, statusCode);
    
    const gas = await tx.estimateGas({ from: walletAddress });
    
    const signedTx = await this.web3.eth.accounts.signTransaction(
      {
        to: process.env.CONTRACT_ADDRESS,
        data: tx.encodeABI(),
        gas,
        gasPrice: await this.web3.eth.getGasPrice(),
      },
      process.env.PRIVATE_KEY
    );

    const receipt = await this.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    return receipt;
  }

  async getClaimFromBlockchain(claimId) {
    const claim = await this.contract.methods.getClaim(claimId).call();
    return {
      customerIdHash: claim.customerIdHash,
      claimId: parseInt(claim.claimId),
      amount: this.web3.utils.fromWei(claim.amount, 'ether'),
      claimDate: new Date(claim.claimDate * 1000),
      status: this.getStatusString(parseInt(claim.status)),
      exists: claim.exists
    };
  }

  getStatusString(statusCode) {
    const statusStrings = ['PENDING', 'APPROVED', 'REJECTED', 'PAID'];
    return statusStrings[statusCode];
  }
}

module.exports = new BlockchainService(); 