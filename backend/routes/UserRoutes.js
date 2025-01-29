// UserRoutes.js
const express = require('express');
const router = express.Router();
const { User } = require('../dbInit'); // Import Sequelize User model
const authMiddleware = require('../authMiddleware');

router.get('/api/me', authMiddleware, async (req, res) => {
  try {
    console.log('Route accessed at ' + new Date() + '\n');
    console.log(req.user);

    // Assuming your authMiddleware adds the user object to req.user
    const { id } = req.user; // Assuming the field in req.user is id
    const userId = parseInt(id, 10); // Convert to integer (base 10)
    // Fetch user data from the database using Sequelize
    const user = await User.findByPk(userId, {
      attributes: ['id', 'username', 'email', 'profileImage'],
    });

    console.log(user);


    if (!user) {
        console.log("uh oh! Sequelize is a piece of garbage!")
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      profileImage: user.profileImage,
    });
    console.log("tweedle");
  } catch (error) {
    console.error('Error in /api/me:', error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

module.exports = router;