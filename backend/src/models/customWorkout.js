const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CustomWorkout = sequelize.define('CustomWorkout', {
    customWorkoutID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    customWorkoutName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    customWorkoutDays: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    customWorkoutDateCreated: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    userID: {
        type: DataTypes.UUID,
        allowNull: false,
    },
});

module.exports = CustomWorkout;