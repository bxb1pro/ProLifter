const app = require('./app');
const sequelize = require('./config/db');

const PORT = process.env.PORT || 5001;

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully.');
        await sequelize.sync({ alter: true }); // sync models with the database
        console.log('Database synced successfully.');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

startServer();



//await sequelize.sync({ force: true });   //drops all tables and re-creates, but erases all existing data
//await sequelize.sync({ alter: true });   //attempts to modify tables with migration changes, but won't always work
//await sequelize.sync(); // sync models with the database