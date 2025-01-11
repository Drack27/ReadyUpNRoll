require('dotenv').config(); 
const jwt = require('jsonwebtoken');
const db = require('./dbConfig'); // Assuming your database connection is in db.js

function authMiddleware(req, res, next) {
    console.log("ARG, AUTHENTICATION BOT HERE!");
    const token = req.headers.authorization?.split(' ')[1]; 

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid token' });
            }

            // Fetch user details from the database
            const userId = decodedToken.userId;
            db.get('SELECT * FROM users WHERE id = ?', [userId], (err, user) => {
                if (err) {
                    console.error('Error fetching user:', err);
                    return res.status(500).json({ message: 'Failed to authenticate' });
                }

                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }

                req.user = user;
                next();
            });
        });
    } else {
        console.log("GRRRRRRRRR");
        res.status(401).json({ message: 'Authorization required' });
    }
}

module.exports = authMiddleware;