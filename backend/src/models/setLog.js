const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const SetLog = sequelize.define('SetLog', {
    setLogID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    setLogWeight: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    setLogReps: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    setLogRPE: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    setLog1RM: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    exerciseLogID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

SetLog.associate = (models) => {
    SetLog.belongsTo(models.ExerciseLog, { foreignKey: 'exerciseLogID' });
};

module.exports = SetLog;
