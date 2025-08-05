const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Card = sequelize.define('Card', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  jpName: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Japanese card name'
  },
  enName: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'English card name'
  },
  cardNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Card number in set'
  },
  rarity: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Card rarity'
  },
  set: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Card set name'
  },
  setCode: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Card set code'
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Card image URL'
  },
  releaseDate: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: 'Card release date'
  },
  language: {
    type: DataTypes.ENUM('jp', 'en'),
    allowNull: false,
    defaultValue: 'jp',
    comment: 'Card language'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Card description'
  },
  hp: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Card HP (for Pokemon cards)'
  },
  type: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Card type (Pokemon, Trainer, Energy)'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'Whether the card is active'
  }
}, {
  tableName: 'cards',
  timestamps: true,
  indexes: [
    {
      fields: ['jpName']
    },
    {
      fields: ['enName']
    },
    {
      fields: ['setCode']
    },
    {
      fields: ['rarity']
    },
    {
      fields: ['language']
    }
  ]
});

module.exports = Card; 