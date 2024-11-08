const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3001; // Or any port you prefer

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

app.post('/api/users', async (req, res) => {
    const { email, username, password } = req.body;
  
    try {
      // 1. Data validation and sanitization (important!)
      // ... (validate email, username, password format, etc.) ...
  
      // 2. Hash the password (essential for security!)
      // const hashedPassword = await bcrypt.hash(password, 10); // Example using bcrypt
  
      // 3. Insert user data into the database
      const stmt = db.prepare('INSERT INTO users (email, username, password) VALUES (?, ?, ?)');
      await stmt.run(email, username, hashedPassword); // Use the hashed password
      stmt.finalize();
  
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message:   
   'Failed to create user' });
    }
  });