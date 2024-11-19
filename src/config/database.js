// src/config/database.js
require('dotenv').config(); // Load environment variables

const { Sequelize } = require('sequelize');

// Create a new instance of Sequelize to connect to PostgreSQL using environment variables
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  logging: false, // Disable Sequelize logging
});


// In your `database.js` or main sequelize setup file

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

module.exports = sequelize;
