const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Poll = sequelize.define('Poll', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  question: {
    type: DataTypes.STRING,
    allowNull: false, // Poll question is required
  },
  pollOption: {  // Renamed from `option` to `pollOption`
    type: DataTypes.JSONB,
    allowNull: false,
  },
}, {
  timestamps: true, // This will add `createdAt` and `updatedAt` fields automatically
  tableName: 'Polls'
});

module.exports = Poll;
