// 卡牌稀有度
export const RARITIES = {
  COMMON: 'Common',
  UNCOMMON: 'Uncommon',
  RARE: 'Rare',
  RARE_HOLO: 'Rare Holo',
  RARE_HOLO_GX: 'Rare Holo GX',
  RARE_HOLO_V: 'Rare Holo V',
  RARE_HOLO_VMAX: 'Rare Holo VMAX',
  RARE_HOLO_VSTAR: 'Rare Holo VSTAR',
  SECRET: 'Secret',
  ULTRA_RARE: 'Ultra Rare',
  RAINBOW_RARE: 'Rainbow Rare',
  GOLD_RARE: 'Gold Rare',
} as const;

// 卡牌狀態
export const CONDITIONS = {
  NM: 'NM', // Near Mint
  LP: 'LP', // Lightly Played
  MP: 'MP', // Moderately Played
  HP: 'HP', // Heavily Played
  DMG: 'DMG', // Damaged
} as const;

// 數據來源
export const DATA_SOURCES = {
  MERCARI: 'mercari',
  YAHOO: 'yahoo',
  RAKUTEN: 'rakuten',
  EBAY: 'ebay',
  TCGPLAYER: 'tcgplayer',
} as const;

// 語言選項
export const LANGUAGES = {
  JP: 'jp',
  EN: 'en',
} as const;

// 價格貨幣
export const CURRENCIES = {
  JPY: 'JPY',
  USD: 'USD',
} as const;

// 搜索結果排序選項
export const SORT_OPTIONS = {
  RELEVANCE: 'relevance',
  PRICE_LOW_TO_HIGH: 'price_low_to_high',
  PRICE_HIGH_TO_LOW: 'price_high_to_low',
  NAME_A_TO_Z: 'name_a_to_z',
  NAME_Z_TO_A: 'name_z_to_a',
  NEWEST: 'newest',
  OLDEST: 'oldest',
} as const;

// 分頁設置
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

// 價格趨勢時間範圍
export const TREND_PERIODS = {
  WEEK: 7,
  MONTH: 30,
  QUARTER: 90,
  YEAR: 365,
} as const;

// 熱門搜索詞
export const POPULAR_SEARCHES = [
  'ピカチュウ',
  'Pikachu',
  'リザードン',
  'Charizard',
  'ミュウツー',
  'Mewtwo',
  'ルカリオ',
  'Lucario',
  'ガルーラ',
  'Gengar',
];

// 卡包系列
export const POPULAR_SETS = [
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

// 錯誤消息
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '網絡連接錯誤，請檢查您的網絡連接',
  SEARCH_ERROR: '搜索失敗，請稍後再試',
  CARD_NOT_FOUND: '未找到該卡牌',
  PRICE_DATA_UNAVAILABLE: '價格數據暫時不可用',
  FAVORITE_ERROR: '收藏操作失敗',
  ALERT_ERROR: '價格警報設置失敗',
  AUTH_ERROR: '認證失敗，請重新登錄',
} as const;

// 成功消息
export const SUCCESS_MESSAGES = {
  FAVORITE_ADDED: '已添加到收藏',
  FAVORITE_REMOVED: '已從收藏中移除',
  ALERT_CREATED: '價格警報已創建',
  ALERT_UPDATED: '價格警報已更新',
  ALERT_DELETED: '價格警報已刪除',
} as const; 