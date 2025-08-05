#!/bin/bash

# 設置環境變量
export NEXT_PUBLIC_API_URL=http://localhost:3001/api
export PORT=3000
export SERVER_PORT=3001
export NODE_ENV=development

# 檢查 node_modules 是否存在
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# 啟動開發服務器
echo "Starting development servers..."
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:3001"

# 使用 concurrently 同時啟動前端和後端
npx concurrently \
  "npm run dev" \
  "node server/index.js" \
  --names "frontend,backend" \
  --prefix-colors "blue,green" 