const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../dbConfig');
const { uploadProfileImage } = require('../server');
const fs = require('fs'); 
const jwt = require('jsonwebtoken');

console.log("Hi from external route file!");
console.log("Profile Image Config:", uploadProfileImage);

router.post('/', uploadProfileImage.single('profileImage'), async (req, res) => {
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

        // 4. Insert user into database
        const insertQuery = 'INSERT INTO users (email, username, password, profileImage) VALUES (?, ?, ?, ?)';
        db.run(insertQuery, [email, username, hashedPassword, filename], function (err) {
            if (err) {
                console.error(err.message);
                const errors = [];

                if (err.code === 'SQLITE_CONSTRAINT') { 
                    if (err.message.includes('users.email')) {
                        errors.push('Email already exists'); 
                    } else if (err.message.includes('users.username')) {
                        errors.push('Username already exists'); 
                    }
                } else {
                    errors.push('Failed to create user'); 
                }

                // If there was an error, delete the uploaded image
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

            console.log(`A row has been inserted with rowid ${this.lastID}`);

            // Generate the JWT token here 
            const token = jwt.sign({ userId: this.lastID, username: username }, process.env.JWT_SECRET); 

            // Send the token and other relevant data in the response
            res.status(201).json({ 
                message: 'User created successfully', 
                token: token, 
                username: username, 
                email: email, 
            });
        }); 

    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Failed to create user' });
    }
});



module.exports = router;