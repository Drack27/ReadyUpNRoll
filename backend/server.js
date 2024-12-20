const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for JWTs

const app = express();
//  Get the port from the command line arguments, or use 3000 as the default
const port = process.argv[2] || 3000; 

// Connect to the SQLite database
const db = new sqlite3.Database('./readyupandroll.db');

// Initialize the database schema
db.serialize(() => {
  // Create the users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      username TEXT UNIQUE NOT NULL,
      password TEXT   
 NOT NULL
    )
  `);

  // Create   other tables as needed (e.g., gms, campaigns, sessions)

  console.log('Database schema initialized');
});

// CORS configuration (place this before your API routes)
const allowedOrigins = ['http://localhost:3000']; // Replace with your frontend's URL in production

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  })
);

app.options('*', cors()); // Handle preflight requests

// Login route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT (replace 'your-secret-key' with a strong secret)
    const token = jwt.sign({ userId: user.id }, 'your-secret-key'); 

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

app.use(bodyParser.json()); // This will parse JSON request bodies

app.post('/api/users', async (req, res) => {
    console.log('Recieved signup request:', req.body); //Log the request
    const { email, username, password } = req.body;
  
    try {
      // 1. Data validation and sanitization
      if (!email || !username || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      // Basic email validation (you might want more robust validation)
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
      res.status(500).json({ message:   
   'Failed to create user' });
    }
  });