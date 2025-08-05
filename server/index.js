const express = require('express');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const { initializeDatabase } = require('./models');
const { seedCards } = require('./seeders/cardSeeder');
const unifiedCrawlerService = require('./services/unifiedCrawlerService');

const app = express();
const PORT = process.env.PORT || 3001;

// 中間件
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());

// 初始化數據庫
initializeDatabase().then(() => {
  console.log('✅ Database initialized');
  // 種子數據（僅在開發環境）
  if (process.env.NODE_ENV === 'development') {
    seedCards().catch(console.error);
  }
}).catch(console.error);

// 模擬數據（作為備用）
const mockCards = [
  {
    id: '1',
    jpName: 'ピカチュウ',
    enName: 'Pikachu',
    cardNumber: '025/025',
    rarity: 'Rare Holo',
    set: 'Base Set',
    setCode: 'base1',
    imageUrl: 'https://images.pokemontcg.io/base1/25.png',
    releaseDate: '1999-01-09',
    language: 'jp',
  },
  {
    id: '2',
    jpName: 'リザードン',
    enName: 'Charizard',
    cardNumber: '004/102',
    rarity: 'Rare Holo',
    set: 'Base Set',
    setCode: 'base1',
    imageUrl: 'https://images.pokemontcg.io/base1/4.png',
    releaseDate: '1999-01-09',
    language: 'jp',
  },
  {
    id: '3',
    jpName: 'ミュウツー',
    enName: 'Mewtwo',
    cardNumber: '150/150',
    rarity: 'Rare Holo',
    set: 'Base Set',
    setCode: 'base1',
    imageUrl: 'https://images.pokemontcg.io/base1/150.png',
    releaseDate: '1999-01-09',
    language: 'jp',
  },
  {
    id: '4',
    jpName: 'ルカリオ',
    enName: 'Lucario',
    cardNumber: '019/070',
    rarity: 'Rare Holo V',
    set: 'Sword & Shield',
    setCode: 'swsh1',
    imageUrl: 'https://images.pokemontcg.io/swsh1/19.png',
    releaseDate: '2020-02-07',
    language: 'jp',
  },
  {
    id: '5',
    jpName: 'ガルーラ',
    enName: 'Gengar',
    cardNumber: '094/102',
    rarity: 'Rare Holo',
    set: 'Base Set',
    setCode: 'base1',
    imageUrl: 'https://images.pokemontcg.io/base1/94.png',
    releaseDate: '1999-01-09',
    language: 'jp',
  },
  {
    id: '6',
    jpName: 'イーブイ',
    enName: 'Eevee',
    cardNumber: '063/102',
    rarity: 'Common',
    set: 'Base Set',
    setCode: 'base1',
    imageUrl: 'https://images.pokemontcg.io/base1/63.png',
    releaseDate: '1999-01-09',
    language: 'jp',
  },
  {
    id: '7',
    jpName: 'フシギダネ',
    enName: 'Bulbasaur',
    cardNumber: '044/102',
    rarity: 'Common',
    set: 'Base Set',
    setCode: 'base1',
    imageUrl: 'https://images.pokemontcg.io/base1/44.png',
    releaseDate: '1999-01-09',
    language: 'jp',
  },
  {
    id: '8',
    jpName: 'ヒトカゲ',
    enName: 'Charmander',
    cardNumber: '004/102',
    rarity: 'Common',
    set: 'Base Set',
    setCode: 'base1',
    imageUrl: 'https://images.pokemontcg.io/base1/4.png',
    releaseDate: '1999-01-09',
    language: 'jp',
  },
];

// API 路由
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const cardService = require('./services/cardService');
const searchService = require('./services/searchService');
const crawlerService = require('./services/mockCrawlerService');
const userService = require('./services/userService');
const { authenticateToken, optionalAuth } = require('./middleware/auth');
const { cache } = require('./config/redis');
const { ImageService, upload } = require('./services/imageService');
const realPokemonCrawlerService = require('./services/realPokemonCrawlerService');

// 搜索卡牌（帶緩存）
app.get('/api/search', optionalAuth, async (req, res) => {
  try {
    const cacheKey = `search:${JSON.stringify(req.query)}`;
    
    // 嘗試從緩存獲取
    let result = await cache.get(cacheKey);
    
    if (!result) {
      // 緩存不存在，執行搜索
      result = await searchService.searchCards(req.query);
      
      // 設置緩存（5分鐘）
      await cache.set(cacheKey, result, 300);
    }
    
    res.json(result);
  } catch (error) {
    console.error('Search API error:', error);
    res.status(500).json({
      success: false,
      error: '搜索失敗'
    });
  }
});

// 搜索建議
app.get('/api/search/suggestions', async (req, res) => {
  try {
    const { query, limit = 5 } = req.query;
    const suggestions = await searchService.getSearchSuggestions(query, limit);
    res.json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    console.error('Search suggestions API error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// 熱門搜索詞
app.get('/api/search/popular', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const popularSearches = await searchService.getPopularSearches(limit);
    res.json({
      success: true,
      data: popularSearches
    });
  } catch (error) {
    console.error('Popular searches API error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// 獲取卡牌詳情
app.get('/api/cards/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const card = await cardService.getCardById(id);
    
    if (!card) {
      return res.status(404).json({
        success: false,
        error: 'Card not found',
      });
    }
    
    res.json({
      success: true,
      data: card,
    });
  } catch (error) {
    console.error('Get card API error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// 獲取熱門卡牌
app.get('/api/cards/popular', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const popularCards = await cardService.getPopularCards(limit);
    
    res.json({
      success: true,
      data: popularCards,
    });
  } catch (error) {
    console.error('Get popular cards API error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// 獲取卡牌價格數據
app.get('/api/cards/:id/prices', (req, res) => {
  const { id } = req.params;
  const { days = 30 } = req.query;
  
  // 模擬價格數據
  const mockPrices = [];
  const now = new Date();
  
  for (let i = 0; i < parseInt(days); i++) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    mockPrices.push({
      id: `price_${id}_${i}`,
      cardId: id,
      source: ['mercari', 'yahoo', 'rakuten'][Math.floor(Math.random() * 3)],
      priceJPY: Math.floor(Math.random() * 50000) + 1000,
      priceUSD: Math.floor(Math.random() * 500) + 10,
      condition: ['NM', 'LP', 'MP'][Math.floor(Math.random() * 3)],
      timestamp: date.toISOString(),
    });
  }
  
  res.json({
    success: true,
    data: mockPrices,
  });
});

// 獲取價格趨勢
app.get('/api/cards/:id/trends', (req, res) => {
  const { id } = req.params;
  const { days = 30 } = req.query;
  
  // 模擬趨勢數據
  const mockTrends = [];
  const now = new Date();
  
  for (let i = 0; i < parseInt(days); i++) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const basePriceJPY = 15000 + Math.random() * 20000;
    const basePriceUSD = 100 + Math.random() * 200;
    
    mockTrends.push({
      date: date.toISOString().split('T')[0],
      averagePriceJPY: Math.floor(basePriceJPY),
      averagePriceUSD: Math.floor(basePriceUSD * 100) / 100,
      minPriceJPY: Math.floor(basePriceJPY * 0.8),
      maxPriceJPY: Math.floor(basePriceJPY * 1.2),
      transactionCount: Math.floor(Math.random() * 10) + 1,
    });
  }
  
  res.json({
    success: true,
    data: mockTrends.reverse(),
  });
});

// 獲取卡包列表
app.get('/api/sets', (req, res) => {
  const sets = [
    { code: 'base1', name: 'Base Set' },
    { code: 'base2', name: 'Base Set 2' },
    { code: 'base3', name: 'Base Set 3' },
    { code: 'gym1', name: 'Gym Heroes' },
    { code: 'gym2', name: 'Gym Challenge' },
    { code: 'neo1', name: 'Neo Genesis' },
    { code: 'neo2', name: 'Neo Discovery' },
    { code: 'neo3', name: 'Neo Revelation' },
    { code: 'neo4', name: 'Neo Destiny' },
    { code: 'swsh1', name: 'Sword & Shield' },
    { code: 'swsh2', name: 'Rebel Clash' },
    { code: 'swsh3', name: 'Darkness Ablaze' },
    { code: 'swsh4', name: 'Champions Path' },
    { code: 'swsh5', name: 'Vivid Voltage' },
    { code: 'swsh6', name: 'Battle Styles' },
    { code: 'swsh7', name: 'Chilling Reign' },
    { code: 'swsh8', name: 'Evolving Skies' },
    { code: 'swsh9', name: 'Fusion Strike' },
    { code: 'swsh10', name: 'Brilliant Stars' },
    { code: 'swsh11', name: 'Astral Radiance' },
    { code: 'swsh12', name: 'Lost Origin' },
    { code: 'swsh12pt5', name: 'Silver Tempest' },
    { code: 'swsh12pt6', name: 'Crown Zenith' },
    { code: 'sv1', name: 'Scarlet & Violet' },
    { code: 'sv2', name: 'Paldea Evolved' },
    { code: 'sv3', name: 'Obsidian Flames' },
    { code: 'sv4', name: '151' },
    { code: 'sv5', name: 'Paradox Rift' },
  ];
  
  res.json({
    success: true,
    data: sets,
  });
});

// 爬蟲相關 API
app.post('/api/crawler/start', async (req, res) => {
  try {
    await crawlerService.runPriceCrawling();
    res.json({
      success: true,
      message: 'Price crawling started successfully'
    });
  } catch (error) {
    console.error('Crawler start API error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to start crawling'
    });
  }
});

app.get('/api/crawler/stats', async (req, res) => {
  try {
    const stats = crawlerService.getStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Crawler stats API error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get crawler stats'
    });
  }
});

app.post('/api/crawler/schedule', async (req, res) => {
  try {
    crawlerService.startScheduledCrawling();
    res.json({
      success: true,
      message: 'Scheduled crawling started'
    });
  } catch (error) {
    console.error('Crawler schedule API error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to start scheduled crawling'
    });
  }
});

// 用戶認證相關 API
app.post('/api/auth/register', async (req, res) => {
  try {
    const result = await userService.register(req.body);
    res.json(result);
  } catch (error) {
    console.error('User registration API error:', error);
    res.status(400).json({
      success: false,
      error: error.message || '註冊失敗'
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const result = await userService.login(req.body);
    res.json(result);
  } catch (error) {
    console.error('User login API error:', error);
    res.status(401).json({
      success: false,
      error: error.message || '登錄失敗'
    });
  }
});

app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const result = await userService.getUserProfile(req.user.id);
    res.json(result);
  } catch (error) {
    console.error('Get user profile API error:', error);
    res.status(500).json({
      success: false,
      error: '獲取用戶資料失敗'
    });
  }
});

app.put('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const result = await userService.updateUserProfile(req.user.id, req.body);
    res.json(result);
  } catch (error) {
    console.error('Update user profile API error:', error);
    res.status(400).json({
      success: false,
      error: error.message || '更新用戶資料失敗'
    });
  }
});

// 用戶收藏相關 API
app.post('/api/favorites', authenticateToken, async (req, res) => {
  try {
    const { cardId, notes } = req.body;
    const result = await userService.addFavorite(req.user.id, cardId, notes);
    res.json(result);
  } catch (error) {
    console.error('Add favorite API error:', error);
    res.status(400).json({
      success: false,
      error: error.message || '添加收藏失敗'
    });
  }
});

app.delete('/api/favorites/:cardId', authenticateToken, async (req, res) => {
  try {
    const result = await userService.removeFavorite(req.user.id, req.params.cardId);
    res.json(result);
  } catch (error) {
    console.error('Remove favorite API error:', error);
    res.status(400).json({
      success: false,
      error: error.message || '移除收藏失敗'
    });
  }
});

app.get('/api/favorites', authenticateToken, async (req, res) => {
  try {
    const { page = 1, pageSize = 20 } = req.query;
    const result = await userService.getUserFavorites(req.user.id, page, pageSize);
    res.json(result);
  } catch (error) {
    console.error('Get favorites API error:', error);
    res.status(500).json({
      success: false,
      error: '獲取收藏列表失敗'
    });
  }
});

// 價格警報相關 API
app.post('/api/alerts', authenticateToken, async (req, res) => {
  try {
    const { cardId, targetPriceJPY, targetPriceUSD, alertType } = req.body;
    const result = await userService.setPriceAlert(req.user.id, cardId, {
      targetPriceJPY,
      targetPriceUSD,
      alertType
    });
    res.json(result);
  } catch (error) {
    console.error('Set price alert API error:', error);
    res.status(400).json({
      success: false,
      error: error.message || '設置價格警報失敗'
    });
  }
});

app.delete('/api/alerts/:cardId', authenticateToken, async (req, res) => {
  try {
    const result = await userService.removePriceAlert(req.user.id, req.params.cardId);
    res.json(result);
  } catch (error) {
    console.error('Remove price alert API error:', error);
    res.status(400).json({
      success: false,
      error: error.message || '移除價格警報失敗'
    });
  }
});

app.get('/api/alerts', authenticateToken, async (req, res) => {
  try {
    const result = await userService.getUserPriceAlerts(req.user.id);
    res.json(result);
  } catch (error) {
    console.error('Get price alerts API error:', error);
    res.status(500).json({
      success: false,
      error: '獲取價格警報列表失敗'
    });
  }
});

// 圖片處理相關 API
app.post('/api/images/upload', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: '請選擇要上傳的圖片'
      });
    }

    const imageService = new ImageService();
    const result = await imageService.processSingleImage(req.file, {
      uploadToCDN: req.body.uploadToCDN === 'true'
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Image upload API error:', error);
    res.status(500).json({
      success: false,
      error: '圖片上傳失敗'
    });
  }
});

app.post('/api/images/card/:cardId', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: '請選擇要上傳的圖片'
      });
    }

    const imageService = new ImageService();
    const result = await imageService.updateCardImage(req.params.cardId, req.file, {
      uploadToCDN: req.body.uploadToCDN === 'true'
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Update card image API error:', error);
    res.status(500).json({
      success: false,
      error: '更新卡牌圖片失敗'
    });
  }
});

app.get('/api/images/stats', async (req, res) => {
  try {
    const imageService = new ImageService();
    const stats = await imageService.getImageStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get image stats API error:', error);
    res.status(500).json({
      success: false,
      error: '獲取圖片統計失敗'
    });
  }
});

app.post('/api/images/cleanup', authenticateToken, async (req, res) => {
  try {
    const imageService = new ImageService();
    await imageService.cleanupOldImages();
    
    res.json({
      success: true,
      message: '舊圖片清理完成'
    });
  } catch (error) {
    console.error('Image cleanup API error:', error);
    res.status(500).json({
      success: false,
      error: '圖片清理失敗'
    });
  }
});

// Pokemon 爬蟲 API
app.post('/api/pokemon-crawler/start', authenticateToken, async (req, res) => {
  try {
    if (realPokemonCrawlerService.isRunning) {
      return res.status(400).json({
        success: false,
        error: '爬蟲已在運行中'
      });
    }

    // 在背景中運行爬蟲
    realPokemonCrawlerService.runCrawling().catch(error => {
      console.error('Pokemon 爬蟲運行失敗:', error);
    });

    res.json({
      success: true,
      message: 'Pokemon 真實數據爬取已啟動'
    });
  } catch (error) {
    console.error('Pokemon crawler start API error:', error);
    res.status(500).json({
      success: false,
      error: '啟動爬蟲失敗'
    });
  }
});

app.get('/api/pokemon-crawler/stats', async (req, res) => {
  try {
    const stats = realPokemonCrawlerService.getStats();
    const dbStats = await realPokemonCrawlerService.getDatabaseStats();
    
    res.json({
      success: true,
      data: { ...stats, ...dbStats }
    });
  } catch (error) {
    console.error('Pokemon crawler stats API error:', error);
    res.status(500).json({
      success: false,
      error: '獲取爬蟲統計失敗'
    });
  }
});

app.post('/api/pokemon-crawler/stop', authenticateToken, async (req, res) => {
  try {
    realPokemonCrawlerService.isRunning = false;
    
    res.json({
      success: true,
      message: '爬蟲已停止'
    });
  } catch (error) {
    console.error('Pokemon crawler stop API error:', error);
    res.status(500).json({
      success: false,
      error: '停止爬蟲失敗'
    });
  }
});

app.post('/api/pokemon-crawler/cleanup', authenticateToken, async (req, res) => {
  try {
    const deletedCount = await realPokemonCrawlerService.cleanupOldData();
    
    res.json({
      success: true,
      message: `清理了 ${deletedCount} 條舊數據`
    });
  } catch (error) {
    console.error('Pokemon crawler cleanup API error:', error);
    res.status(500).json({
      success: false,
      error: '清理數據失敗'
    });
  }
});

// 統一爬蟲 API
app.post('/api/unified-crawler/start', authenticateToken, async (req, res) => {
  try {
    if (unifiedCrawlerService.isRunning) {
      return res.status(400).json({
        success: false,
        error: '統一爬蟲已在運行中'
      });
    }

    // 在背景中運行爬蟲
    unifiedCrawlerService.runAllCrawlers().catch(error => {
      console.error('統一爬蟲運行失敗:', error);
    });

    res.json({
      success: true,
      message: '統一爬蟲已啟動（PriceCharting + SNKRDUNK + Mercari）'
    });
  } catch (error) {
    console.error('Unified crawler start API error:', error);
    res.status(500).json({
      success: false,
      error: '啟動統一爬蟲失敗'
    });
  }
});

app.post('/api/unified-crawler/single/:source', authenticateToken, async (req, res) => {
  try {
    const { source } = req.params;
    const validSources = ['pricecharting', 'snkrdunk', 'mercari'];
    
    if (!validSources.includes(source)) {
      return res.status(400).json({
        success: false,
        error: '無效的數據源'
      });
    }

    const result = await unifiedCrawlerService.runSingleCrawler(source);
    
    res.json({
      success: true,
      message: `${source} 爬蟲執行完成`,
      data: { results: result }
    });
  } catch (error) {
    console.error('Single crawler API error:', error);
    res.status(500).json({
      success: false,
      error: '執行單個爬蟲失敗'
    });
  }
});

app.get('/api/unified-crawler/stats', async (req, res) => {
  try {
    const stats = unifiedCrawlerService.getStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Unified crawler stats API error:', error);
    res.status(500).json({
      success: false,
      error: '獲取統一爬蟲統計失敗'
    });
  }
});

app.post('/api/unified-crawler/test', authenticateToken, async (req, res) => {
  try {
    const results = await unifiedCrawlerService.testConnections();
    
    res.json({
      success: true,
      message: '連接測試完成',
      data: results
    });
  } catch (error) {
    console.error('Connection test API error:', error);
    res.status(500).json({
      success: false,
      error: '連接測試失敗'
    });
  }
});

app.post('/api/unified-crawler/cleanup', authenticateToken, async (req, res) => {
  try {
    const deletedCount = await unifiedCrawlerService.cleanupOldData();
    
    res.json({
      success: true,
      message: `清理了 ${deletedCount} 條舊數據`
    });
  } catch (error) {
    console.error('Unified crawler cleanup API error:', error);
    res.status(500).json({
      success: false,
      error: '清理數據失敗'
    });
  }
});

app.post('/api/unified-crawler/schedule/start', authenticateToken, async (req, res) => {
  try {
    unifiedCrawlerService.startScheduledCrawling();
    
    res.json({
      success: true,
      message: '定時爬蟲已啟動'
    });
  } catch (error) {
    console.error('Schedule start API error:', error);
    res.status(500).json({
      success: false,
      error: '啟動定時爬蟲失敗'
    });
  }
});

// 錯誤處理中間件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
});

// 404 處理
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint not found',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
}); 