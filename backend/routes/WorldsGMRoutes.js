const express = require('express');
const router = express.Router();
const { World, User, WorldInvite } = require('../dbInit'); // Import your Sequelize models
const { v4: uuidv4 } = require('uuid'); // For generating unique tokens

console.log("GM Route says hi");

// --- Create or Update World (POST /api/worldsgm) ---
router.post('/api/worldsgm', async (req, res) => {
    const {
        id, // Include id in the request body for both create and update
        gm_id,
        name,
        tagline,
        description,
        // visibility, REMOVE THIS
        thumbnailImages,
        disclaimers,
        players_needed,
        require_all_players_for_session_zero,
        game_system,
        game_system_description,
        modules,
        is_private, // ADD THIS
        is_listed,   // ADD THIS
    } = req.body;

    try {
        if (id) {
            // Update existing world
            const world = await World.findByPk(id);

            if (!world) {
                return res.status(404).json({ error: 'World not found' });
            }

            // Check if the user making the request is the GM of the world
            if (world.gm_id !== gm_id) {
                return res
                    .status(403)
                    .json({ error: 'You are not authorized to update this world' });
            }

            await world.update({
                name,
                tagline,
                description,
                // visibility, REMOVE THIS
                thumbnailImages: JSON.stringify(thumbnailImages), // Stringify if storing as JSON
                disclaimers,
                players_needed,
                require_all_players_for_session_zero,
                game_system,
                game_system_description,
                modules: JSON.stringify(modules), // Stringify if storing as JSON
                is_private, // ADD THIS
                is_listed,   // ADD THIS
            });

            return res.json({ message: 'World updated successfully' });
        } else {
            // Create a new world

            // 1. Check world creation limit (replace with your actual logic)
            //     - Query the database to count existing worlds for this gm_id
            //     - Compare with the user's limit (free vs. premium)
            //     - If limit exceeded, return 403 Forbidden

            const newWorld = await World.create({
                gm_id,
                name,
                tagline,
                description,
                // visibility, REMOVE THIS
                thumbnailImages: JSON.stringify(thumbnailImages),
                disclaimers,
                players_needed,
                require_all_players_for_session_zero,
                game_system,
                game_system_description,
                modules: JSON.stringify(modules),
                is_private, // ADD THIS
                is_listed,   // ADD THIS
            });

            return res
                .status(201)
                .json({ message: 'World created successfully', worldId: newWorld.id });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to create or update world' });
    }
});

// --- Get Worlds by GM ID (GET /api/worlds/gm/:gmId) ---
router.get('/api/worlds/gm/:gmId', async (req, res) => {
    const gmId = req.params.gmId;

    try {
        const worlds = await World.findAll({
            where: { gm_id: gmId },
            attributes: [
                'id',
                'name',
                'tagline',
                'description',
                // 'visibility', REMOVE THIS
                'thumbnailImages',
                'is_private', // Add is_private
                'is_listed',   // Add is_listed
            ],
        });

        if (!worlds || worlds.length === 0) {
            return res.status(404).json({ error: 'No worlds found for this user' });
        }

        // Parse thumbnailImages if needed
        const parsedWorlds = worlds.map((world) => ({
            ...world.toJSON(),
            thumbnailImages: world.thumbnailImages
                ? JSON.parse(world.thumbnailImages)
                : [],
        }));

        res.json(parsedWorlds);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to get worlds' });
    }
});

// --- Get World Details (GET /api/worldsgm/:worldId) ---
router.get('/api/worldsgm/:worldId', async (req, res) => {
    console.log("ahoy from route deal");
    const worldIdString = req.params.worldId; // Explicitly name it string
    const worldId = parseInt(worldIdString, 10); // Convert to integer here
    if (isNaN(worldId)) {
        return res.status(400).json({ error: 'Invalid worldId format' });
    }
    console.log("Fetching details for worldId:", worldId); // Log the parsed integer


    try {
        const world = await World.findByPk(worldId);

        if (!world) {
            console.log("uh oh stinky");
            return res.status(404).json({ error: 'World not found' });
        }

        // Parse JSON strings before sending the response
        const parsedWorld = {
            ...world.toJSON(),
            modules: world.modules ? JSON.parse(world.modules) : null,
            thumbnailImages: world.thumbnailImages ? JSON.parse(world.thumbnailImages) : null,
            is_private: world.is_private,  // Add is_private
            is_listed: world.is_listed,    // Add is_listed
        };

        res.json(parsedWorld);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to get world details' });
    }
});

// --- Invite to World (POST /api/worldsgm/:worldId/invite) ---
router.post('/api/worldsgm/:worldId/invite', async (req, res) => {
    try {
        const { worldId } = req.params;
        const { userId, username } = req.body; // Get userId and username from request body

        if (!userId || !username) {
            return res.status(400).json({ message: "User ID and Username are required for invite." });
        }

        // TODO: Add validation to check if the user making the request is the owner (gm) of the world

        // Check if an invite already exists for this username and world to avoid duplicates
        const existingInvite = await WorldInvite.findOne({
            where: {
                world_id: worldId,
                username: username // Use username for checking existing invite
            }
        });

        if (existingInvite) {
            return res.status(409).json({ message: "Invite already sent to this user for this world." }); // 409 Conflict
        }

        // Create the invite in the database
        const invite = await WorldInvite.create({
            world_id: worldId,
            username: username,        // Store the username
            // We are NOT setting 'invitedUserId' as it's not in your schema
            // We are NOT setting 'token' here for username-based invites (if token is only for email invites)
            // status: 'pending' - you can set a default status here if needed in the model or set it explicitly
        });

        res.status(201).json({ message: "Invite sent successfully", invite: invite });
    } catch (error) {
        console.error("Error creating WorldInvite:", error);
        res.status(500).json({ message: 'Failed to create invite', error: error });
    }
});

// --- Get Invited Users for a World (GET /api/worldsgm/:worldId/invited) ---
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

// --- Update World by ID (PUT /api/worldsgm/:worldId) ---
router.put('/api/worldsgm/:worldId', async (req, res) => {
    const { worldId } = req.params;
    const {
        gm_id,
        name,
        tagline,
        description,
        // visibility, REMOVE
        thumbnailImages,
        disclaimers,
        players_needed,
        require_all_players_for_session_zero,
        game_system,
        game_system_description,
        modules,
        is_private, // ADD
        is_listed, //ADD
    } = req.body;

    try {
        const world = await World.findByPk(worldId);

        if (!world) {
            return res.status(404).json({ error: 'World not found' });
        }

        // Check if the user making the request is the GM of the world
        if (world.gm_id !== gm_id) {
            return res
                .status(403)
                .json({ error: 'You are not authorized to update this world' });
        }

        await world.update({
            name,
            tagline,
            description,
            // visibility, REMOVE
            thumbnailImages: JSON.stringify(thumbnailImages), // Stringify if storing as JSON
            disclaimers,
            players_needed,
            require_all_players_for_session_zero,
            game_system,
            game_system_description,
            modules: JSON.stringify(modules), // Stringify if storing as JSON
            is_private, //ADD
            is_listed, //ADD
        });

        return res.json({ message: 'World updated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to update world' });
    }
});

module.exports = router;