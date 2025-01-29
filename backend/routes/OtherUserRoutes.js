const express = require('express');
const router = express.Router();
const { User } = require('../dbInit');
const { Op } = require('sequelize');

router.get('/api/users/search', async (req, res) => {
  try {
    const query = req.query.q;

    if (!query || query.length < 3) {
      return res.status(400).json({ message: 'Search query must be at least 3 characters long' });
    }

    const users = await User.findAll({
      where: {
        username: {
          [Op.iLike]: `%${query}%`, // Case-insensitive search
        },
      },
      attributes: ['id', 'username'], // Only return id and username
    });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to search users' });
  }
});

module.exports = router;