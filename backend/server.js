const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const authMiddleware = require('./authMiddleware'); // Make sure this path is correct
const cors = require('cors');
const jwt = require('jsonwebtoken'); 



const corsOptions = require('./corsConfig');
const app = express();
const port = process.argv[2] || 3000; 

// Connect to the SQLite database
const db = new sqlite3.Database('./readyupandroll.db');

app.use(cors(corsOptions));

// Initialize the database schema (This could be in a separate file)
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `);
  console.log('Database schema initialized');
});

app.use(bodyParser.json()); 

// API route to get current user's data
app.get('/api/me', authMiddleware, (req, res) => {
  try {
    console.log('Route accessed at ' + new Date() + '\n');
    console.log(req.user); 
  const username = req.user.username;
  res.json({ username: username });
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

app.post('/api/users', async (req, res) => {
  console.log('Recieved signup request:', req.body); 
  const { email, username, password } = req.body;

  try {
    // 1. Data validation and sanitization
    if (!email || !username || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Basic email validation 
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // ... other validation checks for username, password, etc. ...

    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Insert user data into the database
    const stmt = db.prepare(
      'INSERT INTO users (email, username, password) VALUES (?, ?, ?)'
    );
    await stmt.run(email, username, hashedPassword);
    stmt.finalize();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Failed to create user' });
  }
});