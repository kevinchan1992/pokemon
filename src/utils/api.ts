import axios from 'axios';
import { ApiResponse, SearchParams, SearchResult, Card, PriceData, PriceTrend } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// 創建 axios 實例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 請求攔截器
apiClient.interceptors.request.use(
  (config) => {
    // 添加認證 token
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 響應攔截器
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // 清除無效 token
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 搜索卡牌
export const searchCards = async (params: SearchParams): Promise<SearchResult> => {
  try {
    const response = await apiClient.get<ApiResponse<SearchResult>>('/search', {
      params,
    });
    return response.data.data;
  } catch (error) {
    console.error('搜索卡牌失敗:', error);
    throw error;
  }
};

// 獲取卡牌詳情
export const getCardDetails = async (cardId: string): Promise<Card> => {
  try {
    const response = await apiClient.get<ApiResponse<Card>>(`/cards/${cardId}`);
    return response.data.data;
  } catch (error) {
    console.error('獲取卡牌詳情失敗:', error);
    throw error;
  }
};

// 獲取卡牌價格數據
export const getCardPrices = async (cardId: string, days: number = 30): Promise<PriceData[]> => {
  try {
    const response = await apiClient.get<ApiResponse<PriceData[]>>(`/cards/${cardId}/prices`, {
      params: { days },
    });
    return response.data.data;
  } catch (error) {
    console.error('獲取價格數據失敗:', error);
    throw error;
  }
};

// 獲取價格趨勢
export const getPriceTrends = async (cardId: string, days: number = 30): Promise<PriceTrend[]> => {
  try {
    const response = await apiClient.get<ApiResponse<PriceTrend[]>>(`/cards/${cardId}/trends`, {
      params: { days },
    });
    return response.data.data;
  } catch (error) {
    console.error('獲取價格趨勢失敗:', error);
    throw error;
  }
};

// 獲取熱門卡牌
export const getPopularCards = async (limit: number = 10): Promise<Card[]> => {
  try {
    const response = await apiClient.get<ApiResponse<Card[]>>('/cards/popular', {
      params: { limit },
    });
    return response.data.data;
  } catch (error) {
    console.error('獲取熱門卡牌失敗:', error);
    throw error;
  }
};

// 獲取卡包列表
export const getSets = async (): Promise<{ code: string; name: string }[]> => {
  try {
    const response = await apiClient.get<ApiResponse<{ code: string; name: string }[]>>('/sets');
    return response.data.data;
  } catch (error) {
    console.error('獲取卡包列表失敗:', error);
    throw error;
  }
};

// 用戶收藏相關 API
export const addToFavorites = async (cardId: string): Promise<void> => {
  try {
    await apiClient.post('/favorites', { cardId });
  } catch (error) {
    console.error('添加到收藏失敗:', error);
    throw error;
  }
};

export const removeFromFavorites = async (cardId: string): Promise<void> => {
  try {
    await apiClient.delete(`/favorites/${cardId}`);
  } catch (error) {
    console.error('移除收藏失敗:', error);
    throw error;
  }
};

export const getFavorites = async (): Promise<Card[]> => {
  try {
    const response = await apiClient.get<ApiResponse<Card[]>>('/favorites');
    return response.data.data;
  } catch (error) {
    console.error('獲取收藏列表失敗:', error);
    throw error;
  }
};

// 價格警報相關 API
export const createPriceAlert = async (cardId: string, targetPriceJPY: number, targetPriceUSD: number): Promise<void> => {
  try {
    await apiClient.post('/alerts', { cardId, targetPriceJPY, targetPriceUSD });
  } catch (error) {
    console.error('創建價格警報失敗:', error);
    throw error;
  }
};

export const getPriceAlerts = async (): Promise<any[]> => {
  try {
    const response = await apiClient.get<ApiResponse<any[]>>('/alerts');
    return response.data.data;
  } catch (error) {
    console.error('獲取價格警報失敗:', error);
    throw error;
  }
};

export default apiClient; 