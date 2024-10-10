const cors = require('cors');

const corsMiddleware = cors({
  origin: '*', // Replace '*' with your frontend's URL in production
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

module.exports = corsMiddleware;
