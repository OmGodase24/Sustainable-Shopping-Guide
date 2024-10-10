const mongoose = require('mongoose');
const formatSchema = new mongoose.Schema({
    promptKey: { type: String, required: true, unique: true, sparse: true },
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    promptValue: { type: String, required: true },
    active: { type: Boolean, default: false },
    sequence: { type: Number, default: null }, // Sequence starts as null
    createdAt: { type: Date, default: Date.now }
});

const formatConnection = mongoose.createConnection(process.env.SUSTAINABILITY_DATABASE_LOCAL || "mongodb://127.0.0.1:27017/SustainabilityDB");
const formatModel = formatConnection.model('format', formatSchema);
module.exports = formatModel;
