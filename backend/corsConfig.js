const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Allow credentials
  allowedHeaders: ['Content-Type', 'Authorization'] 
};

module.exports = corsOptions; 