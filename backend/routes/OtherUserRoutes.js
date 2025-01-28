const express = require('express');
const router = express.Router();
const { Op } = require('sequelize'); // Import the Op object for operators
const { db } = require('../dbConfig'); 

router.get('/api/users/search', async (req, res) => {
  const searchQuery = req.query.q;

  try {
    if (searchQuery.length < 3) {
      return res.status(400).json({ message: 'Search query must be at least 3 characters long' });
    }

    const users = await db.findAll({
      where: {
        username: {
          [Op.like]: `%${searchQuery}%`  // Use LIKE operator for partial matching
        }
      },
      attributes: ['id', 'username'] 
    });

    const allResults = [...users,...similarUsers]; // Combine the results

    res.json(allResults);

  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ message: 'Failed to search users' });
  }
});

module.exports = router;