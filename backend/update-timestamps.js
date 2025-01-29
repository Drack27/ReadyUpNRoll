// update-timestamps.js
const { User, sequelize } = require('./dbInit'); // Your dbInit file

async function updateTimestamps() {
  try {
    await sequelize.authenticate(); // Ensure connection

    const users = await User.findAll(); // Get all users

    for (const user of users) {
      // Set timestamp values (e.g., current time or a specific date)
      user.createdAt = new Date(); 
      user.updatedAt = new Date();
      await user.save();
    }

    console.log('Timestamps updated successfully!');
  } catch (error) {
    console.error('Error updating timestamps:', error);
  } finally {
    await sequelize.close();
  }
}

updateTimestamps();