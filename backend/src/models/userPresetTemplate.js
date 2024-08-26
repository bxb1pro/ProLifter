const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const UserPresetTemplate = sequelize.define('UserPresetTemplate', {
    userPresetTemplateID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    presetTemplateID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    dateSelected: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
});

UserPresetTemplate.associate = (models) => {
    UserPresetTemplate.belongsTo(models.User, { foreignKey: 'userID' });
    UserPresetTemplate.belongsTo(models.PresetTemplate, { foreignKey: 'presetTemplateID' });
};

module.exports = UserPresetTemplate;