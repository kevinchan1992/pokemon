const redis = require('redis');

// Redis 配置
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || null,
  db: process.env.REDIS_DB || 0,
  retry_strategy: (options) => {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      // 如果 Redis 服務器拒絕連接，返回錯誤
      return new Error('Redis 服務器拒絕連接');
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      // 重試時間超過 1 小時，停止重試
      return new Error('重試時間超過限制');
    }
    if (options.attempt > 10) {
      // 重試次數超過 10 次，停止重試
      return undefined;
    }
    // 重試延遲
    return Math.min(options.attempt * 100, 3000);
  }
};

// 創建 Redis 客戶端
const client = redis.createClient(redisConfig);

// 連接事件處理
client.on('connect', () => {
  console.log('✅ Redis 連接成功');
});

client.on('error', (err) => {
  console.error('❌ Redis 連接錯誤:', err);
});

client.on('ready', () => {
  console.log('✅ Redis 客戶端就緒');
});

// 緩存工具函數
const cache = {
  // 設置緩存
  async set(key, value, ttl = 3600) {
    try {
      const serializedValue = JSON.stringify(value);
      await client.setEx(key, ttl, serializedValue);
      return true;
    } catch (error) {
      console.error('❌ 設置緩存失敗:', error);
      return false;
    }
  },

  // 獲取緩存
  async get(key) {
    try {
      const value = await client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('❌ 獲取緩存失敗:', error);
      return null;
    }
  },

  // 刪除緩存
  async del(key) {
    try {
      await client.del(key);
      return true;
    } catch (error) {
      console.error('❌ 刪除緩存失敗:', error);
      return false;
    }
  },

  // 清空所有緩存
  async flush() {
    try {
      await client.flushDb();
      return true;
    } catch (error) {
      console.error('❌ 清空緩存失敗:', error);
      return false;
    }
  },

  // 設置緩存（如果不存在）
  async setNX(key, value, ttl = 3600) {
    try {
      const serializedValue = JSON.stringify(value);
      const result = await client.setNX(key, serializedValue);
      if (result) {
        await client.expire(key, ttl);
      }
      return result;
    } catch (error) {
      console.error('❌ 設置緩存失敗:', error);
      return false;
    }
  },

  // 獲取或設置緩存
  async getOrSet(key, callback, ttl = 3600) {
    try {
      // 嘗試獲取緩存
      let value = await this.get(key);
      
      if (value === null) {
        // 緩存不存在，執行回調函數
        value = await callback();
        
        // 設置緩存
        if (value !== null && value !== undefined) {
          await this.set(key, value, ttl);
        }
      }
      
      return value;
    } catch (error) {
      console.error('❌ 獲取或設置緩存失敗:', error);
      return null;
    }
  }
};

module.exports = {
  client,
  cache,
  redisConfig
}; 