const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PresetTemplate = sequelize.define('PresetTemplate', {
    presetTemplateID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    presetTemplateName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    presetTemplateDays: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    presetTemplateDateCreated: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
});

PresetTemplate.associate = (models) => {
    PresetTemplate.hasMany(models.PresetTemplatePresetWorkout, { foreignKey: 'PresetTemplateID', onDelete: 'CASCADE' });
    PresetTemplate.hasMany(models.UserPresetTemplate, { foreignKey: 'PresetTemplateID', onDelete: 'CASCADE' });
};

module.exports = PresetTemplate;