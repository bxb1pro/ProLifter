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
        type: DataTypes.STRING,
        allowNull: false,
    },
});

ExerciseLog.associate = (models) => {
    ExerciseLog.belongsTo(models.WorkoutLog, { foreignKey: 'workoutLogID', onDelete: 'CASCADE' });
    ExerciseLog.belongsTo(models.Exercise, { foreignKey: 'exerciseID', onDelete: 'CASCADE' });
    ExerciseLog.hasMany(models.SetLog, { foreignKey: 'exerciseLogID', onDelete: 'CASCADE' });
};

module.exports = ExerciseLog;