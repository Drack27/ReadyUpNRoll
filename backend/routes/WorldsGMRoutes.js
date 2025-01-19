const express = require('express');
const router = express.Router();
const db = require('../dbConfig');
const { uploadWorldImages } = require('../server'); 
const path = require('path'); 

// --- Create or Update World (POST /api/worldsgm) ---
router.post('/api/worldsgm', uploadWorldImages.array('thumbnailImages'), async (req, res) => {
  const { 
    id, // Include id in the request body for both create and update
    gm_id, 
    name,
    tagline,
    description,
    visibility,
    thumbnailImages,
    disclaimers,
    players_needed,
    require_all_players_for_session_zero,
    game_system,
    game_system_description,
    modules,
  } = req.body;

  try {
    if (id) { // If id is provided, attempt to update
      // 1. Validate the data (add your validation logic here)

      // 2. Update the world in the database
      const updateSql = `UPDATE worlds SET 
                    name = ?, 
                    tagline = ?, 
                    description = ?,
                    visibility = ?,
                    thumbnailImages = ?,
                    disclaimers = ?,
                    players_needed = ?,
                    require_all_players_for_session_zero = ?,
                    game_system = ?,
                    game_system_description = ?,
                    modules = ?,
                    WHERE id = ? AND gm_id = ?`;

                    const updateValues = [
                      name,
                      tagline,
                      description,
                      visibility,
                      JSON.stringify(thumbnailImages), // Assuming you want to store it as JSON
                      disclaimers,
                      players_needed,
                      require_all_players_for_session_zero,
                      game_system,
                      game_system_description,
                      JSON.stringify(modules),
                      id,
                      gm_id, // Add gm_id here as well
                  ];

      const updateResult = await new Promise((resolve, reject) => {
        db.run(updateSql, updateValues, function (err) {
          if (err) reject(err);
          resolve(this.changes); // Resolve with the number of rows changed
        });
      });

      if (updateResult === 0) { // No rows were updated
        return res.status(404).json({ error: 'World not found' }); 
      } else {
        return res.json({ message: 'World updated successfully' });
      }

    } else { // If id is not provided, create a new world
      // 1. Check world creation limit (replace with your actual logic)
      //    - Query the database to count existing worlds for this gm_id
      //    - Compare with the user's limit (free vs. premium)
      //    - If limit exceeded, return 403 Forbidden

      // 2. Create a new world entry
      const insertSql = `INSERT INTO worlds (gm_id, name, tagline, description, visibility, thumbnailImages, disclaimers, players_needed, require_all_players_for_session_zero, game_system, game_system_description, modules /* ...other fields */) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?/* ...other values */)`;

      const insertValues = [
        gm_id,
        name,
        tagline,
        description,
        visibility,
        JSON.stringify(thumbnailImages), // Stringify if storing as JSON
        disclaimers,
        players_needed,
        require_all_players_for_session_zero,
        game_system,
        game_system_description,
        JSON.stringify(modules),    
      ];

      const insertResult = await new Promise((resolve, reject) => {
        db.run(insertSql, insertValues, function (err) {
          if (err) reject(err);
          resolve(this.lastID); // Resolve with the ID of the newly created world
        });
      });

      return res.status(201).json({ message: 'World created successfully', worldId: insertResult });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: 'Failed to create or update world' });
  }
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

module.exports = router;