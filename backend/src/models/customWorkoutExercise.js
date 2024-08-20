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

CustomWorkoutExercise.associate = (models) => {
    CustomWorkoutExercise.belongsTo(models.CustomWorkout, { foreignKey: 'customWorkoutID' });
    CustomWorkoutExercise.belongsTo(models.Exercise, { foreignKey: 'exerciseID' });
};

module.exports = CustomWorkoutExercise;