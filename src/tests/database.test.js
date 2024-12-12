const mongoose = require('mongoose');
const Insurance = require('../models/Insurance');
require('dotenv').config();

// Test data
const testPolicy = {
  policyNumber: "POL123",
  holderName: "John Doe",
  customerIdHash: "0x" + "1".repeat(64), // Dummy hash
  walletAddress: "0x" + "2".repeat(40), // Dummy ethereum address
  policyType: "health",
  premium: 1000,
  coverage: 100000,
  startDate: new Date(),
  endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
};

const testClaim = {
  claimId: "CLM123",
  customerIdHash: testPolicy.customerIdHash,
  amount: 5000,
  description: "Hospital expenses",
  documents: ["doc1.pdf", "doc2.pdf"],
  claimDate: new Date()
};

// Database connection
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to test database');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
}

// Clean up database
async function clearDatabase() {
  try {
    await Insurance.deleteMany({});
    console.log('Database cleared');
  } catch (error) {
    console.error('Error clearing database:', error);
  }
}

// Test functions
async function testCreatePolicy() {
  try {
    const policy = new Insurance(testPolicy);
    await policy.save();
    console.log('Test policy created:', policy);
    return policy;
  } catch (error) {
    console.error('Error creating policy:', error);
  }
}

async function testAddClaim(policyId) {
  try {
    const policy = await Insurance.findById(policyId);
    policy.claims.push(testClaim);
    await policy.save();
    console.log('Test claim added:', policy.claims[0]);
    return policy;
  } catch (error) {
    console.error('Error adding claim:', error);
  }
}

async function testUpdateClaimStatus(policyId, claimId, newStatus) {
  try {
    const policy = await Insurance.findById(policyId);
    const claim = policy.claims.id(claimId);
    claim.status = newStatus;
    await policy.save();
    console.log('Claim status updated:', claim);
    return policy;
  } catch (error) {
    console.error('Error updating claim status:', error);
  }
}

async function testGetAllPolicies() {
  try {
    const policies = await Insurance.find();
    console.log('All policies:', policies);
    return policies;
  } catch (error) {
    console.error('Error getting policies:', error);
  }
}

// Run tests
async function runTests() {
  try {
    await connectDB();
    await clearDatabase();

    console.log('\n--- Starting Database Tests ---\n');

    // Test 1: Create Policy
    console.log('Test 1: Creating Policy');
    const policy = await testCreatePolicy();
    
    // Test 2: Add Claim
    console.log('\nTest 2: Adding Claim');
    const updatedPolicy = await testAddClaim(policy._id);
    
    // Test 3: Update Claim Status
    console.log('\nTest 3: Updating Claim Status');
    const claimId = updatedPolicy.claims[0]._id;
    await testUpdateClaimStatus(policy._id, claimId, 'APPROVED');
    
    // Test 4: Get All Policies
    console.log('\nTest 4: Getting All Policies');
    await testGetAllPolicies();

    console.log('\n--- Database Tests Completed ---\n');
    
    await mongoose.connection.close();
    console.log('Database connection closed');
    
  } catch (error) {
    console.error('Test error:', error);
  }
}

// Run the tests
runTests(); 