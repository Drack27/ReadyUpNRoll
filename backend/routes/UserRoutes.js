const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3');
const db = require('../dbConfig'); 
const authMiddleware = require('../authMiddleware'); 


router.get('/api/me', authMiddleware, (req, res) => {
    try {
        console.log('Route accessed at ' + new Date() + '\n');
        console.log(req.user); 
  
        // Assuming your authMiddleware adds the user object to req.user
        const { id, username, email } = req.user; // Added user ID
  
        // Fetch the profileImage filename from the database based on the user ID
        db.get('SELECT profileImage FROM users WHERE id = ?', [id], (err, row) => {
            if (err) {
                console.error('Error fetching profile image:', err);
                return res.status(500).json({ error: 'Failed to fetch user data' });
            }
  
            const profileImage = row ? row.profileImage : null; // Handle case where no image is found
  
            res.json({ 
                id: id,
                username: username,
                email: email,
                profileImage: profileImage 
            });
        });
  
    } catch (error) {
        console.error('Error in /api/me:', error);
        res.status(500).json({ error: 'Failed to fetch user data' });
    } 
  });

  module.exports = router;