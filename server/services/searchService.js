const { 
  testConnection, 
  createIndexMapping, 
  bulkIndexCards, 
  searchCards 
} = require('../config/elasticsearch');
const { Card } = require('../models');

class SearchService {
  constructor() {
    this.isElasticsearchAvailable = false;
    this.initializeElasticsearch();
  }

  // 初始化 Elasticsearch
  async initializeElasticsearch() {
    try {
      this.isElasticsearchAvailable = await testConnection();
      if (this.isElasticsearchAvailable) {
        await createIndexMapping();
        await this.syncCardsToElasticsearch();
        console.log('✅ Elasticsearch initialized successfully');
      } else {
        console.log('⚠️ Elasticsearch not available, using database search');
      }
    } catch (error) {
      console.error('❌ Elasticsearch initialization failed:', error);
      this.isElasticsearchAvailable = false;
    }
  }

  // 同步卡牌到 Elasticsearch
  async syncCardsToElasticsearch() {
    try {
      const cards = await Card.findAll({
        where: { isActive: true },
        raw: true
      });

      if (cards.length > 0) {
        await bulkIndexCards(cards);
        console.log(`✅ Synced ${cards.length} cards to Elasticsearch`);
      }
    } catch (error) {
      console.error('❌ Sync to Elasticsearch failed:', error);
    }
  }

  // 搜索卡牌
  async searchCards(params) {
    const {
      query,
      language,
      set,
      rarity,
      type,
      page = 1,
      pageSize = 20
    } = params;

    // 如果 Elasticsearch 可用，使用它進行搜索
    if (this.isElasticsearchAvailable) {
      try {
        const filters = {};
        if (language) filters.language = language;
        if (set) filters.set = set;
        if (rarity) filters.rarity = rarity;
        if (type) filters.type = type;

        const result = await searchCards(query, filters, page, pageSize);
        
        return {
          success: true,
          data: {
            cards: result.hits,
            total: result.total,
            page: result.page,
            limit: result.size
          }
        };
      } catch (error) {
        console.error('Elasticsearch search failed, falling back to database:', error);
        // 如果 Elasticsearch 搜索失敗，回退到數據庫搜索
        return this.databaseSearch(params);
      }
    } else {
      // 使用數據庫搜索
      return this.databaseSearch(params);
    }
  }

  // 數據庫搜索（回退方案）
  async databaseSearch(params) {
    const {
      query,
      language,
      set,
      rarity,
      page = 1,
      pageSize = 20
    } = params;

    const { Op } = require('sequelize');
    const whereClause = {};

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
      console.error('Database search error:', error);
      throw error;
    }
  }

  // 獲取搜索建議
  async getSearchSuggestions(query, limit = 5) {
    if (!this.isElasticsearchAvailable) {
      return [];
    }

    try {
      const { Op } = require('sequelize');
      const suggestions = await Card.findAll({
        where: {
          [Op.or]: [
            { jpName: { [Op.like]: `%${query}%` } },
            { enName: { [Op.like]: `%${query}%` } }
          ],
          isActive: true
        },
        attributes: ['jpName', 'enName'],
        limit: limit,
        order: [['jpName', 'ASC']]
      });

      return suggestions.map(s => ({
        jpName: s.jpName,
        enName: s.enName
      }));
    } catch (error) {
      console.error('Get search suggestions error:', error);
      return [];
    }
  }

  // 獲取熱門搜索詞
  async getPopularSearches(limit = 10) {
    // 這裡可以實現基於搜索歷史的熱門詞統計
    // 目前返回預設的熱門搜索詞
    return [
      'ピカチュウ',
      'Pikachu',
      'リザードン',
      'Charizard',
      'ミュウツー',
      'Mewtwo',
      'ルカリオ',
      'Lucario',
      'ガルーラ',
      'Gengar'
    ].slice(0, limit);
  }

  // 重新索引所有卡牌
  async reindexAllCards() {
    if (!this.isElasticsearchAvailable) {
      throw new Error('Elasticsearch not available');
    }

    try {
      const cards = await Card.findAll({
        where: { isActive: true },
        raw: true
      });

      await bulkIndexCards(cards);
      console.log(`✅ Reindexed ${cards.length} cards`);
      return { success: true, count: cards.length };
    } catch (error) {
      console.error('❌ Reindex failed:', error);
      throw error;
    }
  }
}

module.exports = new SearchService(); 