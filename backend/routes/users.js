const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.userId = decoded.userId;
    next();
  });
};

// Add skills to user profile
router.post('/skills', authenticateToken, async (req, res) => {
  try {
    const { skillsTeach, skillsLearn } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update skills
    if (skillsTeach && Array.isArray(skillsTeach)) {
      user.skillsTeach = skillsTeach.filter(skill => skill.trim() !== '');
    }
    
    if (skillsLearn && Array.isArray(skillsLearn)) {
      user.skillsLearn = skillsLearn.filter(skill => skill.trim() !== '');
    }

    await user.save();

    res.json({
      message: 'Skills updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        skillsTeach: user.skillsTeach,
        skillsLearn: user.skillsLearn
      }
    });
  } catch (error) {
    console.error('Skills update error:', error);
    res.status(500).json({ message: 'Server error while updating skills' });
  }
});

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        skillsTeach: user.skillsTeach,
        skillsLearn: user.skillsLearn
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
});

module.exports = router;
