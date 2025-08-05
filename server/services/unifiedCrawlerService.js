const cron = require('node-cron');
const { Card, Price } = require('../models');
const pricechartingCrawler = require('./pricechartingCrawlerService');
const snkrdunkCrawler = require('./snkrdunkCrawlerService');
const crawlerService = require('./crawlerService');

class UnifiedCrawlerService {
  constructor() {
    this.isRunning = false;
    this.stats = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      lastRun: null,
      sources: {
        pricecharting: { success: 0, failed: 0 },
        snkrdunk: { success: 0, failed: 0 },
        mercari: { success: 0, failed: 0 }
      }
    };
  }

  // 執行所有爬蟲
  async runAllCrawlers() {
    if (this.isRunning) {
      console.log('⚠️ Unified crawling already in progress');
      return;
    }

    this.isRunning = true;
    this.stats.lastRun = new Date();

    try {
      console.log('🚀 Starting unified crawling from all sources...');
      
      // 獲取所有活躍的卡牌
      const cards = await Card.findAll({
        where: { isActive: true },
        limit: 30 // 總限制
      });

      if (cards.length === 0) {
        console.log('⚠️ No active cards found');
        return;
      }

      console.log(`📊 Found ${cards.length} active cards to crawl`);

      // 並行執行所有爬蟲
      const results = await Promise.allSettled([
        this.runPriceChartingCrawler(cards),
        this.runSNKRDUNKCrawler(cards),
        this.runMercariCrawler(cards)
      ]);

      // 統計結果
      let totalSuccess = 0;
      let totalFailed = 0;

      results.forEach((result, index) => {
        const source = ['pricecharting', 'snkrdunk', 'mercari'][index];
        if (result.status === 'fulfilled') {
          this.stats.sources[source].success += result.value || 0;
          totalSuccess += result.value || 0;
        } else {
          this.stats.sources[source].failed += 1;
          totalFailed += 1;
          console.error(`❌ ${source} crawling failed:`, result.reason);
        }
      });

      this.stats.successfulRequests += totalSuccess;
      this.stats.failedRequests += totalFailed;
      this.stats.totalRequests += cards.length;

      console.log(`✅ Unified crawling completed. Processed ${cards.length} cards`);
      console.log(`📈 Success: ${totalSuccess}, Failed: ${totalFailed}`);

    } catch (error) {
      console.error('❌ Unified crawling failed:', error);
      this.stats.failedRequests++;
    } finally {
      this.isRunning = false;
    }
  }

  // 執行 PriceCharting 爬蟲
  async runPriceChartingCrawler(cards) {
    try {
      console.log('🇺🇸 Starting PriceCharting crawler...');
      const priceData = await pricechartingCrawler.scrapeMultipleCards(cards);
      
      if (priceData.length > 0) {
        await pricechartingCrawler.savePriceData(priceData);
        console.log(`✅ PriceCharting: Found ${priceData.length} prices`);
        return priceData.length;
      }
      
      return 0;
    } catch (error) {
      console.error('❌ PriceCharting crawler failed:', error);
      throw error;
    }
  }

  // 執行 SNKRDUNK 爬蟲
  async runSNKRDUNKCrawler(cards) {
    try {
      console.log('🇯🇵 Starting SNKRDUNK crawler...');
      const priceData = await snkrdunkCrawler.scrapeMultipleCards(cards);
      
      if (priceData.length > 0) {
        await snkrdunkCrawler.savePriceData(priceData);
        console.log(`✅ SNKRDUNK: Found ${priceData.length} prices`);
        return priceData.length;
      }
      
      return 0;
    } catch (error) {
      console.error('❌ SNKRDUNK crawler failed:', error);
      throw error;
    }
  }

  // 執行 Mercari 爬蟲
  async runMercariCrawler(cards) {
    try {
      console.log('🇯🇵 Starting Mercari crawler...');
      const priceData = await crawlerService.scrapeMultipleCards(cards, ['mercari']);
      
      if (priceData.length > 0) {
        await crawlerService.savePriceData(priceData);
        console.log(`✅ Mercari: Found ${priceData.length} prices`);
        return priceData.length;
      }
      
      return 0;
    } catch (error) {
      console.error('❌ Mercari crawler failed:', error);
      throw error;
    }
  }

  // 手動執行單個爬蟲
  async runSingleCrawler(source) {
    try {
      console.log(`🚀 Starting ${source} crawler...`);
      
      const cards = await Card.findAll({
        where: { isActive: true },
        limit: 10
      });

      if (cards.length === 0) {
        console.log('⚠️ No active cards found');
        return;
      }

      let result;
      switch (source) {
        case 'pricecharting':
          result = await this.runPriceChartingCrawler(cards);
          break;
        case 'snkrdunk':
          result = await this.runSNKRDUNKCrawler(cards);
          break;
        case 'mercari':
          result = await this.runMercariCrawler(cards);
          break;
        default:
          throw new Error(`Unknown source: ${source}`);
      }

      console.log(`✅ ${source} crawler completed with ${result} results`);
      return result;

    } catch (error) {
      console.error(`❌ ${source} crawler failed:`, error);
      throw error;
    }
  }

  // 啟動定時任務
  startScheduledCrawling() {
    // 每小時執行一次統一爬蟲
    cron.schedule('0 * * * *', () => {
      console.log('⏰ Running scheduled unified crawling...');
      this.runAllCrawlers();
    });

    // 每6小時執行一次單個爬蟲（輪流）
    let currentSource = 0;
    const sources = ['pricecharting', 'snkrdunk', 'mercari'];
    
    cron.schedule('0 */6 * * *', () => {
      const source = sources[currentSource];
      console.log(`⏰ Running scheduled ${source} crawling...`);
      this.runSingleCrawler(source);
      currentSource = (currentSource + 1) % sources.length;
    });

    console.log('✅ Scheduled crawling started');
    console.log('📅 Unified crawling: Every hour');
    console.log('📅 Single source crawling: Every 6 hours (rotating)');
  }

  // 獲取統計信息
  getStats() {
    const successRate = this.stats.totalRequests > 0 
      ? (this.stats.successfulRequests / this.stats.totalRequests * 100).toFixed(2)
      : 0;

    return {
      ...this.stats,
      successRate: `${successRate}%`,
      isRunning: this.isRunning,
      sources: this.stats.sources
    };
  }

  // 清理舊數據
  async cleanupOldData() {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const deletedCount = await Price.destroy({
        where: {
          updatedAt: {
            [require('sequelize').Op.lt]: thirtyDaysAgo
          },
          isActive: false
        }
      });

      console.log(`🧹 Cleaned up ${deletedCount} old price records`);
      return deletedCount;
    } catch (error) {
      console.error('❌ Cleanup failed:', error);
      throw error;
    }
  }

  // 測試爬蟲連接
  async testConnections() {
    const results = {};
    
    try {
      console.log('🔍 Testing PriceCharting connection...');
      const testCard = await Card.findOne({ where: { isActive: true } });
      
      if (testCard) {
        const priceData = await pricechartingCrawler.scrapeCardPrice(testCard.enName || testCard.jpName);
        results.pricecharting = priceData ? '✅ Connected' : '❌ No data found';
      } else {
        results.pricecharting = '⚠️ No test card available';
      }
    } catch (error) {
      results.pricecharting = `❌ Error: ${error.message}`;
    }

    try {
      console.log('🔍 Testing SNKRDUNK connection...');
      const testCard = await Card.findOne({ where: { isActive: true } });
      
      if (testCard) {
        const priceData = await snkrdunkCrawler.scrapeCardPrice(testCard.jpName || testCard.enName);
        results.snkrdunk = priceData ? '✅ Connected' : '❌ No data found';
      } else {
        results.snkrdunk = '⚠️ No test card available';
      }
    } catch (error) {
      results.snkrdunk = `❌ Error: ${error.message}`;
    }

    console.log('📊 Connection test results:', results);
    return results;
  }
}

module.exports = new UnifiedCrawlerService(); 