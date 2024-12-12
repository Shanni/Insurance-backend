const mongoose = require('mongoose');
const Insurance = require('../models/Insurance');
require('dotenv').config();

async function queryExamples() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to database');

    // 1. Find all policies
    const allPolicies = await Insurance.find();
    console.log('All policies:', allPolicies);

    // 2. Find policy by policy number
    const policy = await Insurance.findOne({ policyNumber: 'POL123' });
    console.log('Single policy:', policy);

    // 3. Find policies by type
    const healthPolicies = await Insurance.find({ policyType: 'health' });
    console.log('Health policies:', healthPolicies);

    // 4. Find active policies
    const activePolicies = await Insurance.find({ status: 'active' });
    console.log('Active policies:', activePolicies);

    // 5. Find policies with claims
    const policiesWithClaims = await Insurance.find({
      'claims.0': { $exists: true }
    });
    console.log('Policies with claims:', policiesWithClaims);

    // 6. Find policies by holder name (partial match)
    const policyByHolder = await Insurance.find({
      holderName: { $regex: 'John', $options: 'i' }
    });
    console.log('Policies by holder:', policyByHolder);

    // 7. Find claims with specific status
    const pendingClaims = await Insurance.find({
      'claims.status': 'PENDING'
    });
    console.log('Policies with pending claims:', pendingClaims);

    // 8. Find policies expiring soon (next 30 days)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    const expiringPolicies = await Insurance.find({
      endDate: {
        $gte: new Date(),
        $lte: thirtyDaysFromNow
      }
    });
    console.log('Expiring policies:', expiringPolicies);

    // 9. Find policies with high-value claims (> 5000)
    const highValueClaims = await Insurance.find({
      'claims.amount': { $gt: 5000 }
    });
    console.log('High value claims:', highValueClaims);

    // 10. Get specific fields only
    const policyNumbers = await Insurance.find().select('policyNumber holderName');
    console.log('Policy numbers and holders:', policyNumbers);

  } catch (error) {
    console.error('Query error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

// Run queries
queryExamples(); 