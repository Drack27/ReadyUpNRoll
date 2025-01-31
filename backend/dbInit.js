const { Sequelize, DataTypes } = require('sequelize');

// Database configuration
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './readyupandroll.db',
  logging: false, // Set to true to see SQL queries in the console
});

// Define the User model
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
  },
  username: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  profileImage: {
    type: DataTypes.TEXT,
  },
});

// Define the World model
const World = sequelize.define('World', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  tagline: {
    type: DataTypes.TEXT,
  },
  description: {
    type: DataTypes.TEXT,
  },
  visibility: {
    type: DataTypes.TEXT,
    validate: {
      isIn: [['public', 'private']],
    },
  },
  thumbnailImages: {
    type: DataTypes.TEXT,
  },
  disclaimers: {
    type: DataTypes.TEXT,
  },
  players_needed: {
    type: DataTypes.INTEGER,
  },
  require_all_players_for_session_zero: {
    type: DataTypes.INTEGER,
  },
  game_system: {
    type: DataTypes.TEXT,
  },
  game_system_description: {
    type: DataTypes.TEXT,
  },
  modules: {
    type: DataTypes.TEXT,
  },
});

// Define the WorldInvite model (updated to use username)
const WorldInvite = sequelize.define('WorldInvite', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: { // Changed from 'email' to 'username'
    type: DataTypes.STRING, // Using STRING type for username
    allowNull: false,
  },
  //You don't necessarily need a token to make invites work, you can remove this
  //if you choose to later. For now, I've commented it out
  // token: {
  //   type: DataTypes.TEXT,
  //   allowNull: false,
  //   unique: true,
  // },
  status: {
    type: DataTypes.STRING, // Using STRING to store status like 'pending', 'accepted', etc.
    allowNull: false,
    defaultValue: 'pending', // Default status is 'pending'
  },
});

// Define associations
World.belongsTo(User, { foreignKey: 'gm_id' });
User.hasMany(World, { foreignKey: 'gm_id' });

// Update associations to reflect the change to username
World.hasMany(WorldInvite, { foreignKey: 'world_id' });
WorldInvite.belongsTo(World, { foreignKey: 'world_id' });

// New association: User has many WorldInvites through the username
User.hasMany(WorldInvite, { foreignKey: 'username', sourceKey: 'username' });
WorldInvite.belongsTo(User, { foreignKey: 'username', targetKey: 'username' });

// Many-to-many association between World and User through WorldInvite
User.belongsToMany(World, { through: WorldInvite, foreignKey: 'username', otherKey: 'world_id', sourceKey: 'username' });
World.belongsToMany(User, { through: WorldInvite, foreignKey: 'world_id', otherKey: 'username', targetKey: 'username' });

// Function to initialize the database
async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');

    // Synchronize models with the database
    await User.sync();
    await World.sync();
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