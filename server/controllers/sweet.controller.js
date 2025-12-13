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

const updateSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);
    if (!sweet) return res.status(404).json({ message: 'Sweet not found' });

    const { name, category, price, quantity, image, description } = req.body;

    if (price !== undefined && price < 0)
      return res.status(400).json({ message: 'Invalid price' });

    if (quantity !== undefined && quantity < 0)
      return res.status(400).json({ message: 'Invalid quantity' });

    if (name !== undefined) sweet.name = name.trim();
    if (category !== undefined) sweet.category = category.trim();
    if (price !== undefined) sweet.price = price;
    if (quantity !== undefined) sweet.quantity = quantity;
    if (image !== undefined) sweet.image = image;
    if (description !== undefined) sweet.description = description;

    await sweet.save();
    return res.status(200).json(sweet);

  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);
    if (!sweet) return res.status(404).json({ message: 'Sweet not found' });

    await sweet.deleteOne();
    return res.status(200).json({ message: 'Sweet deleted successfully' });
  } catch {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const searchSweets = async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;

    const filter = {};

    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }

    if (category) {
      filter.category = { $regex: category, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const sweets = await Sweet.find(filter).sort({ createdAt: -1 });
    return res.status(200).json(sweets);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const purchaseSweet = async (req, res) => {
  const sweet = await Sweet.findById(req.params.id);

  if (!sweet) {
    return res.status(404).json({ message: 'Sweet not found' });
  }

  if (sweet.quantity <= 0) {
    return res.status(400).json({ message: 'Sweet out of stock' });
  }

  sweet.quantity -= 1;
  await sweet.save();

  return res.status(200).json({ message: 'Sweet purchased successfully' });
};

module.exports = { createSweet, getAllSweets, updateSweet, deleteSweet , searchSweets, purchaseSweet };