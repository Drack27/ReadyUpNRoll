const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3');
const db = require('./db'); 

// --- Create World (POST /api/worldsgm) --- 
router.post('/api/worldsgm', (req, res) => {
  const { gm_id } = req.body;

  // 1. Check world creation limit (replace with your actual logic)
  //    - Query the database to count existing worlds for this gm_id
  //    - Compare with the user's limit (free vs. premium)
  //    - If limit exceeded, return 403 Forbidden

  // 2. Create an empty world entry
  const sql = `INSERT INTO worlds (gm_id) VALUES (?)`;
  db.run(sql, [gm_id], function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Failed to create world' });
    }
    res.status(201).json({ message: 'Empty world created', worldId: this.lastID });
  });
});

// --- Get World Details (GET /api/worldsgm/:worldId) ---
router.get('/api/worldsgm/:worldId', (req, res) => {
  const worldId = req.params.worldId;
  const sql = `SELECT * FROM worlds WHERE id = ?`;
  db.get(sql, [worldId], (err, row) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Failed to get world details' });
    }
    if (!row) {
      return res.status(404).json({ error: 'World not found' });
    }
    // Parse the modules JSON string before sending the response
    row.modules = JSON.parse(row.modules); 
    res.json(row); 
  });
});

// --- Update World (PUT /api/worldsgm) ---
router.put('/api/worldsgm', (req, res) => {
  const {
    id,
    name,
    tagline,
    description,
    visibility,
    thumbnailImages,
    disclaimers,
    players_needed,
    require_all_players_for_session_zero,
    // ... other fields ...
  } = req.body;

  // 1. Validate the data (add your validation logic here)

  // 2. Update the world in the database
  const sql = `UPDATE worlds SET 
                name = ?, 
                tagline = ?, 
                description = ?,
                visibility = ?,
                thumbnailImages = ?,
                disclaimers = ?,
                players_needed = ?,
                require_all_players_for_session_zero = ?
                -- ... update other fields ...
                WHERE id = ?`;

  const values = [
    name,
    tagline,
    description,
    visibility,
    JSON.stringify(thumbnailImages), // Assuming you want to store it as JSON
    disclaimers,
    players_needed,
    require_all_players_for_session_zero,
    // ... other field values ...
    id,
  ];

  db.run(sql, values, function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Failed to update world' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'World not found' });
    }
    res.json({ message: 'World updated successfully' });
  });
});

module.exports = router;