const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');

// Configure multer before exporting it to anything else
// Multer configuration for profile images (single file upload)
const profileImageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const uploadProfileImage = multer({ storage: profileImageStorage });

// Multer configuration for world thumbnail images (multiple file uploads)
const worldImageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const uploadWorldImages = multer({ storage: worldImageStorage });
module.exports = { uploadProfileImage, uploadWorldImages};
//done

const { sequelize, initializeDatabase } = require('./dbInit'); // Import from dbInit

const app = express();
const port = process.argv[2] || 5000;

// Initialize the database using Sequelize
initializeDatabase().then(() => {
  // Middleware Config
    const corsOptions = require('./corsConfig');

    const worldsGMRoutes = require('./routes/WorldsGMRoutes'); 
    const signupRoutes = require('./routes/SignupRoutes'); 
    const userRoutes = require('./routes/UserRoutes'); 
    const loginRoutes = require('./routes/LoginRoutes');
    const otherUserRoutes = require('./routes/OtherUserRoutes'); 
 
    app.use(cors(corsOptions));
    app.use(express.json({ limit: '7mb' }));
    app.use('/uploads', express.static('uploads')); 

    app.use(worldsGMRoutes); 
    app.use(signupRoutes); 
    app.use(userRoutes);
    app.use(loginRoutes);
    app.use(otherUserRoutes)

    // Example API route
    app.get('/', (req, res) => {
      res.send('Hello from ReadyUp & Roll backend!');
    });

    app.listen(port, () => {
      console.log(`Backend server listening on port ${port}`);
    });
}).catch(err => {
  console.error("Database initialization failed:", err);
  process.exit(1);
});
 