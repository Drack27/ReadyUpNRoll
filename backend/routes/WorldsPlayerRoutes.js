// backend/routes/WorldsPlayerRoutes.js
const express = require('express');
const router = express.Router();
const { World, WorldInvite, User } = require('../dbInit');
const authMiddleware = require('../authMiddleware'); 
const { Sequelize } = require('sequelize');


// --- Get Invited Worlds for a Player (GET /api/worlds/invited) ---
router.get('/api/worldsplayer/invitedlist', authMiddleware, async (req, res) => {
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

// --- Get Public Worlds (GET /api/worlds/public) ---
router.get('/api/worldsplayer/publiclist', async (req, res) => {
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

// --- Get World Details for a Player (GET /api/worldsplayer/:worldId) ---
router.get('/api/worldsplayer/:worldId', authMiddleware, async (req, res) => {
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
                    [Sequelize.Op.or]: [  // Use Sequelize.Op.or for the OR condition
                        { status: 'pending' },
                        { status: 'accepted' }
                    ]
                },
            });

            if (!invite && !isGM) {  // Not invited AND not the GM
                return res.status(403).json({ message: 'You are not authorized to view this world.' });
            }
        } // No 'else' needed for public worlds.  If it's public, just continue.

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

module.exports = router;