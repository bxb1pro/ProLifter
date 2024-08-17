const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CustomWorkoutExercise = sequelize.define('CustomWorkoutExercise', {
    customWorkoutExerciseID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    customWorkoutID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    exerciseID: {
        type: DataTypes.UUID,
        allowNull: false,
    },
});

module.exports = CustomWorkoutExercise;