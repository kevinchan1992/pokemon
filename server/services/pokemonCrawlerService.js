const puppeteer = require('puppeteer');
const axios = require('axios');
const cheerio = require('cheerio');
const { Card, Price } = require('../models');
const { delay, randomDelay } = require('../utils/crawlerUtils');

class PokemonCrawlerService {
  constructor() {
    this.browser = null;
    this.isRunning = false;
    this.stats = {
      totalCards: 0,
      totalPrices: 0,
      errors: 0,
      startTime: null,
      endTime: null
    };
  }

  async initialize() {
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
      console.log('✅ Pokemon 爬蟲瀏覽器初始化成功');
      return true;
    } catch (error) {
      console.error('❌ Pokemon 爬蟲瀏覽器初始化失敗:', error);
      return false;
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      console.log('✅ Pokemon 爬蟲瀏覽器已關閉');
    }
  }

  // 從 PriceCharting 爬取 Pokemon 卡牌數據
  async crawlPriceCharting() {
    const page = await this.browser.newPage();
    
    try {
      // 設置用戶代理
      await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      
      // 訪問 Pokemon 卡牌頁面
      await page.goto('https://www.pricecharting.com/category/pokemon-cards', {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      await randomDelay(2000, 4000);

      // 獲取卡牌列表
      const cards = await page.evaluate(() => {
        const cardElements = document.querySelectorAll('.product-item');
        const cards = [];

        cardElements.forEach((element, index) => {
          if (index < 50) { // 限制數量避免過度爬取
            const titleElement = element.querySelector('.product-title');
            const priceElement = element.querySelector('.price');
            const imageElement = element.querySelector('img');
            const linkElement = element.querySelector('a');

            if (titleElement && priceElement) {
              cards.push({
                title: titleElement.textContent.trim(),
                price: priceElement.textContent.trim(),
                imageUrl: imageElement ? imageElement.src : null,
                link: linkElement ? linkElement.href : null
              });
            }
          }
        });

        return cards;
      });

      console.log(`✅ 從 PriceCharting 獲取到 ${cards.length} 張卡牌`);
      return cards;

    } catch (error) {
      console.error('❌ PriceCharting 爬取失敗:', error);
      return [];
    } finally {
      await page.close();
    }
  }

  // 從 SNKRDUNK 爬取 Pokemon 卡牌數據
  async crawlSNKRDUNK() {
    const page = await this.browser.newPage();
    
    try {
      // 設置用戶代理
      await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      
      // 訪問 SNKRDUNK 交易卡頁面
      await page.goto('https://snkrdunk.com/category/trading-cards', {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      await randomDelay(2000, 4000);

      // 獲取卡牌列表
      const cards = await page.evaluate(() => {
        const cardElements = document.querySelectorAll('.product-card, .item-card');
        const cards = [];

        cardElements.forEach((element, index) => {
          if (index < 50) { // 限制數量
            const titleElement = element.querySelector('.product-name, .item-name');
            const priceElement = element.querySelector('.price, .item-price');
            const imageElement = element.querySelector('img');
            const linkElement = element.querySelector('a');

            if (titleElement && priceElement) {
              cards.push({
                title: titleElement.textContent.trim(),
                price: priceElement.textContent.trim(),
                imageUrl: imageElement ? imageElement.src : null,
                link: linkElement ? linkElement.href : null
              });
            }
          }
        });

        return cards;
      });

      console.log(`✅ 從 SNKRDUNK 獲取到 ${cards.length} 張卡牌`);
      return cards;

    } catch (error) {
      console.error('❌ SNKRDUNK 爬取失敗:', error);
      return [];
    } finally {
      await page.close();
    }
  }

  // 從 Pokemon API 獲取官方數據
  async fetchPokemonAPIData() {
    try {
      const response = await axios.get('https://api.pokemontcg.io/v2/cards', {
        headers: {
          'X-Api-Key': process.env.POKEMON_API_KEY || 'your-api-key'
        },
        params: {
          pageSize: 100,
          select: 'id,name,number,rarity,set,images,prices'
        }
      });

      const cards = response.data.data.map(card => ({
        id: card.id,
        jpName: card.name,
        enName: card.name,
        cardNumber: card.number,
        rarity: card.rarity,
        set: card.set.name,
        setCode: card.set.id,
        imageUrl: card.images?.small || null,
        prices: card.prices || {},
        releaseDate: new Date()
      }));

      console.log(`✅ 從 Pokemon API 獲取到 ${cards.length} 張卡牌`);
      return cards;

    } catch (error) {
      console.error('❌ Pokemon API 獲取失敗:', error);
      return [];
    }
  }

  // 處理和標準化卡牌數據
  async processCardData(rawCards, source) {
    const processedCards = [];

    for (const rawCard of rawCards) {
      try {
        // 解析卡牌名稱
        const nameMatch = rawCard.title.match(/^(.+?)\s*[-–—]\s*(.+)$/);
        const jpName = nameMatch ? nameMatch[1].trim() : rawCard.title;
        const enName = nameMatch ? nameMatch[2].trim() : rawCard.title;

        // 解析價格
        const priceMatch = rawCard.price.match(/[\d,]+/);
        const priceJPY = priceMatch ? parseInt(priceMatch[0].replace(/,/g, '')) : 0;
        const priceUSD = Math.round(priceJPY / 150); // 粗略轉換

        // 生成卡牌編號
        const cardNumber = this.generateCardNumber(jpName);

        const processedCard = {
          jpName,
          enName,
          cardNumber,
          rarity: this.detectRarity(rawCard.title),
          set: this.detectSet(rawCard.title),
          setCode: this.generateSetCode(rawCard.title),
          imageUrl: rawCard.imageUrl,
          releaseDate: new Date(),
          language: 'jp',
          description: `${source} 來源的 ${jpName}`,
          hp: this.extractHP(rawCard.title),
          type: this.detectType(rawCard.title),
          isActive: true
        };

        processedCards.push({
          card: processedCard,
          prices: [{
            priceJPY,
            priceUSD,
            source,
            condition: 'near_mint',
            url: rawCard.link,
            isActive: true
          }]
        });

      } catch (error) {
        console.error('處理卡牌數據失敗:', error);
        this.stats.errors++;
      }
    }

    return processedCards;
  }

  // 輔助方法
  generateCardNumber(name) {
    const hash = name.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return Math.abs(hash).toString().substring(0, 6);
  }

  detectRarity(title) {
    const rarityKeywords = {
      'common': ['コモン', 'Common'],
      'uncommon': ['アンコモン', 'Uncommon'],
      'rare': ['レア', 'Rare'],
      'holo': ['ホロ', 'Holo'],
      'secret': ['シークレット', 'Secret'],
      'ultra': ['ウルトラ', 'Ultra']
    };

    for (const [rarity, keywords] of Object.entries(rarityKeywords)) {
      if (keywords.some(keyword => title.includes(keyword))) {
        return rarity;
      }
    }
    return 'common';
  }

  detectSet(title) {
    const setKeywords = {
      'Base Set': ['ベースセット', 'Base Set'],
      'Jungle': ['ジャングル', 'Jungle'],
      'Fossil': ['化石', 'Fossil'],
      'Team Rocket': ['ロケット団', 'Team Rocket'],
      'Gym Heroes': ['ジムヒーローズ', 'Gym Heroes'],
      'Neo Genesis': ['ネオジェネシス', 'Neo Genesis']
    };

    for (const [set, keywords] of Object.entries(setKeywords)) {
      if (keywords.some(keyword => title.includes(keyword))) {
        return set;
      }
    }
    return 'Unknown Set';
  }

  generateSetCode(setName) {
    const setCodes = {
      'Base Set': 'BS',
      'Jungle': 'JU',
      'Fossil': 'FO',
      'Team Rocket': 'TR',
      'Gym Heroes': 'GH',
      'Neo Genesis': 'NG'
    };
    return setCodes[setName] || 'UNK';
  }

  extractHP(title) {
    const hpMatch = title.match(/(\d+)\s*HP/);
    return hpMatch ? parseInt(hpMatch[1]) : null;
  }

  detectType(title) {
    const types = ['Fire', 'Water', 'Grass', 'Electric', 'Psychic', 'Fighting', 'Darkness', 'Metal', 'Fairy'];
    for (const type of types) {
      if (title.includes(type)) {
        return type;
      }
    }
    return 'Colorless';
  }

  // 保存卡牌數據到數據庫
  async saveCardsToDatabase(processedCards) {
    let savedCount = 0;

    for (const { card, prices } of processedCards) {
      try {
        // 檢查卡牌是否已存在
        const existingCard = await Card.findOne({
          where: {
            jpName: card.jpName,
            cardNumber: card.cardNumber
          }
        });

        if (!existingCard) {
          // 創建新卡牌
          const newCard = await Card.create(card);
          
          // 保存價格數據
          for (const priceData of prices) {
            await Price.create({
              ...priceData,
              cardId: newCard.id
            });
          }

          savedCount++;
          console.log(`✅ 保存卡牌: ${card.jpName}`);
        } else {
          // 更新現有卡牌的價格
          for (const priceData of prices) {
            await Price.create({
              ...priceData,
              cardId: existingCard.id
            });
          }
          console.log(`✅ 更新卡牌價格: ${card.jpName}`);
        }

      } catch (error) {
        console.error('保存卡牌失敗:', error);
        this.stats.errors++;
      }
    }

    return savedCount;
  }

  // 主要爬取方法
  async runCrawling() {
    if (this.isRunning) {
      console.log('⚠️ 爬蟲已在運行中');
      return;
    }

    this.isRunning = true;
    this.stats.startTime = new Date();
    this.stats.totalCards = 0;
    this.stats.totalPrices = 0;
    this.stats.errors = 0;

    console.log('🚀 開始 Pokemon TCG 數據爬取...');

    try {
      // 初始化瀏覽器
      const initialized = await this.initialize();
      if (!initialized) {
        throw new Error('瀏覽器初始化失敗');
      }

      // 從多個來源爬取數據
      const sources = [
        { name: 'PriceCharting', method: this.crawlPriceCharting.bind(this) },
        { name: 'SNKRDUNK', method: this.crawlSNKRDUNK.bind(this) },
        { name: 'PokemonAPI', method: this.fetchPokemonAPIData.bind(this) }
      ];

      for (const source of sources) {
        try {
          console.log(`📊 正在從 ${source.name} 爬取數據...`);
          
          const rawCards = await source.method();
          const processedCards = await this.processCardData(rawCards, source.name);
          
          if (processedCards.length > 0) {
            const savedCount = await this.saveCardsToDatabase(processedCards);
            this.stats.totalCards += savedCount;
            this.stats.totalPrices += processedCards.reduce((sum, card) => sum + card.prices.length, 0);
            
            console.log(`✅ ${source.name} 爬取完成: ${savedCount} 張卡牌`);
          }

          await randomDelay(3000, 6000); // 避免過度請求

        } catch (error) {
          console.error(`❌ ${source.name} 爬取失敗:`, error);
          this.stats.errors++;
        }
      }

    } catch (error) {
      console.error('❌ Pokemon 爬蟲運行失敗:', error);
    } finally {
      this.stats.endTime = new Date();
      this.isRunning = false;
      await this.close();
      
      console.log('📊 爬蟲統計:');
      console.log(`- 總卡牌數: ${this.stats.totalCards}`);
      console.log(`- 總價格數: ${this.stats.totalPrices}`);
      console.log(`- 錯誤數: ${this.stats.errors}`);
      console.log(`- 運行時間: ${(this.stats.endTime - this.stats.startTime) / 1000} 秒`);
    }
  }

  // 獲取爬蟲統計
  getStats() {
    return {
      ...this.stats,
      isRunning: this.isRunning,
      duration: this.stats.startTime && this.stats.endTime 
        ? (this.stats.endTime - this.stats.startTime) / 1000 
        : 0
    };
  }
}

module.exports = new PokemonCrawlerService(); 