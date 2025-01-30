const express = require('express');
const router = express.Router();
const { User, World, WorldInvite } = require('../dbInit'); // Import necessary models
const { Op } = require('sequelize');

router.get('/api/users/search', async (req, res) => {
  try {
    const query = req.query.q;

    if (!query || query.length < 3) {
      return res
        .status(400)
        .json({ message: 'Search query must be at least 3 characters long' });
    }

    const users = await User.findAll({
      where: {
        username: {
          [Op.like]: `%${query}%`, // Use Op.like for SQLite compatibility
        },
      },
      attributes: ['id', 'username'], // Only return id and username
    });

    // Implement fuzzy search logic (1 or 2 characters off)
    const fuzzySearchResults = users.filter(user => {
      const diff = calculateLevenshteinDistance(user.username.toLowerCase(), query.toLowerCase());
      return diff <= 2;
    });

    res.json(fuzzySearchResults);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to search users' });
  }
});

// Helper function to calculate Levenshtein distance (for fuzzy search)
function calculateLevenshteinDistance(a, b) {
  const matrix = [];

  // Increment along the first column of each row
  let i;
  for (i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  // Increment each column in the first row
  let j;
  for (j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for (i = 1; i <= b.length; i++) {
    for (j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) == a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1 // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

// POST route to handle inviting a user to a world
router.post('/api/worldsgm/:worldId/invite', async (req, res) => {
  const { worldId } = req.params;
  const { userId } = req.body; // Now expecting userId in the request body

  try {
    // Check if the user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the world exists
    const world = await World.findByPk(worldId);
    if (!world) {
      return res.status(404).json({ message: 'World not found' });
    }

    // Create an invitation (add a record to WorldInvite)
    await WorldInvite.create({
      worldId: worldId,
      userId: user.id,
      status: 'pending', // You can use an enum or a string to track invite status
    });

    res.status(200).json({ message: 'Invite sent successfully' });
  } catch (error) {
    console.error('Error inviting user:', error);
    res.status(500).json({ message: 'Failed to invite user' });
  }
});

// Route to get invited players for a world
router.get('/api/worldsgm/:worldId/invited', async (req, res) => {
  const { worldId } = req.params;

  try {
    const world = await World.findByPk(worldId, {
      include: [
        {
          model: User,
          as: 'invitedUsers', // Alias for the association with User
          through: {
            model: WorldInvite,
            where: { status: 'pending' }, // Filter for pending invites
            attributes: [], // Exclude join table attributes
          },
          attributes: ['id', 'username'], // Only get user id and username
        },
      ],
    });

    if (!world) {
      return res.status(404).json({ message: 'World not found' });
    }

    res.json(world.invitedUsers);
  } catch (error) {
    console.error('Error fetching invited users:', error);
    res.status(500).json({ message: 'Failed to fetch invited users' });
  }
});

module.exports = router;