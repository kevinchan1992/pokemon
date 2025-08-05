// 爬蟲配置
const CRAWLER_CONFIG = {
  // 道德爬取設置
  ethical: {
    userAgent: 'PokemonTCGPriceBot/1.0',
    crawlDelay: 2000, // 2秒延遲
    maxRequestsPerMinute: 30,
    respectRobotsTxt: true
  },

  // 代理設置
  proxy: {
    enabled: false, // 開發環境關閉
    pool: [
      // 生產環境添加代理池
    ],
    rotation: {
      strategy: 'round-robin',
      maxFailures: 3
    }
  },

  // 目標網站配置
  targets: {
    // 美國卡牌價格網站
    usa: {
      pricecharting: {
        baseUrl: 'https://www.pricecharting.com',
        searchPath: '/search',
        selectors: {
          cardTitle: '.card-title, .product-title',
          price: '.price, .current-price',
          condition: '.condition, .card-condition',
          image: '.card-image img, .product-image img',
          marketPrice: '.market-price',
          lowPrice: '.low-price',
          highPrice: '.high-price'
        },
        delay: 3000,
        requiresJavaScript: true
      }
    },
    
    // 日本卡牌交易平台
    japan: {
      snkrdunk: {
        baseUrl: 'https://snkrdunk.com',
        searchPath: '/search',
        selectors: {
          cardTitle: '.product-name, .item-title',
          price: '.price, .current-price',
          condition: '.condition, .item-condition',
          image: '.product-image img, .item-image img',
          marketPrice: '.market-price',
          lowPrice: '.low-price',
          highPrice: '.high-price'
        },
        delay: 4000,
        requiresJavaScript: true
      },
      mercari: {
        baseUrl: 'https://jp.mercari.com',
        searchPath: '/search',
        selectors: {
          cardTitle: '.item-name',
          price: '.price',
          condition: '.condition',
          image: '.item-image img'
        },
        delay: 3000
      },
      yahooAuctions: {
        baseUrl: 'https://auctions.yahoo.co.jp',
        searchPath: '/search',
        selectors: {
          cardTitle: '.Product__title',
          price: '.Product__price',
          condition: '.Product__condition',
          image: '.Product__image img'
        },
        delay: 4000
      }
    },
    
    // 國際卡牌交易平台
    international: {
      tcgplayer: {
        baseUrl: 'https://www.tcgplayer.com',
        searchPath: '/search',
        selectors: {
          cardTitle: '.product-name',
          price: '.price',
          condition: '.condition',
          image: '.product-image img'
        },
        delay: 2000
      },
      cardmarket: {
        baseUrl: 'https://www.cardmarket.com',
        searchPath: '/search',
        selectors: {
          cardTitle: '.product-title',
          price: '.price',
          condition: '.condition',
          image: '.product-image img'
        },
        delay: 2500
      }
    }
  },

  // 數據處理設置
  dataProcessing: {
    priceNormalization: {
      currencyMapping: {
        '¥': 'JPY',
        '$': 'USD',
        '€': 'EUR'
      },
      decimalPlaces: 2
    },
    conditionMapping: {
      'NM': 5,
      'Near Mint': 5,
      'LP': 4,
      'Light Played': 4,
      'MP': 3,
      'Moderately Played': 3,
      'HP': 2,
      'Heavily Played': 2,
      'DMG': 1,
      'Damaged': 1
    }
  },

  // 監控設置
  monitoring: {
    successRateThreshold: 85,
    maxRetries: 3,
    alertThresholds: {
      failureRate: 30,
      responseTime: 10000
    }
  }
};

// 用戶代理池
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
];

// 請求頭配置
const getHeaders = (userAgent = null) => ({
  'User-Agent': userAgent || USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)],
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.5',
  'Accept-Encoding': 'gzip, deflate',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1'
});

// 延遲函數
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 隨機延遲
const randomDelay = (min, max) => {
  const delayTime = Math.floor(Math.random() * (max - min + 1)) + min;
  return delay(delayTime);
};

module.exports = {
  CRAWLER_CONFIG,
  USER_AGENTS,
  getHeaders,
  delay,
  randomDelay
}; 