#!/usr/bin/env node

const pricechartingCrawler = require('../server/services/pricechartingCrawlerService');
const snkrdunkCrawler = require('../server/services/snkrdunkCrawlerService');

async function testCrawlers() {
  console.log('🧪 測試 Pokemon TCG 爬蟲功能');
  console.log('==============================\n');

  const testCards = [
    { name: 'Charizard', expectedSource: 'both' },
    { name: 'Pikachu', expectedSource: 'both' },
    { name: 'Mewtwo', expectedSource: 'both' }
  ];

  for (const testCard of testCards) {
    console.log(`\n📋 測試卡牌: ${testCard.name}`);
    console.log('------------------------');

    // 測試 PriceCharting
    try {
      console.log('\n🇺🇸 測試 PriceCharting 爬蟲...');
      const pcResult = await pricechartingCrawler.scrapeCardPrice(testCard.name);
      
      if (pcResult) {
        console.log('✅ PriceCharting 成功！');
        console.log(`   - 卡牌名稱: ${pcResult.cardName}`);
        console.log(`   - 市場價格: ${pcResult.marketPrice ? `$${pcResult.marketPrice.amount}` : '無數據'}`);
        console.log(`   - 圖片URL: ${pcResult.imageUrl ? '有' : '無'}`);
        console.log(`   - 來源URL: ${pcResult.url}`);
      } else {
        console.log('⚠️ PriceCharting 無結果');
      }
    } catch (error) {
      console.error('❌ PriceCharting 錯誤:', error.message);
    }

    // 測試 SNKRDUNK
    try {
      console.log('\n🇯🇵 測試 SNKRDUNK 爬蟲...');
      const snkrResult = await snkrdunkCrawler.scrapeCardPrice(testCard.name);
      
      if (snkrResult) {
        console.log('✅ SNKRDUNK 成功！');
        console.log(`   - 卡牌名稱: ${snkrResult.cardName}`);
        console.log(`   - 市場價格: ${snkrResult.marketPrice ? `¥${snkrResult.marketPrice.amount}` : '無數據'}`);
        console.log(`   - 圖片URL: ${snkrResult.imageUrl ? '有' : '無'}`);
        console.log(`   - 來源URL: ${snkrResult.url}`);
      } else {
        console.log('⚠️ SNKRDUNK 無結果');
      }
    } catch (error) {
      console.error('❌ SNKRDUNK 錯誤:', error.message);
    }

    // 等待避免請求過快
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  // 測試搜索功能
  console.log('\n\n🔍 測試搜索功能');
  console.log('================');

  try {
    console.log('\n測試 PriceCharting 搜索 "Pokemon"...');
    const pcSearchResults = await pricechartingCrawler.searchCard('Pokemon');
    console.log(`✅ 找到 ${pcSearchResults.length} 個結果`);
    
    if (pcSearchResults.length > 0) {
      console.log('前 3 個結果:');
      pcSearchResults.slice(0, 3).forEach((result, index) => {
        console.log(`${index + 1}. ${result.title} - ${result.price}`);
      });
    }
  } catch (error) {
    console.error('❌ PriceCharting 搜索錯誤:', error.message);
  }

  try {
    console.log('\n測試 SNKRDUNK 搜索 "ポケモン"...');
    const snkrSearchResults = await snkrdunkCrawler.searchCard('ポケモン');
    console.log(`✅ 找到 ${snkrSearchResults.length} 個結果`);
    
    if (snkrSearchResults.length > 0) {
      console.log('前 3 個結果:');
      snkrSearchResults.slice(0, 3).forEach((result, index) => {
        console.log(`${index + 1}. ${result.title} - ${result.price}`);
      });
    }
  } catch (error) {
    console.error('❌ SNKRDUNK 搜索錯誤:', error.message);
  }

  console.log('\n\n✨ 測試完成！');
  
  // 關閉瀏覽器
  await pricechartingCrawler.closeBrowser();
  await snkrdunkCrawler.closeBrowser();
}

// 執行測試
if (require.main === module) {
  testCrawlers().then(() => {
    console.log('\n👋 測試程序結束');
    process.exit(0);
  }).catch(error => {
    console.error('❌ 測試失敗:', error);
    process.exit(1);
  });
}

module.exports = { testCrawlers };