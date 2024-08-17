const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const WorkoutLog = sequelize.define('WorkoutLog', {
    workoutLogID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    workoutLogDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    workoutLogCompleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    userID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    presetWorkoutID: {
        type: DataTypes.INTEGER,
        allowNull: true, // Can be null if it's associated with a custom workout
    },
    customWorkoutID: {
        type: DataTypes.INTEGER,
        allowNull: true, // Can be null if it's associated with a preset workout
    },
});

module.exports = WorkoutLog;