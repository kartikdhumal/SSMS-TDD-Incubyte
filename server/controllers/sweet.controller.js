const Sweet = require('../models/sweets.model');

const createSweet = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const sweet = await Sweet.create(req.body);
  return res.status(201).json(sweet);
};

const getAllSweets = async (req, res) => {
  const sweets = await Sweet.find();
  res.status(200).json(sweets);
};

module.exports = { createSweet , getAllSweets};
