// update-timestamps.js
const { sequelize, World } = require('./dbInit'); // Adjust path if needed

async function updateWorldsTimestamps() {
  try {
    const worlds = await World.findAll(); // Get all existing worlds

    for (const world of worlds) {
      const now = new Date();
      // Update each world's timestamp columns
      await world.update({
        createdAt: now,
        updatedAt: now,
      });
    }

    console.log('Timestamps updated successfully.');
  } catch (error) {
    console.error('Error updating timestamps:', error);
  } finally {
    sequelize.close();
  }
}

updateWorldsTimestamps();