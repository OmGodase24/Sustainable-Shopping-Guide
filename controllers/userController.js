const User = require('../models/userModel');

// Register a new user
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const newUser = await User.create({ name, email, password });

        res.status(201).json({
            status: 'success',
            data: { user: newUser }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

// Login a user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Ensure email and password are provided
        if (!email || !password) {
            return res.status(400).json({
                status: 'fail',
                message: 'Please provide email and password!'
            });
        }

        // Find user by email and include the password field
        const user = await User.findOne({ email }).select('+password');

        // Validate password
        if (!user || !(await user.correctPassword(password, user.password))) {
            return res.status(401).json({
                status: 'fail',
                message: 'Incorrect email or password!'
            });
        }

        res.status(200).json({
            status: 'success',
            data: { user }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};
