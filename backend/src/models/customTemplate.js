const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CustomTemplate = sequelize.define('CustomTemplate', {
    customTemplateID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    customTemplateName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    customTemplateDays: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    customTemplateDateCreated: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    userID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

CustomTemplate.associate = (models) => {
    CustomTemplate.belongsTo(models.User, { foreignKey: 'userID', onDelete: 'CASCADE' });
    CustomTemplate.hasMany(models.CustomTemplateCustomWorkout, { foreignKey: 'customTemplateID', onDelete: 'CASCADE' });
    CustomTemplate.hasMany(models.CustomTemplatePresetWorkout, { foreignKey: 'customTemplateID', onDelete: 'CASCADE' });
};

module.exports = CustomTemplate;