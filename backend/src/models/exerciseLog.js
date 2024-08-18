const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ExerciseLog = sequelize.define('ExerciseLog', {
    exerciseLogID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    exerciseLogDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    exerciseLogCompleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    exerciseLogSets: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    userID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    workoutLogID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    exerciseID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

module.exports = ExerciseLog;