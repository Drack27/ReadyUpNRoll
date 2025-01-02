const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('./db');
const upload = require('./server').upload;

console.log("Hi from external route file!");
console.log(upload);
router.post('/', upload.single('profileImage'), async (req, res) => {
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

        // ... other validation checks for username, password, etc. ...

        // 2. Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Handle image filename (or use a default)
        const filename = profileImage ? profileImage.filename : null; 

        // 4. Insert user into database
        const insertQuery = 'INSERT INTO users (email, username, password, profileImage) VALUES (?, ?, ?, ?)';
        db.run(insertQuery, [email, username, hashedPassword, filename], function (err) {
            if (err) {
                console.error(err.message);
                if (err.code === 'SQLITE_CONSTRAINT') { // Example of database error handling
                    if (err.message.includes('email')) {
                        return res.status(409).json({ error: 'Email already exists' });
                    } else if (err.message.includes('username')) {
                        return res.status(409).json({ error: 'Username already exists' });
                    }
                }
                return res.status(500).json({ error: 'Failed to create user' });
            }
            console.log(`A row has been inserted with rowid ${this.lastID}`);
            res.status(201).json({ message: 'User created successfully' });
        });

    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Failed to create user' });
    }
});

module.exports = router;