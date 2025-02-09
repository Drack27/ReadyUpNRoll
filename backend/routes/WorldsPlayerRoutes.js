// backend/WorldsPlayerRoutes.js
const express = require('express');
const router = express.Router();
const { World, WorldInvite, User } = require('../dbInit');
const authMiddleware = require('../authMiddleware');
const { Sequelize } = require('sequelize');

// --- Get Invited Worlds for a Player (GET /api/worlds/invited) --- (Correct, no changes needed)
router.get('/api/worldsplayer/invitedlist', authMiddleware, async (req, res) => {
    // ... (Your existing code for invited worlds - no changes)
    console.log("invite list of worlds for a player, comin' right up!");
    try {
        const invites = await WorldInvite.findAll({
            where: {
                username: req.user.username,
                status: 'pending'
            },
            include: [{
                model: World,
                as: 'world',
                attributes: ['id', 'name', 'tagline', 'thumbnailImages'],
            }]
        });


        const invitedWorlds = invites.map(invite => {
            if (invite.world) {
                return {
                    id: invite.world.id,
                    name: invite.world.name,
                    tagline: invite.world.tagline,
                    thumbnailImages: invite.world.thumbnailImages !== null && invite.world.thumbnailImages !== undefined ? JSON.parse(invite.world.thumbnailImages) : [], // Robust null check
                    inviteId: invite.id,
                };
            }
            return null;
        }).filter(world => world !== null);

        if (invitedWorlds.length === 0) {
            return res.status(404).json({ message: 'No pending world invitations found for this user.' });
        }

        res.json(invitedWorlds);
    } catch (error) {
        console.error('Error fetching invited worlds:', error);
        res.status(500).json({ message: 'Failed to fetch invited worlds', error: error });
    }
});

// --- Get Public Worlds (GET /api/worlds/public) --- (Correct, no changes needed)
router.get('/api/worldsplayer/publiclist', async (req, res) => {
    // ... (Your existing code for public worlds - no changes)
    console.log("public world list information for a player, comin' right up!");
    try {
        const publicWorlds = await World.findAll({
            where: {
                is_private: false,
                is_listed: true
            },
            attributes: ['id', 'name', 'tagline', 'thumbnailImages'],
            include: [{
                model: User,
                as: 'gm',
                attributes: ['username']
            }]
        });

        const formattedPublicWorlds = publicWorlds.map(world => ({
            id: world.id,
            name: world.name,
            tagline: world.tagline,
            gmUsername: world.gm ? world.gm.username : null,
            thumbnailImages: world.thumbnailImages !== null && world.thumbnailImages !== undefined ? JSON.parse(world.thumbnailImages) : [], // Robust null check
        }));

        res.json(formattedPublicWorlds);
    } catch (error) {
        console.error('Error fetching public worlds:', error);
        res.status(500).json({ message: 'Failed to fetch public worlds', error: error });
    }
});

// --- Get World Details for a Player (GET /api/worldsplayer/:worldId) --- (Correct, no changes needed)
router.get('/api/worldsplayer/:worldId', authMiddleware, async (req, res) => {
	// ... (Your existing code for world details - no changes)
    const worldId = parseInt(req.params.worldId, 10);
    if (isNaN(worldId)) {
        return res.status(400).json({ message: 'Invalid worldId' });
    }

    try {
        const world = await World.findByPk(worldId, {
            attributes: [
                'id', 'name', 'tagline', 'description', 'thumbnailImages',
                'game_system', 'game_system_description', 'modules',
                'gm_id', 'is_private', 'is_listed'
            ],
            include: [{ model: User, as: 'gm', attributes: ['username'] }],
        });

        if (!world) {
            return res.status(404).json({ message: 'World not found' });
        }

        const isGM = req.user && req.user.id === world.gm_id;

        // Check for membership (accepted invite) - for button display logic
        let isMember = false;
        if (req.user) {
            const acceptedInvite = await WorldInvite.findOne({
                where: {
                    world_id: worldId,
                    username: req.user.username,
                    status: 'accepted',
                },
            });
            isMember = !!acceptedInvite;
        }

        // *** Authorization Logic ***
        if (world.is_private) {
            // Private world: Require authentication AND (invite OR GM)
            if (!req.user) {
                return res.status(401).json({ message: 'Authentication required to view this world.' });
            }

            // Check for *any* invite (pending or accepted), or GM status
            const invite = await WorldInvite.findOne({
                where: {
                    world_id: worldId,
                    username: req.user.username,
                    [Sequelize.Op.or]: [ 	// Use Sequelize.Op.or for the OR condition
                        { status: 'pending' },
                        { status: 'accepted' }
                    ]
                },
            });

            if (!invite && !isGM) { 	// Not invited AND not the GM
                return res.status(403).json({ message: 'You are not authorized to view this world.' });
            }
        } // No 'else' needed for public worlds.  If it's public, just continue.

        const worldData = {
            id: world.id,
            name: world.name,
            tagline: world.tagline,
            description: world.description,
            thumbnailImages: world.thumbnailImages ? JSON.parse(world.thumbnailImages) : [],
            gameSystem: world.game_system,
            gameSystemDescription: world.game_system_description,
            modules: world.modules ? JSON.parse(world.modules) : [],
            gmUsername: world.gm.username,
            isGM: isGM,
            isMember: isMember, // Still useful for showing "Leave World"
            isPrivate: world.is_private,
        };

        res.json(worldData);

    } catch (error) {
        console.error('Error fetching world details for player:', error);
        res.status(500).json({ message: 'Failed to fetch world details' });
    }
});

// --- NEW: Get Joined Worlds for a Player (GET /api/worlds/player/:userId) ---
router.get('/api/worlds/player/:userId', authMiddleware, async (req, res) => {
    const userId = parseInt(req.params.userId, 10);

    if (isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Verify that the requesting user matches the requested userId
    if (req.user.id !== userId) {
        return res.status(403).json({ message: 'Unauthorized: You can only view your own joined worlds.' });
    }

    try {
        // Find all accepted invites for the user.
        const acceptedInvites = await WorldInvite.findAll({
            where: {
                username: req.user.username, // Use the username from the token
                status: 'accepted'
            },
            include: [{
                model: World,
                as: 'world',
                attributes: ['id', 'name', 'tagline', 'thumbnailImages'], // Include world details
            }]
        });

        // Extract the world data from the invites.
        const joinedWorlds = acceptedInvites.map(invite => ({
            id: invite.world.id,
            name: invite.world.name,
            tagline: invite.world.tagline,
            thumbnailImages: invite.world.thumbnailImages ? JSON.parse(invite.world.thumbnailImages) : [],
        }));

        res.json(joinedWorlds);
    } catch (error) {
        console.error('Error fetching joined worlds:', error);
        res.status(500).json({ message: 'Failed to fetch joined worlds', error: error });
    }
});




// --- Join a World (POST /api/worldsplayer/:worldId/join) ---
router.post('/api/worldsplayer/:worldId/join', authMiddleware, async (req, res) => {
    const worldId = parseInt(req.params.worldId, 10);
    if (isNaN(worldId)) {
        return res.status(400).json({ message: 'Invalid worldId' });
    }

    try {
        // 1. Find the world (check if it exists)
        const world = await World.findByPk(worldId);
        if (!world) {
            return res.status(404).json({ message: 'World not found' });
        }

        // 2. Check if the user is already a member (accepted invite)
        const existingInvite = await WorldInvite.findOne({
            where: {
                world_id: worldId,
                username: req.user.username,
                status: 'accepted',
            },
        });
        if (existingInvite) {
            return res.status(400).json({ message: 'You are already a member of this world.' });
        }

        // 3. Check for a pending invite.  If none exists, create one.  If one exists, update it.
        let invite = await WorldInvite.findOne({
            where: {
                world_id: worldId,
                username: req.user.username,
                status: 'pending',
            },
        });

        if (invite) {
            // Update existing pending invite to 'accepted'
            invite.status = 'accepted';
            await invite.save();
        } else {
          //check to see if invite has been rejected previously. If so, return an error message
            let rejectedInvite = await WorldInvite.findOne({
                where: {
                  world_id: worldId,
                  username: req.user.username,
                  status: 'rejected',
              },
          });
          if(rejectedInvite){
            return res.status(403).json({message: 'You cannot join a world you previously rejected.'})
          }
            // No pending invite, create a new 'accepted' invite
            invite = await WorldInvite.create({
                world_id: worldId,
                username: req.user.username,
                status: 'accepted', // Directly join (no pending state)
                invited_by: world.gm_id, // Set the 'invited_by' to the GM's ID
            });
        }
        // 4.  (Optional) Send a notification to the GM that a user joined.

        res.status(200).json({ message: 'Successfully joined the world!' });

    } catch (error) {
        console.error('Error joining world:', error);
        res.status(500).json({ message: 'Failed to join world', error: error.message }); // Send error message
    }
});

module.exports = router;