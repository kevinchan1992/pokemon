const puppeteer = require('puppeteer');
const axios = require('axios');
const cheerio = require('cheerio');
const cron = require('node-cron');
const { Card, Price } = require('../models');
const { 
  CRAWLER_CONFIG, 
  getHeaders, 
  delay, 
  randomDelay 
} = require('../config/crawler');

class CrawlerService {
  constructor() {
    this.browser = null;
    this.isRunning = false;
    this.stats = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      lastRun: null
    };
  }

  // 初始化瀏覽器
  async initializeBrowser() {
    try {
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      });
      console.log('✅ Browser initialized successfully');
    } catch (error) {
      console.error('❌ Browser initialization failed:', error);
      throw error;
    }
  }

  // 關閉瀏覽器
  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  // 道德爬取檢查
  async checkRobotsTxt(url) {
    try {
      const robotsUrl = new URL('/robots.txt', url).href;
      const response = await axios.get(robotsUrl, {
        headers: getHeaders(),
        timeout: 5000
      });
      
      const robotsContent = response.data;
      const userAgent = CRAWLER_CONFIG.ethical.userAgent;
      
      // 簡單的 robots.txt 解析
      if (robotsContent.includes(`User-agent: ${userAgent}`) || 
          robotsContent.includes('User-agent: *')) {
        const lines = robotsContent.split('\n');
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].includes('Disallow:') && lines[i + 1]) {
            const disallowPath = lines[i + 1].trim();
            if (url.includes(disallowPath)) {
              return false;
            }
          }
        }
      }
      
      return true;
    } catch (error) {
      console.warn('⚠️ Robots.txt check failed, proceeding with caution');
      return true;
    }
  }

  // 價格數據正規化
  normalizePrice(priceText, currency = 'JPY') {
    if (!priceText) return null;
    
    // 移除貨幣符號和空格
    let normalized = priceText.replace(/[¥$€,\s]/g, '');
    
    // 提取數字
    const match = normalized.match(/(\d+(?:\.\d+)?)/);
    if (!match) return null;
    
    const price = parseFloat(match[1]);
    return {
      amount: price,
      currency: currency,
      original: priceText
    };
  }

  // 品相等級映射
  normalizeCondition(conditionText) {
    if (!conditionText) return null;
    
    const mapping = CRAWLER_CONFIG.dataProcessing.conditionMapping;
    const normalized = conditionText.trim().toUpperCase();
    
    for (const [key, value] of Object.entries(mapping)) {
      if (normalized.includes(key)) {
        return value;
      }
    }
    
    return 3; // 默認中等品相
  }

  // 動態內容抓取（使用 Puppeteer）
  async scrapeDynamicContent(url, selectors) {
    if (!this.browser) {
      await this.initializeBrowser();
    }

    const page = await this.browser.newPage();
    
    try {
      // 設置用戶代理
      await page.setUserAgent(getHeaders()['User-Agent']);
      
      // 設置視窗大小
      await page.setViewport({ width: 1920, height: 1080 });
      
      // 導航到頁面
      await page.goto(url, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });

      // 等待頁面加載
      await delay(2000);

      // 提取數據
      const data = {};
      
      for (const [key, selector] of Object.entries(selectors)) {
        try {
          const element = await page.$(selector);
          if (element) {
            data[key] = await element.evaluate(el => el.textContent.trim());
          }
        } catch (error) {
          console.warn(`⚠️ Failed to extract ${key}:`, error.message);
        }
      }

      return data;
    } catch (error) {
      console.error('❌ Dynamic scraping failed:', error);
      throw error;
    } finally {
      await page.close();
    }
  }

  // 靜態內容抓取（使用 Cheerio）
  async scrapeStaticContent(url, selectors) {
    try {
      const response = await axios.get(url, {
        headers: getHeaders(),
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      const data = {};

      for (const [key, selector] of Object.entries(selectors)) {
        try {
          const element = $(selector);
          if (element.length > 0) {
            data[key] = element.text().trim();
          }
        } catch (error) {
          console.warn(`⚠️ Failed to extract ${key}:`, error.message);
        }
      }

      return data;
    } catch (error) {
      console.error('❌ Static scraping failed:', error);
      throw error;
    }
  }

  // 抓取單個卡牌價格
  async scrapeCardPrice(cardName, platform = 'mercari') {
    try {
      const platformConfig = CRAWLER_CONFIG.targets.japan[platform];
      if (!platformConfig) {
        throw new Error(`Platform ${platform} not configured`);
      }

      // 道德爬取檢查
      const canCrawl = await this.checkRobotsTxt(platformConfig.baseUrl);
      if (!canCrawl) {
        throw new Error('Crawling not allowed by robots.txt');
      }

      // 構建搜索 URL
      const searchUrl = `${platformConfig.baseUrl}${platformConfig.searchPath}?keyword=${encodeURIComponent(cardName)}`;
      
      // 隨機延遲
      await randomDelay(platformConfig.delay, platformConfig.delay + 1000);

      // 抓取數據
      let scrapedData;
      try {
        // 嘗試動態抓取
        scrapedData = await this.scrapeDynamicContent(searchUrl, platformConfig.selectors);
      } catch (error) {
        console.warn('⚠️ Dynamic scraping failed, trying static:', error.message);
        // 回退到靜態抓取
        scrapedData = await this.scrapeStaticContent(searchUrl, platformConfig.selectors);
      }

      // 處理抓取的數據
      const processedData = {
        cardName: scrapedData.cardTitle || cardName,
        price: this.normalizePrice(scrapedData.price),
        condition: this.normalizeCondition(scrapedData.condition),
        imageUrl: scrapedData.image,
        source: platform,
        url: searchUrl,
        scrapedAt: new Date()
      };

      return processedData;
    } catch (error) {
      console.error(`❌ Failed to scrape ${cardName} from ${platform}:`, error);
      throw error;
    }
  }

  // 批量抓取卡牌價格
  async scrapeMultipleCards(cards, platforms = ['mercari']) {
    const results = [];
    
    for (const card of cards) {
      for (const platform of platforms) {
        try {
          const priceData = await this.scrapeCardPrice(card.jpName || card.enName, platform);
          
          if (priceData.price) {
            results.push({
              cardId: card.id,
              ...priceData
            });
          }
          
          // 請求間隔
          await delay(CRAWLER_CONFIG.ethical.crawlDelay);
          
        } catch (error) {
          console.error(`❌ Failed to scrape ${card.jpName} from ${platform}:`, error);
          this.stats.failedRequests++;
        }
      }
    }
    
    return results;
  }

  // 保存價格數據到數據庫
  async savePriceData(priceData) {
    try {
      const priceRecords = priceData.map(data => ({
        cardId: data.cardId,
        priceJPY: data.price.currency === 'JPY' ? data.price.amount : null,
        priceUSD: data.price.currency === 'USD' ? data.price.amount : null,
        source: data.source,
        condition: data.condition,
        url: data.url,
        isActive: true
      }));

      await Price.bulkCreate(priceRecords, {
        updateOnDuplicate: ['priceJPY', 'priceUSD', 'condition', 'updatedAt']
      });

      console.log(`✅ Saved ${priceRecords.length} price records`);
      return priceRecords.length;
    } catch (error) {
      console.error('❌ Failed to save price data:', error);
      throw error;
    }
  }

  // 執行完整的價格抓取任務
  async runPriceCrawling() {
    if (this.isRunning) {
      console.log('⚠️ Crawling already in progress');
      return;
    }

    this.isRunning = true;
    this.stats.lastRun = new Date();

    try {
      console.log('🚀 Starting price crawling...');
      
      // 獲取所有活躍的卡牌
      const cards = await Card.findAll({
        where: { isActive: true },
        limit: 10 // 限制數量避免過度請求
      });

      if (cards.length === 0) {
        console.log('⚠️ No active cards found');
        return;
      }

      // 抓取價格數據
      const priceData = await this.scrapeMultipleCards(cards, ['mercari']);
      
      if (priceData.length > 0) {
        // 保存到數據庫
        await this.savePriceData(priceData);
        this.stats.successfulRequests += priceData.length;
      }

      this.stats.totalRequests += cards.length;
      console.log(`✅ Crawling completed. Processed ${cards.length} cards, found ${priceData.length} prices`);

    } catch (error) {
      console.error('❌ Crawling failed:', error);
      this.stats.failedRequests++;
    } finally {
      this.isRunning = false;
    }
  }

  // 啟動定時任務
  startScheduledCrawling() {
    // 每小時執行一次
    cron.schedule('0 * * * *', () => {
      console.log('⏰ Running scheduled price crawling...');
      this.runPriceCrawling();
    });

    console.log('✅ Scheduled crawling started (hourly)');
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

module.exports = new CrawlerService(); 