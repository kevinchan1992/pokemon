const { Card, Price } = require('../models');
const { delay, randomDelay } = require('../utils/crawlerUtils');

class SafePokemonCrawlerService {
  constructor() {
    this.isRunning = false;
    this.stats = {
      totalCards: 0,
      totalPrices: 0,
      errors: 0,
      startTime: null,
      endTime: null
    };
  }

  // 生成模擬的 Pokemon 卡牌數據
  generateMockPokemonCards() {
    const pokemonNames = [
      'ピカチュウ', 'イーブイ', 'フシギダネ', 'ヒトカゲ', 'ゼニガメ',
      'リザードン', 'フシギバナ', 'カメックス', 'ライチュウ', 'サンダース',
      'ブースター', 'エーフィ', 'ブラッキー', 'ニドラン', 'ニドリーナ',
      'ニドクイン', 'ニドリーノ', 'ニドキング', 'コラッタ', 'ラッタ',
      'オニスズメ', 'オニドリル', 'アーボ', 'アーボック', 'ピカチュウ',
      'ライチュウ', 'サンダース', 'ブースター', 'エーフィ', 'ブラッキー'
    ];

    const sets = [
      'Base Set', 'Jungle', 'Fossil', 'Team Rocket', 'Gym Heroes',
      'Neo Genesis', 'Neo Discovery', 'Neo Revelation', 'Neo Destiny',
      'Legendary Collection', 'Expedition', 'Aquapolis', 'Skyridge'
    ];

    const rarities = ['common', 'uncommon', 'rare', 'holo', 'secret', 'ultra'];
    const types = ['Colorless', 'Fire', 'Water', 'Grass', 'Electric', 'Psychic', 'Fighting', 'Darkness', 'Metal'];

    const mockCards = [];

    for (let i = 0; i < 50; i++) {
      const pokemonName = pokemonNames[Math.floor(Math.random() * pokemonNames.length)];
      const set = sets[Math.floor(Math.random() * sets.length)];
      const rarity = rarities[Math.floor(Math.random() * rarities.length)];
      const type = types[Math.floor(Math.random() * types.length)];
      const cardNumber = Math.floor(Math.random() * 150) + 1;
      const hp = Math.floor(Math.random() * 120) + 30;

      // 生成價格（基於稀有度）
      const basePrice = {
        'common': 100,
        'uncommon': 300,
        'rare': 800,
        'holo': 1500,
        'secret': 3000,
        'ultra': 5000
      }[rarity] || 500;

      const priceVariation = 0.3; // 30% 變動
      const priceJPY = Math.floor(basePrice * (1 + (Math.random() - 0.5) * priceVariation));
      const priceUSD = Math.round(priceJPY / 150);

      mockCards.push({
        card: {
          jpName: `${pokemonName} #${cardNumber}`,
          enName: `${pokemonName} #${cardNumber}`,
          cardNumber: `${cardNumber.toString().padStart(3, '0')}`,
          rarity,
          set,
          setCode: this.generateSetCode(set),
          imageUrl: `https://via.placeholder.com/300x400/cccccc/666666?text=${encodeURIComponent(pokemonName)}`,
          releaseDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
          language: 'jp',
          description: `${set} 系列的 ${rarity} 稀有度 ${pokemonName}`,
          hp,
          type,
          isActive: true
        },
        prices: [
          {
            priceJPY,
            priceUSD,
            source: 'PriceCharting',
            condition: 'near_mint',
            url: `https://www.pricecharting.com/pokemon/${encodeURIComponent(pokemonName)}`,
            isActive: true
          },
          {
            priceJPY: Math.floor(priceJPY * 0.9),
            priceUSD: Math.round(priceJPY * 0.9 / 150),
            source: 'SNKRDUNK',
            condition: 'near_mint',
            url: `https://snkrdunk.com/pokemon/${encodeURIComponent(pokemonName)}`,
            isActive: true
          }
        ]
      });
    }

    return mockCards;
  }

  generateSetCode(setName) {
    const setCodes = {
      'Base Set': 'BS',
      'Jungle': 'JU',
      'Fossil': 'FO',
      'Team Rocket': 'TR',
      'Gym Heroes': 'GH',
      'Neo Genesis': 'NG',
      'Neo Discovery': 'ND',
      'Neo Revelation': 'NR',
      'Neo Destiny': 'ND',
      'Legendary Collection': 'LC',
      'Expedition': 'EX',
      'Aquapolis': 'AQ',
      'Skyridge': 'SK'
    };
    return setCodes[setName] || 'UNK';
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

  // 主要爬取方法（使用模擬數據）
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

    console.log('🚀 開始 Pokemon TCG 模擬數據生成...');

    try {
      // 模擬網絡延遲
      await randomDelay(2000, 4000);

      // 生成模擬數據
      console.log('📊 正在生成模擬 Pokemon 卡牌數據...');
      const mockCards = this.generateMockPokemonCards();
      
      if (mockCards.length > 0) {
        const savedCount = await this.saveCardsToDatabase(mockCards);
        this.stats.totalCards = savedCount;
        this.stats.totalPrices = mockCards.reduce((sum, card) => sum + card.prices.length, 0);
        
        console.log(`✅ 模擬數據生成完成: ${savedCount} 張卡牌`);
      }

      // 模擬處理時間
      await randomDelay(1000, 2000);

    } catch (error) {
      console.error('❌ 模擬數據生成失敗:', error);
      this.stats.errors++;
    } finally {
      this.stats.endTime = new Date();
      this.isRunning = false;
      
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

  // 清理舊數據
  async cleanupOldData() {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const deletedPrices = await Price.destroy({
        where: {
          createdAt: {
            [require('sequelize').Op.lt]: thirtyDaysAgo
          }
        }
      });

      console.log(`✅ 清理了 ${deletedPrices} 條舊價格數據`);
      return deletedPrices;
    } catch (error) {
      console.error('清理舊數據失敗:', error);
      return 0;
    }
  }

  // 獲取數據庫統計
  async getDatabaseStats() {
    try {
      const cardCount = await Card.count();
      const priceCount = await Price.count();
      const activeCardCount = await Card.count({ where: { isActive: true } });
      const activePriceCount = await Price.count({ where: { isActive: true } });

      return {
        totalCards: cardCount,
        totalPrices: priceCount,
        activeCards: activeCardCount,
        activePrices: activePriceCount
      };
    } catch (error) {
      console.error('獲取數據庫統計失敗:', error);
      return {
        totalCards: 0,
        totalPrices: 0,
        activeCards: 0,
        activePrices: 0
      };
    }
  }
}

module.exports = new SafePokemonCrawlerService(); 