const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  claimId: {
    type: String,
    required: true,
    unique: true
  },
  customerIdHash: {
    type: String,  // Will store the bytes32 hash from blockchain
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  claimDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'PAID'],
    default: 'PENDING'
  },
  documents: [{
    type: String // URLs or IPFS hashes of claim documents
  }],
  blockchainTxHash: {
    type: String
  },
  exists: {
    type: Boolean,
    default: true
  }
});

const insuranceSchema = new mongoose.Schema({
  policyNumber: {
    type: String,
    required: true,
    unique: true
  },
  holderName: {
    type: String,
    required: true
  },
  customerIdHash: {
    type: String,
    required: true,
    unique: true
  },
  walletAddress: {
    type: String,
    required: true
  },
  policyType: {
    type: String,
    required: true,
    enum: ['life', 'health', 'property', 'vehicle']
  },
  premium: {
    type: Number,
    required: true
  },
  coverage: {
    type: Number,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'cancelled'],
    default: 'active'
  },
  claims: [claimSchema],
  contractAddress: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Insurance', insuranceSchema); 