const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Exercise = sequelize.define('Exercise', {
    exerciseID: {
        type: DataTypes.STRING, //string data type to match the external API
        primaryKey: true,
    },
    exerciseName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    exerciseBodypart: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    exerciseDescription: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    exerciseFormGuide: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    exerciseImageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    exerciseEquipment: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    exerciseSecondaryBodypart: {
        type: DataTypes.ARRAY(DataTypes.STRING), // Array of strings
        allowNull: true,
    },
});

Exercise.associate = (models) => {
    Exercise.hasMany(models.CustomWorkoutExercise, { foreignKey: 'exerciseID' });
    Exercise.hasMany(models.PresetWorkoutExercise, { foreignKey: 'exerciseID' });
    Exercise.hasMany(models.ExerciseLog, { foreignKey: 'exerciseID' });
};

module.exports = Exercise;