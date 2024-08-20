const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PresetWorkout = sequelize.define('PresetWorkout', {
    presetWorkoutID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    presetWorkoutName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    presetWorkoutDays: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    presetWorkoutDifficulty: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    presetWorkoutLocation: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    presetWorkoutDateCreated: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
});

PresetWorkout.associate = (models) => {
    PresetWorkout.hasMany(models.PresetWorkoutExercise, { foreignKey: 'presetWorkoutID', onDelete: 'CASCADE' });
    PresetWorkout.hasMany(models.UserPresetWorkout, { foreignKey: 'presetWorkoutID', onDelete: 'CASCADE' });
};

module.exports = PresetWorkout;