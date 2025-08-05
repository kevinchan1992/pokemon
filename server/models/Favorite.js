const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Favorite = sequelize.define('Favorite', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    comment: 'Reference to user'
  },
  cardId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'cards',
      key: 'id'
    },
    comment: 'Reference to card'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'User notes about the card'
  }
}, {
  tableName: 'favorites',
  timestamps: true,
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['cardId']
    },
    {
      unique: true,
      fields: ['userId', 'cardId']
    }
  ]
});

module.exports = Favorite; 