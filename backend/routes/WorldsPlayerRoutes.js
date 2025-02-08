// backend/routes/WorldsPlayerRoutes.js
const express = require('express');
const router = express.Router();
const { World, WorldInvite, User } = require('../dbInit');
const authMiddleware = require('../authMiddleware'); 


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

module.exports = router;