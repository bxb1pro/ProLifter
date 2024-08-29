require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models'); // Import from index.js
const { sendConfirmationEmail } = require('../services/emailService'); // Import the email service

// Some code here inspired by https://medium.com/@akshaysen/implementing-authentication-using-jwt-in-node-js-cf9fdf210d07
const signup = async (req, res) => {
    try {
        const { userName, userEmail, userPassword, role } = req.body;

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
            role: role || 'user', // Default role is 'user' if not specified
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

        // Generate JWT using the secret from the environment variable, add role in too
        const token = jwt.sign({ userID: user.userID, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

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

const deleteAccount = async (req, res) => {
    try {
        const { userPassword } = req.body;
        const userID = req.user.userID; // Extract userID from the authenticated user's JWT

        // Find the user in the database
        const user = await User.findByPk(userID);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verify the provided password
        const validPassword = await bcrypt.compare(userPassword, user.userPasswordHash);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        // Delete the user account
        await user.destroy();

        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

const getAccountDetails = async (req, res) => {
    try {
        const userID = req.user.userID; // Extract userID from the authenticated user's JWT

        // Find the user in the database
        const user = await User.findByPk(userID, {
            attributes: ['userID', 'userName', 'userEmail', 'role', 'createdAt']
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    signup,
    login,
    logout,
    deleteAccount,
    getAccountDetails,

};