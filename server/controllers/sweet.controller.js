const Sweet = require('../models/sweets.model');

const createSweet = async (req, res) => {
  try {
    const { name, category, price, quantity = 0, image } = req.body;

    if (!name || !category || price === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (price < 0 || quantity < 0) {
      return res.status(400).json({ message: 'Invalid price or quantity' });
    }

    const sweet = await Sweet.create({
      name,
      category,
      price,
      quantity,
      image
    });

    return res.status(201).json(sweet);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getAllSweets = async (req, res) => {
  try {
    const sweets = await Sweet.find({})
      .sort({ createdAt: -1 })
      .lean()

    return res.status(200).json({
      count: sweets.length,
      data: sweets,
    });
  } catch (error) {
    console.error('Error fetching sweets:', error);
    return res.status(500).json({
      message: 'Failed to fetch sweets',
    });
  }
};

module.exports = { createSweet, getAllSweets };
