const Insurance = require('../models/Insurance');

exports.createPolicy = async (req, res) => {
  try {
    const policy = new Insurance(req.body);
    await policy.save();
    res.status(201).json(policy);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllPolicies = async (req, res) => {
  try {
    const policies = await Insurance.find();
    res.json(policies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPolicyById = async (req, res) => {
  try {
    const policy = await Insurance.findById(req.params.id);
    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }
    res.json(policy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePolicy = async (req, res) => {
  try {
    const policy = await Insurance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }
    res.json(policy);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deletePolicy = async (req, res) => {
  try {
    const policy = await Insurance.findByIdAndDelete(req.params.id);
    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }
    res.json({ message: 'Policy deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 