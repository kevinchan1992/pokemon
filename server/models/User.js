const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    },
    comment: 'User email address'
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: 'Username'
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Hashed password'
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'First name'
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Last name'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'Whether the user is active'
  },
  lastLoginAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Last login timestamp'
  }
}, {
  tableName: 'users',
  timestamps: true,
  indexes: [
    {
      fields: ['email']
    },
    {
      fields: ['username']
    }
  ]
});

module.exports = User; 