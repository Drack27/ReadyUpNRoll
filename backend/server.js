const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000; 

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