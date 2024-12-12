const express = require('express');
const router = express.Router();
const insuranceController = require('../controllers/insuranceController');
const claimController = require('../controllers/claimController');

router.post('/policies', insuranceController.createPolicy);
router.get('/policies', insuranceController.getAllPolicies);
router.get('/policies/:id', insuranceController.getPolicyById);
router.put('/policies/:id', insuranceController.updatePolicy);
router.delete('/policies/:id', insuranceController.deletePolicy);

// Claim routes
router.post('/claims', claimController.submitClaim);
router.put('/claims/status', claimController.updateClaimStatus);
router.get('/policies/:policyId/claims/:claimId', claimController.getClaimDetails);

module.exports = router; 