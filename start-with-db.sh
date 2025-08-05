#!/bin/bash

# 設置環境變量
export DB_HOST=localhost
export DB_PORT=5432
export DB_USER=postgres
export DB_PASSWORD=password
export DB_NAME=pokemon_tcg
export REDIS_URL=redis://localhost:6379
export PORT=3000
export SERVER_PORT=3001
export NODE_ENV=development
export NEXT_PUBLIC_API_URL=http://localhost:3001/api
export JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

echo "🚀 Starting Pokemon TCG Tracker with database..."

# 檢查 Docker 是否運行
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# 啟動數據庫服務
echo "📦 Starting database services..."
docker-compose up -d

# 等待數據庫啟動
echo "⏳ Waiting for database to be ready..."
sleep 10

# 檢查 node_modules 是否存在
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# 初始化數據庫
echo "🗄️ Initializing database..."
npm run db:init

# 啟動開發服務器
echo "🌐 Starting development servers..."
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:3001"
echo "Database: localhost:5432"
echo "Redis: localhost:6379"

# 使用 concurrently 同時啟動前端和後端
npx concurrently \
  "npm run dev" \
  "npm run dev:server" \
  --names "frontend,backend" \
  --prefix-colors "blue,green" 