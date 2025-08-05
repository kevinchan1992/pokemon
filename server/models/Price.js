const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Price = sequelize.define('Price', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
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
  priceJPY: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Price in Japanese Yen'
  },
  priceUSD: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Price in US Dollars'
  },
  source: {
    type: DataTypes.ENUM('mercari', 'yahoo', 'rakuten', 'ebay', 'tcgplayer', 'trollandtoad'),
    allowNull: false,
    comment: 'Price source'
  },
  condition: {
    type: DataTypes.ENUM('mint', 'near_mint', 'excellent', 'good', 'light_played', 'played', 'poor'),
    allowNull: false,
    defaultValue: 'near_mint',
    comment: 'Card condition'
  },
  url: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Source URL'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'Whether the price is active'
  }
}, {
  tableName: 'prices',
  timestamps: true,
  indexes: [
    {
      fields: ['cardId']
    },
    {
      fields: ['source']
    },
    {
      fields: ['condition']
    },
    {
      fields: ['createdAt']
    }
  ]
});

module.exports = Price; 