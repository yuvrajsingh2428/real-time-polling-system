const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Vote extends Model {}

Vote.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    pollId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Polls', // The table name to reference
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    option: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Vote',
    tableName: 'Votes', // Set the table name here
    timestamps: true,   // Enable createdAt and updatedAt columns
  }
);

module.exports = Vote;
