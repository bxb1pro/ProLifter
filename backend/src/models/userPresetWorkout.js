const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const UserPresetWorkout = sequelize.define('UserPresetWorkout', {
    userPresetWorkoutID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    presetWorkoutID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

module.exports = UserPresetWorkout;