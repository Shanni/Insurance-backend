const Insurance = require('../models/Insurance');
const BlockchainService = require('../utils/blockchain');
const { v4: uuidv4 } = require('uuid');

exports.submitClaim = async (req, res) => {
  try {
    const { policyId, description, amount, documents, walletAddress } = req.body;

    const policy = await Insurance.findById(policyId);
    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }

    // Create new claim
    const claim = {
      claimId: uuidv4(),
      customerIdHash: policy.customerIdHash,
      description,
      amount,
      documents,
      status: 'PENDING',
      claimDate: new Date()
    };

    // Submit to blockchain
    const receipt = await BlockchainService.submitClaimToBlockchain(
      claim,
      walletAddress
    );

    // Update claim with blockchain transaction hash
    claim.blockchainTxHash = receipt.transactionHash;

    // Add claim to policy
    policy.claims.push(claim);
    await policy.save();

    // Verify claim on blockchain
    const blockchainClaim = await BlockchainService.getClaimFromBlockchain(claim.claimId);
    
    res.status(201).json({
      claim,
      blockchainVerification: blockchainClaim
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateClaimStatus = async (req, res) => {
  try {
    const { policyId, claimId, status, walletAddress } = req.body;

    const policy = await Insurance.findById(policyId);
    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }

    const claim = policy.claims.id(claimId);
    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    // Update status on blockchain
    const receipt = await BlockchainService.updateClaimStatus(
      claimId,
      status,
      walletAddress
    );

    // Update claim status in database
    claim.status = status;
    claim.blockchainTxHash = receipt.transactionHash;
    await policy.save();

    // Verify updated status on blockchain
    const blockchainClaim = await BlockchainService.getClaimFromBlockchain(claimId);

    res.json({
      claim,
      blockchainVerification: blockchainClaim
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getClaimDetails = async (req, res) => {
  try {
    const { policyId, claimId } = req.params;

    const policy = await Insurance.findById(policyId);
    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }

    const claim = policy.claims.id(claimId);
    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    // Get claim details from blockchain for verification
    const blockchainClaim = await BlockchainService.getClaimFromBlockchain(claimId);

    res.json({
      claim,
      blockchainVerification: blockchainClaim
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 