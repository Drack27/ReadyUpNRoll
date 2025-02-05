'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Rename the 'email' column to 'username'
    await queryInterface.renameColumn('WorldInvites', 'email', 'username');

    // Change the column type if needed (it's already STRING in your original migration, so this might be unnecessary)
    await queryInterface.changeColumn('WorldInvites', 'username', {
      type: Sequelize.STRING,
      allowNull: false, // Or true, depending on your requirements
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Rename the 'username' column back to 'email'
    await queryInterface.renameColumn('WorldInvites', 'username', 'email');

    // Change the column type back if you changed it in 'up'
    await queryInterface.changeColumn('WorldInvites', 'email', {
      type: Sequelize.STRING,
      allowNull: true, // Or whatever it was originally
    });
  },
};