const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../dbConfig'); 
const jwt = require('jsonwebtoken');



router.post('/api/login', async (req, res) => {
    const { email, username, password } = req.body;
    const errors = []; 
  
    try {
      const user = await new Promise((resolve, reject) => {
        db.get(
          'SELECT * FROM users WHERE email = ? OR username = ?',
          [email, username], 
          (err, row) => {
            if (err) {
              reject(err);
            } else {
              resolve(row);
            }
          }
        );
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
  
      // Generate a JWT with username included
      const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET); 
  
      res.json({ token });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Login failed' });
    }
  });

  module.exports = router;