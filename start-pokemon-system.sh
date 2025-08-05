#!/bin/bash

# Pokemon TCG 價格追蹤系統一鍵啟動腳本

echo "🎮 Pokemon TCG 價格追蹤系統啟動器"
echo "===================================="
echo ""

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 檢查 Node.js
echo -e "${BLUE}檢查系統環境...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js 未安裝。請先安裝 Node.js。${NC}"
    exit 1
fi

# 檢查 npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm 未安裝。請先安裝 npm。${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js 和 npm 已安裝${NC}"
echo ""

# 安裝依賴
echo -e "${BLUE}安裝項目依賴...${NC}"
if npm install; then
    echo -e "${GREEN}✅ 依賴安裝完成${NC}"
else
    echo -e "${RED}❌ 依賴安裝失敗${NC}"
    exit 1
fi
echo ""

# 執行系統設置
echo -e "${BLUE}執行系統設置和數據填充...${NC}"
echo -e "${YELLOW}這將包括:${NC}"
echo -e "${YELLOW}  📊 初始化數據庫${NC}"
echo -e "${YELLOW}  🌱 填充 Pokemon 卡牌種子數據${NC}"
echo -e "${YELLOW}  🕷️ 從 PriceCharting 和 SNKRDUNK 爬取真實價格${NC}"
echo ""

if npm run setup; then
    echo -e "${GREEN}✅ 系統設置和數據填充完成！${NC}"
else
    echo -e "${RED}❌ 系統設置失敗${NC}"
    echo -e "${YELLOW}提示：你仍然可以手動啟動系統，但可能沒有真實價格數據。${NC}"
fi
echo ""

# 啟動系統
echo -e "${BLUE}啟動 Pokemon TCG 價格追蹤系統...${NC}"
echo -e "${GREEN}系統將在以下地址可用:${NC}"
echo -e "${GREEN}  🌐 前端界面: http://localhost:3000${NC}"
echo -e "${GREEN}  🔧 API 服務器: http://localhost:5000${NC}"
echo -e "${GREEN}  ⚡ 爬蟲管理: http://localhost:3000/admin/crawler${NC}"
echo ""
echo -e "${YELLOW}按 Ctrl+C 停止系統${NC}"
echo ""

# 使用 concurrently 同時啟動前端和後端
npm run dev:all