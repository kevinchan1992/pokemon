const { sequelize, testConnection } = require('../config/database');
const Card = require('./Card');
const Price = require('./Price');
const User = require('./User');
const Favorite = require('./Favorite');
const PriceAlert = require('./PriceAlert');

// 定義模型關聯
Card.hasMany(Price, { foreignKey: 'cardId', as: 'prices' });
Price.belongsTo(Card, { foreignKey: 'cardId', as: 'card' });

User.hasMany(Favorite, { foreignKey: 'userId', as: 'favorites' });
Favorite.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Card.hasMany(Favorite, { foreignKey: 'cardId', as: 'favorites' });
Favorite.belongsTo(Card, { foreignKey: 'cardId', as: 'card' });

User.hasMany(PriceAlert, { foreignKey: 'userId', as: 'priceAlerts' });
PriceAlert.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Card.hasMany(PriceAlert, { foreignKey: 'cardId', as: 'priceAlerts' });
PriceAlert.belongsTo(Card, { foreignKey: 'cardId', as: 'card' });

// 同步數據庫
const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log('✅ Database synchronized successfully.');
  } catch (error) {
    console.error('❌ Database sync failed:', error);
  }
};

// 初始化數據庫
const initializeDatabase = async () => {
  await testConnection();
  await syncDatabase();
};

module.exports = {
  sequelize,
  Card,
  Price,
  User,
  Favorite,
  PriceAlert,
  syncDatabase,
  initializeDatabase
}; 