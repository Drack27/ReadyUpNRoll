require('dotenv').config();
const jwt = require('jsonwebtoken');
const { User } = require('./dbInit'); // Import the Sequelize User model

async function authMiddleware(req, res, next) {
  console.log("ARG, AUTHENTICATION BOT HERE!");
  const token = req.headers.authorization?.split(' ')[1];

  if (token) {
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user details from the database using Sequelize
      const userId = decodedToken.userId;
      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      req.user = user.toJSON(); // Attach the user object (converted to JSON) to req.user

      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      }
      console.error('Error in authentication middleware:', err);
      return res.status(403).json({ message: 'Invalid token' });
    }
  } else {
    console.log("GRRRRRRRRR");
    res.status(401).json({ message: 'Authorization required' });
  }
}

module.exports = authMiddleware;