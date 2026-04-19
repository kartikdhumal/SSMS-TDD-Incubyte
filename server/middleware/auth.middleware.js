require('dotenv').config({ path: '.env' });
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const JWT_SECRET = process.env.JWT_SECRET || (process.env.NODE_ENV === 'test' ? 'test-jwt-secret' : null);

const protect = async (req, res, next) => {
  try {
    if (!JWT_SECRET) {
      return res.status(500).json({ message: 'JWT configuration missing' });
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const decodedId = decoded.id || decoded.userId
    req.user = await User.findById(decodedId).select('-password');
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = { protect };
