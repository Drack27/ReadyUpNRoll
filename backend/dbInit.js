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

// Define the WorldInvite model (for your invite system)
const WorldInvite = sequelize.define('WorldInvite', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    email: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    token: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
    },
    used: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

// Define associations
World.belongsTo(User, { foreignKey: 'gm_id' });
User.hasMany(World, { foreignKey: 'gm_id' });
World.hasMany(WorldInvite, { foreignKey: 'world_id' });
WorldInvite.belongsTo(World, { foreignKey: 'world_id' });

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