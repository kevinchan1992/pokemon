const puppeteer = require('puppeteer');
const axios = require('axios');
const cheerio = require('cheerio');
const { Card, Price } = require('../models');
const { getHeaders, delay, randomDelay } = require('../config/crawler');

class PriceChartingCrawlerService {
  constructor() {
    this.browser = null;
    this.isRunning = false;
    this.baseUrl = 'https://www.pricecharting.com';
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
          '--disable-gpu',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor'
        ]
      });
      console.log('✅ PriceCharting browser initialized');
    } catch (error) {
      console.error('❌ PriceCharting browser initialization failed:', error);
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

  // 搜索卡牌
  async searchCard(cardName) {
    if (!this.browser) {
      await this.initializeBrowser();
    }

    const page = await this.browser.newPage();
    
    try {
      // 設置用戶代理
      await page.setUserAgent(getHeaders()['User-Agent']);
      await page.setViewport({ width: 1920, height: 1080 });

      // 構建搜索 URL
      const searchUrl = `${this.baseUrl}/search?q=${encodeURIComponent(cardName)}`;
      
      console.log(`🔍 Searching for: ${cardName}`);
      console.log(`📄 URL: ${searchUrl}`);

      // 導航到搜索頁面
      await page.goto(searchUrl, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });

      // 等待頁面加載
      await delay(3000);

      // 等待搜索結果出現
      await page.waitForSelector('.product-item, .card-item, .search-result', { timeout: 10000 });

      // 提取搜索結果
      const results = await page.evaluate(() => {
        const items = document.querySelectorAll('.product-item, .card-item, .search-result');
        return Array.from(items).map(item => {
          const titleElement = item.querySelector('.product-title, .card-title, .item-title');
          const priceElement = item.querySelector('.price, .current-price, .market-price');
          const imageElement = item.querySelector('img');
          const linkElement = item.querySelector('a');

          return {
            title: titleElement ? titleElement.textContent.trim() : '',
            price: priceElement ? priceElement.textContent.trim() : '',
            image: imageElement ? imageElement.src : '',
            url: linkElement ? linkElement.href : '',
            condition: this.extractCondition(item.textContent)
          };
        });
      });

      console.log(`✅ Found ${results.length} results for ${cardName}`);
      return results;

    } catch (error) {
      console.error(`❌ Search failed for ${cardName}:`, error);
      throw error;
    } finally {
      await page.close();
    }
  }

  // 提取品相信息
  extractCondition(text) {
    const conditions = ['Near Mint', 'Light Played', 'Moderately Played', 'Heavily Played', 'Damaged'];
    for (const condition of conditions) {
      if (text.includes(condition)) {
        return condition;
      }
    }
    return 'Unknown';
  }

  // 獲取詳細價格信息
  async getCardDetails(cardUrl) {
    if (!this.browser) {
      await this.initializeBrowser();
    }

    const page = await this.browser.newPage();
    
    try {
      await page.setUserAgent(getHeaders()['User-Agent']);
      await page.setViewport({ width: 1920, height: 1080 });

      console.log(`📊 Getting details from: ${cardUrl}`);

      await page.goto(cardUrl, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });

      await delay(2000);

      // 提取詳細價格信息
      const details = await page.evaluate(() => {
        const marketPrice = document.querySelector('.market-price, .current-price');
        const lowPrice = document.querySelector('.low-price, .min-price');
        const highPrice = document.querySelector('.high-price, .max-price');
        const image = document.querySelector('.product-image img, .card-image img');
        const title = document.querySelector('.product-title, .card-title');

        return {
          marketPrice: marketPrice ? marketPrice.textContent.trim() : '',
          lowPrice: lowPrice ? lowPrice.textContent.trim() : '',
          highPrice: highPrice ? highPrice.textContent.trim() : '',
          image: image ? image.src : '',
          title: title ? title.textContent.trim() : '',
          url: window.location.href
        };
      });

      console.log(`✅ Extracted details for: ${details.title}`);
      return details;

    } catch (error) {
      console.error(`❌ Failed to get details from ${cardUrl}:`, error);
      throw error;
    } finally {
      await page.close();
    }
  }

  // 正規化價格
  normalizePrice(priceText) {
    if (!priceText) return null;
    
    // 移除貨幣符號和空格
    let normalized = priceText.replace(/[$,€¥,\s]/g, '');
    
    // 提取數字
    const match = normalized.match(/(\d+(?:\.\d+)?)/);
    if (!match) return null;
    
    const price = parseFloat(match[1]);
    return {
      amount: price,
      currency: 'USD',
      original: priceText
    };
  }

  // 抓取卡牌價格數據
  async scrapeCardPrice(cardName) {
    try {
      console.log(`🚀 Starting PriceCharting crawl for: ${cardName}`);

      // 搜索卡牌
      const searchResults = await this.searchCard(cardName);
      
      if (searchResults.length === 0) {
        console.log(`⚠️ No results found for: ${cardName}`);
        return null;
      }

      // 獲取第一個結果的詳細信息
      const firstResult = searchResults[0];
      if (firstResult.url) {
        const details = await this.getCardDetails(firstResult.url);
        
        return {
          cardName: details.title || firstResult.title,
          marketPrice: this.normalizePrice(details.marketPrice),
          lowPrice: this.normalizePrice(details.lowPrice),
          highPrice: this.normalizePrice(details.highPrice),
          imageUrl: details.image || firstResult.image,
          source: 'pricecharting',
          url: details.url,
          scrapedAt: new Date()
        };
      }

      return {
        cardName: firstResult.title,
        marketPrice: this.normalizePrice(firstResult.price),
        imageUrl: firstResult.image,
        source: 'pricecharting',
        url: firstResult.url,
        scrapedAt: new Date()
      };

    } catch (error) {
      console.error(`❌ Failed to scrape ${cardName} from PriceCharting:`, error);
      throw error;
    }
  }

  // 批量抓取
  async scrapeMultipleCards(cards) {
    const results = [];
    
    for (const card of cards) {
      try {
        const priceData = await this.scrapeCardPrice(card.enName || card.jpName);
        
        if (priceData) {
          results.push({
            cardId: card.id,
            ...priceData
          });
        }
        
        // 請求間隔
        await delay(3000);
        
      } catch (error) {
        console.error(`❌ Failed to scrape ${card.enName} from PriceCharting:`, error);
      }
    }
    
    return results;
  }

  // 保存價格數據
  async savePriceData(priceData) {
    try {
      const priceRecords = priceData.map(data => {
        const priceUSD = data.marketPrice ? data.marketPrice.amount : 0;
        const priceJPY = Math.round(priceUSD * 150); // 簡單匯率轉換
        
        return {
          cardId: data.cardId,
          priceUSD: priceUSD,
          priceJPY: priceJPY,
          source: data.source,
          url: data.url,
          condition: 'near_mint',
          isActive: true
        };
      });

      await Price.bulkCreate(priceRecords, {
        updateOnDuplicate: ['priceUSD', 'priceJPY', 'updatedAt']
      });

      console.log(`✅ Saved ${priceRecords.length} PriceCharting price records`);
      return priceRecords.length;
    } catch (error) {
      console.error('❌ Failed to save PriceCharting price data:', error);
      throw error;
    }
  }

  // 執行爬蟲任務
  async runCrawling() {
    if (this.isRunning) {
      console.log('⚠️ PriceCharting crawling already in progress');
      return;
    }

    this.isRunning = true;

    try {
      console.log('🚀 Starting PriceCharting crawling...');
      
      // 獲取所有活躍的卡牌
      const cards = await Card.findAll({
        where: { isActive: true },
        limit: 20 // 限制數量
      });

      if (cards.length === 0) {
        console.log('⚠️ No active cards found');
        return;
      }

      // 抓取價格數據
      const priceData = await this.scrapeMultipleCards(cards);
      
      if (priceData.length > 0) {
        // 保存到數據庫
        await this.savePriceData(priceData);
      }

      console.log(`✅ PriceCharting crawling completed. Processed ${cards.length} cards, found ${priceData.length} prices`);

    } catch (error) {
      console.error('❌ PriceCharting crawling failed:', error);
    } finally {
      this.isRunning = false;
      await this.closeBrowser();
    }
  }
}

module.exports = new PriceChartingCrawlerService(); 