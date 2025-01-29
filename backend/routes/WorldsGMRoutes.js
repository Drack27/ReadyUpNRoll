const express = require('express');
const router = express.Router();
const { World, User, WorldInvite } = require('../dbInit'); // Import models
const { v4: uuidv4 } = require('uuid'); // For generating unique tokens 

// --- Create or Update World (POST /api/worldsgm) ---
router.post('/api/worldsgm', async (req, res) => {
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

// --- Get Worlds by GM ID (GET /api/worlds/gm/:gmId) ---
router.get('/api/worlds/gm/:gmId', (req, res) => {
  const gmId = req.params.gmId;
  const sql = `SELECT id, name, tagline, description, visibility, thumbnailImages FROM worlds WHERE gm_id = ?`; // Select only necessary fields
  db.all(sql, [gmId], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Failed to get worlds' });
    }
    if (!rows) {
      return res.status(404).json({ error: 'No worlds found for this user' });
    }
    // Parse thumbnailImages if it's stored as JSON
    rows.forEach(row => {
        if (row.thumbnailImages) {
            row.thumbnailImages = JSON.parse(row.thumbnailImages);
        }
    });
    res.json(rows);
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

router.post('/api/worldsgm/:worldId/invite', async (req, res) => {
  try {
    const { worldId } = req.params;
    const { email } = req.body;

    // TODO: Add validation to check if the user making the request is the owner (gm) of the world
    // You might need to add authentication middleware for this.

    // Generate a unique token
    const token = uuidv4();

    // Create the invite in the database
    const invite = await WorldInvite.create({
      world_id: worldId,
      email: email,
      token: token,
    });

    // TODO: Send an email to the invitee with the link (using a library like Nodemailer)
    // The link should be something like: `${process.env.FRONTEND_URL}/invite/${token}`

    res.status(201).json(invite);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create invite' });
  }
});

// GET /api/worldsgm/:worldId/invited - Get list of invited users for a world
router.get('/api/worldsgm/:worldId/invited', async (req, res) => {
  try {
    const { worldId } = req.params;

    // Find all invites for the given worldId
    const invites = await WorldInvite.findAll({
      where: { world_id: worldId },
      include: {
        model: User,
        attributes: ['id', 'username'],
      },
    });

    res.json(invites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch invited users' });
  }
});

router.put('/api/worldsgm/:worldId', async (req, res) => {
  const { worldId } = req.params;
  console.log('Received PUT request for worldId:', worldId); // Log the worldId
  console.log('Request Body:', req.body); // Log the request body
  const {
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
              modules = ?
              WHERE id = ? AND gm_id = ?`;

      const updateValues = [
          name,
          tagline,
          description,
          visibility,
          JSON.stringify(thumbnailImages),
          disclaimers,
          players_needed,
          require_all_players_for_session_zero,
          game_system,
          game_system_description,
          JSON.stringify(modules),
          worldId,
          gm_id,
      ];

      console.log('Update SQL:', updateSql); // Log the SQL query
      console.log('Update Values:', updateValues); // Log the values

      const updateResult = await new Promise((resolve, reject) => {
          db.run(updateSql, updateValues, function (err) {
              if (err) {
                  console.error('Database Error:', err.message); // Log any database errors
                  reject(err);
              }
              resolve(this.changes); // Resolve with the number of rows changed
          });
      });

      if (updateResult === 0) {
          return res.status(404).json({ error: 'World not found' });
      } else {
          return res.json({ message: 'World updated successfully' });
      }
  } catch (error) {
      console.error(error.message);
      return res.status(500).json({ error: 'Failed to update world' });
  }
});

module.exports = router;