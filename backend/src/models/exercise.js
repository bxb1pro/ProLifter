const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Exercise = sequelize.define('Exercise', {
    exerciseID: {
        type: DataTypes.UUID, //different id data type so it can work with public API
        defaultValue: DataTypes.UUIDV4,
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
        type: DataTypes.STRING,
        allowNull: true,
    },
    exerciseFormGuide: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    exerciseImageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    exerciseVideoUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    exerciseEquipment: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});

module.exports = Exercise;