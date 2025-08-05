#!/bin/bash

# 設置環境變量
export NEXT_PUBLIC_API_URL=http://localhost:3001/api
export NODE_ENV=development
export PORT=3000
export SERVER_PORT=3001

echo "🚀 Starting Pokemon TCG Price Tracker..."

# 檢查是否安裝了依賴
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# 啟動開發服務器
echo "🌐 Starting development servers..."
npm run dev:all 