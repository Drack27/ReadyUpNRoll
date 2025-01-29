// SignupRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../dbInit'); // Import Sequelize User model
const { uploadProfileImage } = require('../server');
const fs = require('fs');
const jwt = require('jsonwebtoken');

console.log("Hi from external route file!");
console.log("Profile Image Config:", uploadProfileImage);

router.post('/api/signup', uploadProfileImage.single('profileImage'), async (req, res) => {
  console.log('Received signup request:', req.body);
  const { email, username, password } = req.body;
  const profileImage = req.file;

  try {
    // 1. Data validation and sanitization
    if (!email || !username || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (username.includes('@')) {
      return res.status(400).json({ errors: ['Usernames cannot contain the "@" symbol'] });
    }

    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Handle image filename (or use a default)
    const filename = profileImage ? profileImage.filename : null;

    // 4. Insert user into database using Sequelize
    const user = await User.create({
      email: email,
      username: username,
      password: hashedPassword,
      profileImage: filename,
    });

    console.log(`User created with ID: ${user.id}`);

    // Generate the JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET
    );

    // Send the token and other relevant data in the response
    res.status(201).json({
      message: 'User created successfully',
      token: token,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    const errors = [];

    if (error.name === 'SequelizeUniqueConstraintError') {
      error.errors.forEach((e) => {
        if (e.path === 'email') {
          errors.push('Email already exists');
        } else if (e.path === 'username') {
          errors.push('Username already exists');
        }
      });
    } else {
      errors.push('Failed to create user');
    }

    // If there was an error and an image was uploaded, delete the image
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error('Error deleting image:', err);
        } else {
          console.log('Image deleted successfully');
        }
      });
    }

    return res.status(409).json({ errors: errors });
  }
});

module.exports = router;