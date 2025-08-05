const { Card, Price, sequelize } = require('../models');
const { Op } = require('sequelize');

class CardService {
  // 搜索卡牌
  async searchCards(params) {
    const {
      query,
      language,
      set,
      rarity,
      page = 1,
      pageSize = 20
    } = params;

    const whereClause = {};
    const priceWhereClause = {};

    // 搜索條件
    if (query) {
      whereClause[Op.or] = [
        { jpName: { [Op.like]: `%${query}%` } },
        { enName: { [Op.like]: `%${query}%` } },
        { cardNumber: { [Op.like]: `%${query}%` } }
      ];
    }

    if (language) {
      whereClause.language = language;
    }

    if (set) {
      whereClause.setCode = set;
    }

    if (rarity) {
      whereClause.rarity = rarity;
    }

    whereClause.isActive = true;

    try {
      const { count, rows } = await Card.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Price,
            as: 'prices',
            where: { isActive: true },
            required: false
          }
        ],
        limit: parseInt(pageSize),
        offset: (parseInt(page) - 1) * parseInt(pageSize),
        order: [['createdAt', 'DESC']]
      });

      return {
        success: true,
        data: {
          cards: rows,
          total: count,
          page: parseInt(page),
          limit: parseInt(pageSize)
        }
      };
    } catch (error) {
      console.error('Search cards error:', error);
      throw error;
    }
  }

  // 獲取卡牌詳情
  async getCardById(id) {
    try {
      const card = await Card.findOne({
        where: { id, isActive: true },
        include: [
          {
            model: Price,
            as: 'prices',
            where: { isActive: true },
            required: false,
            order: [['createdAt', 'DESC']]
          }
        ]
      });

      return card;
    } catch (error) {
      console.error('Get card by ID error:', error);
      throw error;
    }
  }

  // 獲取熱門卡牌
  async getPopularCards(limit = 10) {
    try {
      const cards = await Card.findAll({
        where: { isActive: true },
        include: [
          {
            model: Price,
            as: 'prices',
            where: { isActive: true },
            required: false,
            order: [['createdAt', 'DESC']],
            limit: 1
          }
        ],
        limit: parseInt(limit),
        order: [['createdAt', 'DESC']]
      });

      return cards;
    } catch (error) {
      console.error('Get popular cards error:', error);
      throw error;
    }
  }

  // 獲取卡牌價格歷史
  async getCardPrices(cardId, days = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const prices = await Price.findAll({
        where: {
          cardId,
          isActive: true,
          createdAt: {
            [Op.gte]: startDate
          }
        },
        order: [['createdAt', 'ASC']]
      });

      return prices;
    } catch (error) {
      console.error('Get card prices error:', error);
      throw error;
    }
  }

  // 創建新卡牌
  async createCard(cardData) {
    try {
      const card = await Card.create(cardData);
      return card;
    } catch (error) {
      console.error('Create card error:', error);
      throw error;
    }
  }

  // 更新卡牌
  async updateCard(id, cardData) {
    try {
      const card = await Card.findByPk(id);
      if (!card) {
        throw new Error('Card not found');
      }

      await card.update(cardData);
      return card;
    } catch (error) {
      console.error('Update card error:', error);
      throw error;
    }
  }

  // 刪除卡牌（軟刪除）
  async deleteCard(id) {
    try {
      const card = await Card.findByPk(id);
      if (!card) {
        throw new Error('Card not found');
      }

      await card.update({ isActive: false });
      return { success: true };
    } catch (error) {
      console.error('Delete card error:', error);
      throw error;
    }
  }
}

module.exports = new CardService(); 