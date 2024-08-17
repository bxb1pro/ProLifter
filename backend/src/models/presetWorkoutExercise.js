const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PresetWorkoutExercise = sequelize.define('PresetWorkoutExercise', {
    presetWorkoutExerciseID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    presetWorkoutID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    exerciseID: {
        type: DataTypes.UUID,
        allowNull: false,
    },
});

module.exports = PresetWorkoutExercise;