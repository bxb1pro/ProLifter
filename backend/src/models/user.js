const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
    userID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    userPasswordHash: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('user', 'admin', 'superadmin'), //ENUM to force one of these three values
        defaultValue: 'user',
        allowNull: false,
    },
    userAge: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    userExperienceLevel: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ueserWeightliftingGoal: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});

User.associate = (models) => {
    User.hasMany(models.CustomWorkout, { foreignKey: 'userID', onDelete: 'CASCADE' });
    User.hasMany(models.WorkoutLog, { foreignKey: 'userID', onDelete: 'CASCADE' });
    User.hasMany(models.UserPresetWorkout, { foreignKey: 'userID', onDelete: 'CASCADE' });
    User.hasMany(models.CustomTemplate, { foreignKey: 'userID', onDelete: 'CASCADE' });
    User.hasMany(models.UserPresetTemplate, { foreignKey: 'userID', onDelete: 'CASCADE' });
};

module.exports = User;