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
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

CustomWorkout.associate = (models) => {
    CustomWorkout.belongsTo(models.User, { foreignKey: 'userID', onDelete: 'CASCADE' });
    CustomWorkout.hasMany(models.CustomWorkoutExercise, { foreignKey: 'customWorkoutID', onDelete: 'CASCADE' });
};

module.exports = CustomWorkout;