const db = require('./db');
const path = require('path');
const express = require('express');
const bcrypt = require('bcrypt');
const authMiddleware = require('./authMiddleware'); 
const cors = require('cors');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const corsOptions = require('./corsConfig');
const app = express();
const port = process.argv[2] || 3000; 

console.log("Applying CORS options...");
app.use(cors(corsOptions));
console.log("Applying express.json & setting limit at 7mb...")
app.use(express.json({ limit: '7mb' }));

// Configure multer for file uploads
console.log("Configuring Multer...");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage }); // Make sure this is defined

// Export the upload middleware
module.exports.upload = upload; // Added this line to export upload

const signupRoutes = require('./SignupRequestRecieved'); 


// Initialize the database schema
db.serialize(() => {
    console.log("Initializing Database Schema...");
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            profileImage TEXT 
        )
    `);
    console.log('Database schema initialized');
});


app.use('/api/users', signupRoutes); 

// API route to get current user's data
app.get('/api/me', authMiddleware, (req, res) => {
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

// Login route
app.post('/api/login', async (req, res) => {
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


// Example API route
app.get('/', (req, res) => {
  res.send('Hello from ReadyUp & Roll backend!');
});

app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});
 