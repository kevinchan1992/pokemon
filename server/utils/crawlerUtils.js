// 延遲函數
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 隨機延遲函數
const randomDelay = (min, max) => {
  const delayTime = Math.floor(Math.random() * (max - min + 1)) + min;
  return delay(delayTime);
};

// 生成隨機用戶代理
const getRandomUserAgent = () => {
  const userAgents = [
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0'
  ];
  return userAgents[Math.floor(Math.random() * userAgents.length)];
};

// 清理文本
const cleanText = (text) => {
  if (!text) return '';
  return text.replace(/\s+/g, ' ').trim();
};

// 提取價格
const extractPrice = (priceText) => {
  if (!priceText) return 0;
  
  // 移除貨幣符號和逗號
  const cleaned = priceText.replace(/[$,¥€£]/g, '').replace(/,/g, '');
  
  // 提取數字
  const match = cleaned.match(/[\d,]+\.?\d*/);
  return match ? parseFloat(match[0]) : 0;
};

// 提取數字
const extractNumber = (text) => {
  if (!text) return null;
  const match = text.match(/\d+/);
  return match ? parseInt(match[0]) : null;
};

// 檢查是否為有效 URL
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// 標準化卡牌名稱
const normalizeCardName = (name) => {
  if (!name) return '';
  
  // 移除多餘的空格和特殊字符
  let normalized = name.replace(/\s+/g, ' ').trim();
  
  // 移除常見的後綴
  normalized = normalized.replace(/\s*\([^)]*\)\s*$/g, '');
  normalized = normalized.replace(/\s*\[[^\]]*\]\s*$/g, '');
  
  return normalized;
};

// 檢測語言
const detectLanguage = (text) => {
  if (!text) return 'en';
  
  // 簡單的日文字符檢測
  const japaneseRegex = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/;
  if (japaneseRegex.test(text)) {
    return 'jp';
  }
  
  return 'en';
};

// 生成唯一 ID
const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// 格式化日期
const formatDate = (date) => {
  return new Date(date).toISOString();
};

// 檢查網絡連接
const checkNetworkConnection = async (url) => {
  try {
    const response = await fetch(url, { 
      method: 'HEAD',
      timeout: 5000 
    });
    return response.ok;
  } catch {
    return false;
  }
};

// 重試機制
const retry = async (fn, maxRetries = 3, delayMs = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await delay(delayMs * (i + 1));
    }
  }
};

// 批次處理
const batchProcess = async (items, processFn, batchSize = 10) => {
  const results = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(item => processFn(item))
    );
    results.push(...batchResults);
    
    // 批次間延遲
    if (i + batchSize < items.length) {
      await delay(1000);
    }
  }
  
  return results;
};

// 日誌記錄
const logCrawlerActivity = (message, level = 'info') => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  
  console.log(logMessage);
  
  // 可以添加文件日誌記錄
  // fs.appendFileSync('crawler.log', logMessage + '\n');
};

// 錯誤處理
const handleCrawlerError = (error, context = '') => {
  const errorMessage = `爬蟲錯誤 ${context}: ${error.message}`;
  logCrawlerActivity(errorMessage, 'error');
  
  // 可以添加錯誤報告
  // sendErrorReport(error, context);
};

module.exports = {
  delay,
  randomDelay,
  getRandomUserAgent,
  cleanText,
  extractPrice,
  extractNumber,
  isValidUrl,
  normalizeCardName,
  detectLanguage,
  generateUniqueId,
  formatDate,
  checkNetworkConnection,
  retry,
  batchProcess,
  logCrawlerActivity,
  handleCrawlerError
}; 