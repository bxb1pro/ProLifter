const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { sendConfirmationEmail } = require('../utils/emailService'); // Import the email service

// Secret key for JWT
const JWT_SECRET = 'your_secret_key';


// Some code here inspired by https://medium.com/@akshaysen/implementing-authentication-using-jwt-in-node-js-cf9fdf210d07
const signup = async (req, res) => {
    try {
        const { userName, userEmail, userPassword } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ where: { userEmail } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userPassword, salt);

        // Create the new user
        const newUser = await User.create({
            userName,
            userEmail,
            userPasswordHash: hashedPassword,
        });

        // Send a confirmation email after successful signup
        sendConfirmationEmail(userEmail);

        res.status(201).json({ message: 'User created successfully', userID: newUser.userID });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

const login = async (req, res) => {
    try {
        const { userEmail, userPassword } = req.body;

        // Check if the user exists
        const user = await User.findOne({ where: { userEmail } });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Check the password
        const validPassword = await bcrypt.compare(userPassword, user.userPasswordHash);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Generate JWT
        const token = jwt.sign({ userID: user.userID }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Logged in successfully', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

const logout = (req, res) => {
    // Logout handled on client side by deleting JWT token
    res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = {
    signup,
    login,
    logout,
};