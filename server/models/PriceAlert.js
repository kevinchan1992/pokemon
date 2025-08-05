const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PriceAlert = sequelize.define('PriceAlert', {
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
  targetPriceJPY: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Target price in JPY'
  },
  targetPriceUSD: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Target price in USD'
  },
  alertType: {
    type: DataTypes.ENUM('below', 'above', 'both'),
    allowNull: false,
    defaultValue: 'below',
    comment: 'Alert type'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'Whether the alert is active'
  },
  lastTriggeredAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Last time alert was triggered'
  }
}, {
  tableName: 'price_alerts',
  timestamps: true,
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['cardId']
    },
    {
      fields: ['isActive']
    }
  ]
});

module.exports = PriceAlert; 