#!/usr/bin/env node

const { initializeDatabase } = require('../server/models');
const { seedCards } = require('../server/seeders/cardSeeder');

async function initDatabase() {
  try {
    console.log('🚀 Initializing database...');
    
    // 初始化數據庫
    await initializeDatabase();
    
    // 種子數據
    console.log('🌱 Seeding data...');
    await seedCards();
    
    console.log('✅ Database initialization completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

// 如果直接運行此腳本
if (require.main === module) {
  initDatabase();
}

module.exports = { initDatabase }; 