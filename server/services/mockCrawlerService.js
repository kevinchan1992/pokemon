const { Card, Price } = require('../models');

class MockCrawlerService {
  constructor() {
    this.isRunning = false;
    this.stats = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      lastRun: null
    };
  }

  // 模擬價格數據
  generateMockPriceData(card) {
    const basePrice = Math.floor(Math.random() * 5000) + 1000; // 1000-6000 日元
    const condition = Math.floor(Math.random() * 5) + 1; // 1-5 品相等級
    
    return {
      cardId: card.id,
      priceJPY: basePrice,
      priceUSD: Math.round(basePrice / 150 * 100) / 100, // 粗略匯率轉換
      source: 'mercari',
      condition: condition,
      url: `https://jp.mercari.com/item/${Math.random().toString(36).substr(2, 9)}`,
      isActive: true
    };
  }

  // 模擬抓取延遲
  async simulateDelay() {
    const delay = Math.floor(Math.random() * 2000) + 1000; // 1-3秒
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  // 執行模擬價格抓取
  async runPriceCrawling() {
    if (this.isRunning) {
      console.log('⚠️ Crawling already in progress');
      return;
    }

    this.isRunning = true;
    this.stats.lastRun = new Date();

    try {
      console.log('🚀 Starting mock price crawling...');
      
      // 獲取所有活躍的卡牌
      const cards = await Card.findAll({
        where: { isActive: true },
        limit: 5 // 限制數量
      });

      if (cards.length === 0) {
        console.log('⚠️ No active cards found');
        return;
      }

      const priceData = [];

      for (const card of cards) {
        try {
          // 模擬抓取延遲
          await this.simulateDelay();
          
          // 生成模擬價格數據
          const mockPrice = this.generateMockPriceData(card);
          priceData.push(mockPrice);
          
          console.log(`✅ Mock scraped price for ${card.jpName}: ¥${mockPrice.priceJPY}`);
          
        } catch (error) {
          console.error(`❌ Failed to mock scrape ${card.jpName}:`, error);
          this.stats.failedRequests++;
        }
      }

      if (priceData.length > 0) {
        // 保存到數據庫
        await this.savePriceData(priceData);
        this.stats.successfulRequests += priceData.length;
      }

      this.stats.totalRequests += cards.length;
      console.log(`✅ Mock crawling completed. Processed ${cards.length} cards, generated ${priceData.length} prices`);

    } catch (error) {
      console.error('❌ Mock crawling failed:', error);
      this.stats.failedRequests++;
    } finally {
      this.isRunning = false;
    }
  }

  // 保存價格數據到數據庫
  async savePriceData(priceData) {
    try {
      await Price.bulkCreate(priceData, {
        updateOnDuplicate: ['priceJPY', 'priceUSD', 'condition', 'updatedAt']
      });

      console.log(`✅ Saved ${priceData.length} mock price records`);
      return priceData.length;
    } catch (error) {
      console.error('❌ Failed to save mock price data:', error);
      throw error;
    }
  }

  // 獲取爬蟲統計
  getStats() {
    const successRate = this.stats.totalRequests > 0 
      ? (this.stats.successfulRequests / this.stats.totalRequests * 100).toFixed(2)
      : 0;

    return {
      ...this.stats,
      successRate: `${successRate}%`,
      isRunning: this.isRunning
    };
  }
}

module.exports = new MockCrawlerService(); 