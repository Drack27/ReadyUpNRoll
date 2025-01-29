// LoginRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../dbInit'); // Import Sequelize User model
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

router.post('/api/login', async (req, res) => {
  console.log("login route accessed");
  const { email, username, password } = req.body;
  const errors = [];

  try {
    // Find the user by email or username using Sequelize
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: email }, { username: username }],
      },
    });

    if (!user) {
      errors.push('Incorrect email or username.');
    } else {
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.push('Incorrect password.');
      }
    }

    if (errors.length > 0) {
      return res.status(401).json({ errors });
    }

    // Generate a JWT with userId and username included
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET
    );

    res.json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

module.exports = router;