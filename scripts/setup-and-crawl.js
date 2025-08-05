#!/usr/bin/env node

const { sequelize } = require('../server/config/database');
const { initializeDatabase } = require('../server/models');
const { seedCards } = require('../server/seeders/cardSeeder');
const unifiedCrawlerService = require('../server/services/unifiedCrawlerService');

async function setupAndCrawl() {
  console.log('🚀 Pokemon TCG Price Tracker - 完整設置和數據爬取');
  console.log('================================================');

  try {
    // 步驟 1: 初始化數據庫
    console.log('\n📦 步驟 1: 初始化數據庫...');
    await initializeDatabase();
    console.log('✅ 數據庫初始化完成');

    // 步驟 2: 填充種子數據
    console.log('\n🌱 步驟 2: 填充 Pokemon 卡牌種子數據...');
    const cards = await seedCards();
    console.log(`✅ 成功創建 ${cards.length} 張卡牌`);

    // 步驟 3: 測試爬蟲連接
    console.log('\n🔍 步驟 3: 測試爬蟲連接...');
    const connectionResults = await unifiedCrawlerService.testConnections();
    console.log('連接測試結果:');
    Object.entries(connectionResults).forEach(([source, status]) => {
      console.log(`  - ${source}: ${status}`);
    });

    // 步驟 4: 執行爬蟲獲取真實價格數據
    console.log('\n🕷️ 步驟 4: 開始爬取真實價格數據...');
    console.log('這可能需要幾分鐘時間，請耐心等待...');
    
    // 執行統一爬蟲
    await unifiedCrawlerService.runAllCrawlers();
    
    // 獲取統計信息
    const stats = unifiedCrawlerService.getStats();
    
    console.log('\n📊 爬蟲執行統計:');
    console.log(`  - 總請求數: ${stats.totalRequests}`);
    console.log(`  - 成功請求: ${stats.successfulRequests}`);
    console.log(`  - 失敗請求: ${stats.failedRequests}`);
    console.log(`  - 成功率: ${stats.successRate}`);
    
    console.log('\n📈 各數據源統計:');
    Object.entries(stats.sources).forEach(([source, data]) => {
      console.log(`  - ${source}: 成功 ${data.success}, 失敗 ${data.failed}`);
    });

    // 步驟 5: 查詢並顯示部分結果
    console.log('\n🔎 步驟 5: 查詢價格數據...');
    const { Card, Price } = require('../server/models');
    const priceCount = await Price.count();
    console.log(`✅ 數據庫中共有 ${priceCount} 條價格記錄`);

    // 顯示一些示例數據
    const samplePrices = await Price.findAll({
      limit: 5,
      include: [{
        model: Card,
        as: 'card'
      }],
      order: [['createdAt', 'DESC']]
    });

    if (samplePrices.length > 0) {
      console.log('\n💰 最新價格數據示例:');
      samplePrices.forEach((price, index) => {
        console.log(`\n${index + 1}. ${price.card.jpName} (${price.card.enName})`);
        console.log(`   - 價格: ¥${price.priceJPY} / $${price.priceUSD}`);
        console.log(`   - 來源: ${price.source}`);
        console.log(`   - 狀態: ${price.condition}`);
      });
    }

    console.log('\n✨ 設置完成！系統現在已經有真實的 Pokemon TCG 價格數據了！');
    console.log('\n🌐 訪問 http://localhost:3000 查看網站');
    console.log('🔧 訪問 http://localhost:3000/admin/crawler 管理爬蟲');

  } catch (error) {
    console.error('\n❌ 設置過程中發生錯誤:', error);
    process.exit(1);
  } finally {
    // 關閉數據庫連接
    await sequelize.close();
  }
}

// 主程序
if (require.main === module) {
  setupAndCrawl().then(() => {
    console.log('\n👋 程序執行完成');
    process.exit(0);
  }).catch(error => {
    console.error('❌ 程序執行失敗:', error);
    process.exit(1);
  });
}

module.exports = { setupAndCrawl };