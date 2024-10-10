const mongoose = require('mongoose');
const sustainabilitySchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  format: { // New field to associate with the format
    type: mongoose.Schema.Types.ObjectId,
    ref: 'format',
    required: true, // Ensure each sustainability entry is tied to a format
  },
  response: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a connection specifically for the Sustainability database
const sustainabilityConnection = mongoose.createConnection(process.env.SUSTAINABILITY_DATABASE_LOCAL || "mongodb://127.0.0.1:27017/SustainabilityDB");
const Sustainability = sustainabilityConnection.model('Sustainability', sustainabilitySchema);
module.exports = Sustainability;


