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
        type: DataTypes.STRING,
        allowNull: false,
    },
    // Attributes for preset workout exercises to be set by admins/other
    defaultSets: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    defaultReps: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    defaultRPE: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
});

PresetWorkoutExercise.associate = (models) => {
    PresetWorkoutExercise.belongsTo(models.PresetWorkout, { foreignKey: 'presetWorkoutID', onDelete: 'CASCADE' });
    PresetWorkoutExercise.belongsTo(models.Exercise, { foreignKey: 'exerciseID', onDelete: 'CASCADE' });
};

module.exports = PresetWorkoutExercise;