// 卡牌基本信息類型
export interface Card {
  id: string;
  jpName: string;
  enName: string;
  cardNumber: string;
  rarity: string;
  set: string;
  setCode: string;
  imageUrl: string;
  releaseDate: string;
  condition?: string;
  language: 'jp' | 'en';
}

// 價格信息類型
export interface PriceData {
  id: string;
  cardId: string;
  source: 'mercari' | 'yahoo' | 'rakuten' | 'ebay' | 'tcgplayer';
  priceJPY: number;
  priceUSD: number;
  condition: 'NM' | 'LP' | 'MP' | 'HP' | 'DMG';
  timestamp: string;
  url?: string;
}

// 搜索結果類型
export interface SearchResult {
  cards: Card[];
  total: number;
  page: number;
  limit: number;
}

// 價格趨勢數據
export interface PriceTrend {
  date: string;
  averagePriceJPY: number;
  averagePriceUSD: number;
  minPriceJPY: number;
  maxPriceJPY: number;
  transactionCount: number;
}

// API 響應類型
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// 搜索參數類型
export interface SearchParams {
  query: string;
  language?: 'jp' | 'en';
  set?: string;
  rarity?: string;
  condition?: string;
  page?: number;
  limit?: number;
}

// 用戶收藏類型
export interface UserFavorite {
  id: string;
  userId: string;
  cardId: string;
  createdAt: string;
  card: Card;
}

// 價格警報類型
export interface PriceAlert {
  id: string;
  userId: string;
  cardId: string;
  targetPriceJPY: number;
  targetPriceUSD: number;
  isActive: boolean;
  createdAt: string;
  card: Card;
} 