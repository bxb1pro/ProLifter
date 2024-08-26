const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CustomTemplatePresetWorkout = sequelize.define('CustomTemplatePresetWorkout', {
    customTemplatePresetWorkoutID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    customTemplateID: {
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

CustomTemplatePresetWorkout.associate = (models) => {
    CustomTemplatePresetWorkout.belongsTo(models.CustomTemplate, { foreignKey: 'customTemplateID' });
    CustomTemplatePresetWorkout.belongsTo(models.PresetWorkout, { foreignKey: 'presetWorkoutID' });
};

module.exports = CustomTemplatePresetWorkout;