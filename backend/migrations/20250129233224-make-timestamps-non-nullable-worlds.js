'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // SQLite does not support modifying columns directly to be NOT NULL,
    // so we need to use a workaround.
    // We'll create a new table with the correct schema, copy the data,
    // drop the old table, and rename the new table.

    // 1. Create a new table with the desired schema
    await queryInterface.createTable('Worlds_New', {
      // Copy all existing column definitions from your World model here
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      gm_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      name: {
        type: Sequelize.STRING,
      },
      tagline: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
      },
      visibility: {
        type: Sequelize.STRING,
      },
      thumbnailImages: {
        type: Sequelize.TEXT,
      },
      disclaimers: {
        type: Sequelize.TEXT,
      },
      players_needed: {
        type: Sequelize.INTEGER,
      },
      require_all_players_for_session_zero: {
        type: Sequelize.INTEGER,
      },
      game_system: {
        type: Sequelize.STRING,
      },
      game_system_description: {
        type: Sequelize.TEXT,
      },
      modules: {
        type: Sequelize.TEXT,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false, // Now NOT NULL
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false, // Now NOT NULL
      },
    });

    // 2. Copy data from the old table to the new table
    await queryInterface.sequelize.query(
      `INSERT INTO Worlds_New (id, gm_id, name, tagline, description, visibility, thumbnailImages, disclaimers, players_needed, require_all_players_for_session_zero, game_system, game_system_description, modules, createdAt, updatedAt)
       SELECT id, gm_id, name, tagline, description, visibility, thumbnailImages, disclaimers, players_needed, require_all_players_for_session_zero, game_system, game_system_description, modules, createdAt, updatedAt FROM Worlds`
    );

    // 3. Drop the old table
    await queryInterface.dropTable('Worlds');

    // 4. Rename the new table to the original name
    await queryInterface.renameTable('Worlds_New', 'Worlds');
  },

  down: async (queryInterface, Sequelize) => {
    // To reverse this, we'll essentially do the opposite:
    // Create a new table with nullable timestamps, copy data, drop the old table, rename the new table.
    await queryInterface.createTable('Worlds_Old', {
      // Copy all existing column definitions from your World model here
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      gm_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users', // Make sure this matches your actual model name
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      name: {
        type: Sequelize.STRING,
      },
      tagline: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
      },
      visibility: {
        type: Sequelize.STRING,
      },
      thumbnailImages: {
        type: Sequelize.TEXT,
      },
      disclaimers: {
        type: Sequelize.TEXT,
      },
      players_needed: {
        type: Sequelize.INTEGER,
      },
      require_all_players_for_session_zero: {
        type: Sequelize.INTEGER,
      },
      game_system: {
        type: Sequelize.STRING,
      },
      game_system_description: {
        type: Sequelize.TEXT,
      },
      modules: {
        type: Sequelize.TEXT,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: true, // Nullable again
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true, // Nullable again
      },
    });

    await queryInterface.sequelize.query(
      `INSERT INTO Worlds_Old (id, gm_id, name, tagline, description, visibility, thumbnailImages, disclaimers, players_needed, require_all_players_for_session_zero, game_system, game_system_description, modules, createdAt, updatedAt)
       SELECT id, gm_id, name, tagline, description, visibility, thumbnailImages, disclaimers, players_needed, require_all_players_for_session_zero, game_system, game_system_description, modules, createdAt, updatedAt FROM Worlds`
    );

    await queryInterface.dropTable('Worlds');
    await queryInterface.renameTable('Worlds_Old', 'Worlds');
  }
};
