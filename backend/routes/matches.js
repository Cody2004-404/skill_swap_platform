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

// Get skill matches for a user
router.get('/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Verify the requested userId matches the authenticated user
    if (userId !== req.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get current user
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find all other users
    const allUsers = await User.find({ _id: { $ne: userId } });

    // Find matches based on complementary skills
    const matches = allUsers.filter(otherUser => {
      // Check if other user teaches what current user wants to learn
      const teachesWhatUserWants = otherUser.skillsTeach.some(skill => 
        currentUser.skillsLearn.includes(skill)
      );

      // Check if other user wants to learn what current user can teach
      const learnsWhatUserTeaches = otherUser.skillsLearn.some(skill => 
        currentUser.skillsTeach.includes(skill)
      );

      return teachesWhatUserWants && learnsWhatUserTeaches;
    });

    // Format matches for response
    const formattedMatches = matches.map(match => ({
      id: match._id,
      name: match.name,
      email: match.email,
      skillsTeach: match.skillsTeach,
      skillsLearn: match.skillsLearn,
      // Calculate match score based on number of complementary skills
      matchScore: {
        teachesWhatYouWant: match.skillsTeach.filter(skill => 
          currentUser.skillsLearn.includes(skill)
        ).length,
        wantsWhatYouTeach: match.skillsLearn.filter(skill => 
          currentUser.skillsTeach.includes(skill)
        ).length
      }
    }));

    // Sort by match score (highest first)
    formattedMatches.sort((a, b) => {
      const scoreA = a.matchScore.teachesWhatYouWant + a.matchScore.wantsWhatYouTeach;
      const scoreB = b.matchScore.teachesWhatYouWant + b.matchScore.wantsWhatYouTeach;
      return scoreB - scoreA;
    });

    res.json({
      message: `Found ${formattedMatches.length} matches`,
      matches: formattedMatches,
      currentUser: {
        id: currentUser._id,
        name: currentUser.name,
        skillsTeach: currentUser.skillsTeach,
        skillsLearn: currentUser.skillsLearn
      }
    });
  } catch (error) {
    console.error('Match finding error:', error);
    res.status(500).json({ message: 'Server error while finding matches' });
  }
});

module.exports = router;
