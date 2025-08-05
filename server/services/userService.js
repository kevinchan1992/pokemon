const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Favorite, PriceAlert } = require('../models');

class UserService {
  // 用戶註冊
  async register(userData) {
    try {
      const { email, username, password, firstName, lastName } = userData;

      // 檢查用戶是否已存在
      const existingUser = await User.findOne({
        where: {
          [require('sequelize').Op.or]: [
            { email: email },
            { username: username }
          ]
        }
      });

      if (existingUser) {
        throw new Error('User already exists');
      }

      // 加密密碼
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // 創建用戶
      const user = await User.create({
        email,
        username,
        password: hashedPassword,
        firstName,
        lastName
      });

      // 生成 JWT Token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || 'your-super-secret-jwt-key',
        { expiresIn: '7d' }
      );

      return {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName
          },
          token
        }
      };
    } catch (error) {
      console.error('User registration error:', error);
      throw error;
    }
  }

  // 用戶登錄
  async login(credentials) {
    try {
      const { email, password } = credentials;

      // 查找用戶
      const user = await User.findOne({
        where: {
          [require('sequelize').Op.or]: [
            { email: email },
            { username: email }
          ],
          isActive: true
        }
      });

      if (!user) {
        throw new Error('Invalid credentials');
      }

      // 驗證密碼
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error('Invalid credentials');
      }

      // 更新最後登錄時間
      await user.update({ lastLoginAt: new Date() });

      // 生成 JWT Token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || 'your-super-secret-jwt-key',
        { expiresIn: '7d' }
      );

      return {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName
          },
          token
        }
      };
    } catch (error) {
      console.error('User login error:', error);
      throw error;
    }
  }

  // 獲取用戶信息
  async getUserProfile(userId) {
    try {
      const user = await User.findByPk(userId, {
        attributes: { exclude: ['password'] }
      });

      if (!user) {
        throw new Error('User not found');
      }

      return {
        success: true,
        data: user
      };
    } catch (error) {
      console.error('Get user profile error:', error);
      throw error;
    }
  }

  // 更新用戶信息
  async updateUserProfile(userId, updateData) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // 如果更新密碼，需要加密
      if (updateData.password) {
        const saltRounds = 10;
        updateData.password = await bcrypt.hash(updateData.password, saltRounds);
      }

      await user.update(updateData);

      return {
        success: true,
        data: {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName
        }
      };
    } catch (error) {
      console.error('Update user profile error:', error);
      throw error;
    }
  }

  // 添加收藏
  async addFavorite(userId, cardId, notes = null) {
    try {
      const [favorite, created] = await Favorite.findOrCreate({
        where: { userId, cardId },
        defaults: { notes }
      });

      if (!created) {
        throw new Error('Card already in favorites');
      }

      return {
        success: true,
        data: favorite
      };
    } catch (error) {
      console.error('Add favorite error:', error);
      throw error;
    }
  }

  // 移除收藏
  async removeFavorite(userId, cardId) {
    try {
      const deleted = await Favorite.destroy({
        where: { userId, cardId }
      });

      if (!deleted) {
        throw new Error('Favorite not found');
      }

      return {
        success: true,
        message: 'Favorite removed successfully'
      };
    } catch (error) {
      console.error('Remove favorite error:', error);
      throw error;
    }
  }

  // 獲取用戶收藏
  async getUserFavorites(userId, page = 1, pageSize = 20) {
    try {
      const { count, rows } = await Favorite.findAndCountAll({
        where: { userId },
        include: [
          {
            model: require('./cardService').Card,
            as: 'card',
            where: { isActive: true }
          }
        ],
        limit: parseInt(pageSize),
        offset: (parseInt(page) - 1) * parseInt(pageSize),
        order: [['createdAt', 'DESC']]
      });

      return {
        success: true,
        data: {
          favorites: rows,
          total: count,
          page: parseInt(page),
          limit: parseInt(pageSize)
        }
      };
    } catch (error) {
      console.error('Get user favorites error:', error);
      throw error;
    }
  }

  // 設置價格警報
  async setPriceAlert(userId, cardId, alertData) {
    try {
      const { targetPriceJPY, targetPriceUSD, alertType = 'below' } = alertData;

      const [alert, created] = await PriceAlert.findOrCreate({
        where: { userId, cardId },
        defaults: {
          targetPriceJPY,
          targetPriceUSD,
          alertType,
          isActive: true
        }
      });

      if (!created) {
        // 更新現有警報
        await alert.update({
          targetPriceJPY,
          targetPriceUSD,
          alertType,
          isActive: true
        });
      }

      return {
        success: true,
        data: alert
      };
    } catch (error) {
      console.error('Set price alert error:', error);
      throw error;
    }
  }

  // 移除價格警報
  async removePriceAlert(userId, cardId) {
    try {
      const deleted = await PriceAlert.destroy({
        where: { userId, cardId }
      });

      if (!deleted) {
        throw new Error('Price alert not found');
      }

      return {
        success: true,
        message: 'Price alert removed successfully'
      };
    } catch (error) {
      console.error('Remove price alert error:', error);
      throw error;
    }
  }

  // 獲取用戶價格警報
  async getUserPriceAlerts(userId) {
    try {
      const alerts = await PriceAlert.findAll({
        where: { userId, isActive: true },
        include: [
          {
            model: require('./cardService').Card,
            as: 'card',
            where: { isActive: true }
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      return {
        success: true,
        data: alerts
      };
    } catch (error) {
      console.error('Get user price alerts error:', error);
      throw error;
    }
  }
}

module.exports = new UserService(); 