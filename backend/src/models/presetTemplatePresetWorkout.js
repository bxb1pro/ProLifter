const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PresetTemplatePresetWorkout = sequelize.define('PresetTemplatePresetWorkout', {
    presetTemplatePresetWorkoutID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    presetTemplateID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    presetWorkoutID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    dateSelected: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
});

PresetTemplatePresetWorkout.associate = (models) => {
    PresetTemplatePresetWorkout.belongsTo(models.PresetTemplate, { foreignKey: 'presetTemplateID', onDelete: 'CASCADE' });
    PresetTemplatePresetWorkout.belongsTo(models.PresetWorkout, { foreignKey: 'presetWorkoutID', onDelete: 'CASCADE' });
};

module.exports = PresetTemplatePresetWorkout;