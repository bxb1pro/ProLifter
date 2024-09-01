const { User } = require('../models');

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get a user by their ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Create a new user
const createUser = async (req, res) => {
    try {
        const { userName, userEmail, userPasswordHash, userAge, userExperienceLevel, userWeightliftingGoal } = req.body;
        const newUser = await User.create({ 
            userName, 
            userEmail, 
            userPasswordHash, 
            userAge, 
            userExperienceLevel, 
            userWeightliftingGoal 
        });
        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
};