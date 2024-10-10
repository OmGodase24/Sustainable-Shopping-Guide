const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the User schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name!']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false
    }
});

// Method to compare passwords
userSchema.methods.correctPassword = function (candidatePassword, userPassword) {
    return bcrypt.compare(candidatePassword, userPassword);
};

// Middleware to hash the password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    next();
});


const UserConnection = mongoose.createConnection(process.env.SUSTAINABILITY_DATABASE_LOCAL || "mongodb://127.0.0.1:27017/SustainabilityDB");
const userModel = UserConnection.model('User',userSchema);
module.exports = userModel;