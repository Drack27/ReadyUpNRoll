require('dotenv').config();
const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]; 

  if (token) {
    console.log(process.env.JWT_SECRET);
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token' });
      }
      req.user = user; 
      next();
    });
  } else {
    res.status(401).json({ message: 'Authorization required' });
  }
}

module.exports = authMiddleware;