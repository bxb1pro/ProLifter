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
});

PresetWorkoutExercise.associate = (models) => {
    PresetWorkoutExercise.belongsTo(models.PresetWorkout, { foreignKey: 'presetWorkoutID' });
    PresetWorkoutExercise.belongsTo(models.Exercise, { foreignKey: 'exerciseID' });
};

module.exports = PresetWorkoutExercise;