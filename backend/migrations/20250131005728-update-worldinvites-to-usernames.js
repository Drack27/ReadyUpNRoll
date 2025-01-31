// migrations/[timestamp]-update-worldinvites-to-usernames.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add the new username column
    await queryInterface.addColumn('WorldInvites', 'username', {
      type: Sequelize.STRING,
      allowNull: true, // Temporarily allow null for data migration
    });

    // Migrate data (populate username from Users table)
    // This part might need adjustment based on your specific setup
    const [invites] = await queryInterface.sequelize.query(
      'SELECT * FROM "WorldInvites"'
    );

    for (const invite of invites) {
      const [user] = await queryInterface.sequelize.query(
        `SELECT username FROM "Users" WHERE email = '${invite.email}'` // Assuming you have an email field on Users
      );

      if (user.length > 0) {
        await queryInterface.sequelize.query(
          `UPDATE "WorldInvites" SET username = '${user[0].username}' WHERE id = ${invite.id}`
        );
      }
    }

    // Remove the old email column
    await queryInterface.removeColumn('WorldInvites', 'email');

    // Make username NOT NULL
    await queryInterface.changeColumn('WorldInvites', 'username', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Add back the email column
    await queryInterface.addColumn('WorldInvites', 'email', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // You might need to add logic to repopulate the email column (if possible)
    // ...

    // Remove the username column
    await queryInterface.removeColumn('WorldInvites', 'username');
  },
};