const { Sequelize, DataTypes } = require('sequelize');

// Database configuration
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './readyupandroll.db',
    logging: false,
});

// Define the User model
const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.TEXT, allowNull: false, unique: true },
    username: { type: DataTypes.TEXT, allowNull: false, unique: true },
    password: { type: DataTypes.TEXT, allowNull: false },
    profileImage: { type: DataTypes.TEXT },
});

// Define the World model
const World = sequelize.define('World', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.TEXT, allowNull: false },
    tagline: { type: DataTypes.TEXT },
    description: { type: DataTypes.TEXT },
    thumbnailImages: { type: DataTypes.TEXT },
    disclaimers: { type: DataTypes.TEXT },
    players_needed: { type: DataTypes.INTEGER },
    require_all_players_for_session_zero: { type: DataTypes.INTEGER },
    game_system: { type: DataTypes.TEXT },
    game_system_description: { type: DataTypes.TEXT },
    modules: { type: DataTypes.TEXT },
    gm_id: { type: DataTypes.INTEGER, allowNull: false },
    is_private: { type: DataTypes.BOOLEAN, defaultValue: false },
    is_listed: { type: DataTypes.BOOLEAN, defaultValue: true },
});

// Define the WorldInvite model
const WorldInvite = sequelize.define('WorldInvite', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'pending' },
});

// Define associations
World.belongsTo(User, { foreignKey: 'gm_id', as: 'gm' });
User.hasMany(World, { foreignKey: 'gm_id', as: 'gmWorlds' });
World.hasMany(WorldInvite, { foreignKey: 'world_id', as: 'invites' });
WorldInvite.belongsTo(World, { foreignKey: 'world_id', as: 'world' });
User.hasMany(WorldInvite, { foreignKey: 'username', sourceKey: 'username', as: 'userInvites' });
WorldInvite.belongsTo(User, { foreignKey: 'username', targetKey: 'username', as: 'user' });

// Function to initialize the database
async function initializeDatabase() {
    try {
        await sequelize.authenticate();
        console.log('Connection to the database has been established successfully.');

        // Synchronize User model
        await User.sync();

        // Create a default user (if it doesn't exist) - Good practice for development
        const [defaultUser, created] = await User.findOrCreate({
            where: { username: 'admin' },
            defaults: {
                email: 'admin@example.com',
                password: 'secure_password', // !!! Use bcrypt in a real application !!!
                username: 'admin',
            }
        });
        if (created) {
            console.log('Default admin user created.');
        }

        // Synchronize World model - Keep force: false!
        await World.sync({ force: false });
        const defaultGmId = defaultUser.id;
        await World.update(
            { gm_id: defaultGmId},
            {where: {gm_id: null}}
        );
        // Synchronize WorldInvite model
        await WorldInvite.sync();

        console.log('Database schema initialized or updated.');

    } catch (error) {
        console.error('Unable to connect to or initialize the database:', error);
    }
}

// Export the models and the initialization function
module.exports = {
    sequelize,
    User,
    World,
    WorldInvite,
    initializeDatabase,
};