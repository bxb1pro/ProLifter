const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CustomTemplateCustomWorkout = sequelize.define('CustomTemplateCustomWorkout', {
    customTemplateCustomWorkoutID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    customTemplateID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    customWorkoutID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    dateSelected: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
});

CustomTemplateCustomWorkout.associate = (models) => {
    CustomTemplateCustomWorkout.belongsTo(models.CustomTemplate, { foreignKey: 'customTemplateID', onDelete: 'CASCADE' });
    CustomTemplateCustomWorkout.belongsTo(models.CustomWorkout, { foreignKey: 'customWorkoutID', onDelete: 'CASCADE' });
};

module.exports = CustomTemplateCustomWorkout;