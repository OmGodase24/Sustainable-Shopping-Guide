const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

// Load environment variables from config.env
dotenv.config({ path: './config.env' });

// MongoDB connection URLs
const PRODUCT_DB_URL = process.env.PRODUCT_DATABASE_LOCAL || "mongodb://127.0.0.1:27017/ProductDB";
const SUSTAINABILITY_DB_URL = process.env.SUSTAINABILITY_DATABASE_LOCAL || "mongodb://127.0.0.1:27017/SustainabilityDB";

// Connect to Product Database
mongoose.connect(PRODUCT_DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000 // Adjust timeout as needed
}).then(() => {
  console.log('Connected to Product Database');
}).catch((error) => {
  console.error('Error connecting to Product Database:', error);
  process.exit(1);
});

// Connect to Sustainability Database
const sustainabilityConnection = mongoose.createConnection(SUSTAINABILITY_DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000 // Adjust timeout as needed
});

sustainabilityConnection.on('error', (error) => {
  console.error('Error connecting to Sustainability Database:', error);
  process.exit(1);
});

sustainabilityConnection.once('open', () => {
  console.log('Connected to Sustainability Database');
});



// Start the server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

module.exports = { sustainabilityConnection};
