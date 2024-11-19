// src/testConnection.js
const sequelize = require('./config/database');

const testConnection = async () => {
  try {
    await sequelize.authenticate(); // Test the connection
    console.log('Database connection successful!');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
};

testConnection();
