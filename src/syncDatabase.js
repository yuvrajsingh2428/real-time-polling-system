// src/syncDatabase.js
const sequelize = require('./config/database');
const Poll = require('./models/Poll.model'); // Import the Poll model

const syncDatabase = async () => {
  try {
    // Sync all models (this will create the Poll table if it doesn't exist)
    await sequelize.sync({ force: false }); // `force: false` prevents dropping existing tables
    console.log('Database synced successfully!');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
};

syncDatabase();
