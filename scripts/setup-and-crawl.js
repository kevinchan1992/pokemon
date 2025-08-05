#!/usr/bin/env node

const { initializeDatabase } = require('../server/models');
const { seedCards } = require('../server/seeders/cardSeeder');
const unifiedCrawlerService = require('../server/services/unifiedCrawlerService');
const pricechartingCrawler = require('../server/services/pricechartingCrawlerService');
const snkrdunkCrawler = require('../server/services/snkrdunkCrawlerService');

/**
 * 一鍵設置 Pokemon TCG 價格追蹤系統
 * 1. 初始化數據庫
 * 2. 填充種子數據
 * 3. 測試爬蟲連接
 * 4. 啟動真實數據爬取
 */
async function setupAndCrawl() {
  console.log('🚀 開始 Pokemon TCG 價格追蹤系統完整設置...\n');
  
  try {
    // 步驟 1: 初始化數據庫
    console.log('📊 步驟 1: 初始化數據庫...');
    await initializeDatabase();
    console.log('✅ 數據庫初始化完成\n');
    
    // 步驟 2: 填充種子數據
    console.log('🌱 步驟 2: 填充種子數據...');
    await seedCards();
    console.log('✅ 種子數據填充完成 - 已添加 15 張熱門 Pokemon 卡牌\n');
    
    // 步驟 3: 測試爬蟲連接
    console.log('🔍 步驟 3: 測試爬蟲連接...');
    const connectionResults = await unifiedCrawlerService.testConnections();
    console.log('連接測試結果:', connectionResults);
    console.log('✅ 爬蟲連接測試完成\n');
    
    // 步驟 4: 啟動真實數據爬取
    console.log('🕷️ 步驟 4: 啟動真實數據爬取...');
    console.log('正在從以下網站爬取真實價格數據:');
    console.log('  📈 PriceCharting.com - 美國市場價格');
    console.log('  🎌 SNKRDUNK.com - 日本市場價格');
    console.log('  📦 Mercari.jp - 二手市場價格\n');
    
    // 執行統一爬蟲
    await unifiedCrawlerService.runAllCrawlers();
    
    console.log('\n🎉 系統設置完成！');
    console.log('\n📋 設置摘要:');
    console.log('  ✅ 數據庫已初始化');
    console.log('  ✅ 15 張熱門卡牌已添加');
    console.log('  ✅ 真實價格數據已開始爬取');
    console.log('  ✅ 系統現在可以提供真實的卡牌價格搜索\n');
    
    console.log('🌐 接下來你可以:');
    console.log('  1. 啟動 Next.js 前端: npm run dev');
    console.log('  2. 啟動後端服務器: npm run dev:server');
    console.log('  3. 訪問 http://localhost:3000 開始使用');
    console.log('  4. 管理爬蟲: http://localhost:3000/admin/crawler\n');
    
    // 獲取統計信息
    const stats = unifiedCrawlerService.getStats();
    console.log('📊 當前統計:');
    console.log(`  - 總請求數: ${stats.totalRequests}`);
    console.log(`  - 成功率: ${stats.successRate}`);
    console.log(`  - 最後運行時間: ${stats.lastRun || '剛剛完成'}\n`);
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ 設置失敗:', error);
    console.error('\n🔧 故障排除建議:');
    console.error('  1. 確保所有依賴已安裝: npm install');
    console.error('  2. 檢查網絡連接');
    console.error('  3. 確保數據庫可用');
    console.error('  4. 查看詳細錯誤信息並重試\n');
    process.exit(1);
  }
}

/**
 * 僅運行爬蟲（不重新初始化數據庫）
 */
async function runCrawlersOnly() {
  console.log('🕷️ 僅啟動爬蟲服務...\n');
  
  try {
    console.log('正在從以下網站爬取最新價格數據:');
    console.log('  📈 PriceCharting.com');
    console.log('  🎌 SNKRDUNK.com');
    console.log('  📦 Mercari.jp\n');
    
    await unifiedCrawlerService.runAllCrawlers();
    
    const stats = unifiedCrawlerService.getStats();
    console.log('\n✅ 爬蟲運行完成!');
    console.log(`📊 成功率: ${stats.successRate}`);
    console.log(`📈 總請求數: ${stats.totalRequests}\n`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ 爬蟲運行失敗:', error);
    process.exit(1);
  }
}

/**
 * 測試單個爬蟲
 */
async function testSingleCrawler(source) {
  console.log(`🔍 測試 ${source} 爬蟲...\n`);
  
  try {
    const result = await unifiedCrawlerService.runSingleCrawler(source);
    console.log(`✅ ${source} 爬蟲測試完成，找到 ${result} 個價格\n`);
    process.exit(0);
  } catch (error) {
    console.error(`❌ ${source} 爬蟲測試失敗:`, error);
    process.exit(1);
  }
}

// 命令行參數處理
const args = process.argv.slice(2);
const command = args[0];

console.log('🎮 Pokemon TCG 價格追蹤系統設置工具\n');

switch (command) {
  case 'setup':
    setupAndCrawl();
    break;
  case 'crawl':
    runCrawlersOnly();
    break;
  case 'test':
    const source = args[1];
    if (!source || !['pricecharting', 'snkrdunk', 'mercari'].includes(source)) {
      console.error('❌ 請指定有效的數據源: pricecharting, snkrdunk, 或 mercari');
      console.error('使用方式: node scripts/setup-and-crawl.js test [source]');
      process.exit(1);
    }
    testSingleCrawler(source);
    break;
  case 'help':
  case '--help':
  case '-h':
    console.log('使用方式:');
    console.log('  node scripts/setup-and-crawl.js setup    # 完整設置（數據庫+種子數據+爬蟲）');
    console.log('  node scripts/setup-and-crawl.js crawl    # 僅運行爬蟲');
    console.log('  node scripts/setup-and-crawl.js test [source] # 測試單個爬蟲');
    console.log('');
    console.log('數據源:');
    console.log('  pricecharting  # 美國市場價格');
    console.log('  snkrdunk       # 日本市場價格');
    console.log('  mercari        # 二手市場價格');
    console.log('');
    process.exit(0);
    break;
  default:
    console.log('🎯 預設執行完整設置...\n');
    console.log('提示: 使用 --help 查看所有可用命令\n');
    setupAndCrawl();
}

module.exports = { setupAndCrawl, runCrawlersOnly, testSingleCrawler };