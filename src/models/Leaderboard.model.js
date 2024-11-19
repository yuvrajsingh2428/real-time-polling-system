// models/Leaderboard.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Leaderboard = sequelize.define('Leaderboard', {
  pollId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  option: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  voteCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

module.exports = Leaderboard;
