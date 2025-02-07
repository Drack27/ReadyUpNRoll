// backend/routes/WorldsPlayerRoutes.js

const express = require('express');
const router = express.Router();
const { World, WorldInvite } = require('../models'); // Assuming your Sequelize models are in '../models/index.js' and exported
const authMiddleware = require('../authMiddleware');

// --- Get Invited Worlds for a Player (GET /api/worlds/invited) ---
// Requires authentication - only logged-in players can see their invites
router.get('/api/worldsplayer/invitedlist', authMiddleware, async (req, res) => {
    console.log("invite list of worlds for a player, comin' right up!");
    try {
        const userId = req.user.id; // Assuming your authentication middleware adds user info to req.user

        // Find all invites for the current user that are still pending
        const invites = await WorldInvite.findAll({
            where: {
                username: req.user.username, // Match by username (as per your schema)
                status: 'pending' // Assuming you have a 'status' field in WorldInvites, and want to show only pending invites
            },
            include: [{
                model: World,
                as: 'world', // Assuming you have an association alias 'world' defined in your WorldInvite model
                attributes: ['id', 'name', 'tagline', 'thumbnailImages'], // Select world attributes you need
            }]
        });

        // Extract world data from the invites and send it in response
        const invitedWorlds = invites.map(invite => {
            if (invite.world) {
                return {
                    id: invite.world.id,
                    name: invite.world.name,
                    tagline: invite.world.tagline,
                    thumbnailImages: invite.world.thumbnailImages ? JSON.parse(invite.world.thumbnailImages) : [], // Parse JSON if stored as string
                    inviteId: invite.id, // Optionally include the invite ID if needed on frontend
                    // You can add more world details here if needed
                };
            }
            return null; // Handle cases where invite might not have associated world (optional, depends on your data integrity)
        }).filter(world => world !== null); // Filter out any null entries if world is missing

        if (invitedWorlds.length === 0) {
            return res.status(404).json({ message: 'No pending world invitations found for this user.' }); // 404 if no invites
        }

        res.json(invitedWorlds);
    } catch (error) {
        console.error('Error fetching invited worlds:', error);
        res.status(500).json({ message: 'Failed to fetch invited worlds', error: error });
    }
});

// --- Get Public Worlds (GET /api/worlds/public) ---
// Public route - no authentication required to browse public worlds
router.get('/api/worldsplayer/publiclist', async (req, res) => {
    console.log("public world list information for a player, comin' right up!");
    try {
        const publicWorlds = await World.findAll({
            where: {
                is_private: false, // Assuming you have an 'is_private' boolean field in your Worlds model
                is_listed: true // Assuming you have an 'is_listed' boolean field to control public listing
            },
            attributes: ['id', 'name', 'tagline', 'gmUsername', 'thumbnailImages'], // Select world attributes you need
        });

        const formattedPublicWorlds = publicWorlds.map(world => ({
            id: world.id,
            name: world.name,
            tagline: world.tagline,
            gmUsername: world.gmUsername,
            thumbnailImages: world.thumbnailImages ? JSON.parse(world.thumbnailImages) : [], // Parse JSON if stored as string
            // Add other fields if needed
        }));

        res.json(formattedPublicWorlds);
    } catch (error) {
        console.error('Error fetching public worlds:', error);
        res.status(500).json({ message: 'Failed to fetch public worlds', error: error });
    }
});

module.exports = router;