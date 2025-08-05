# Pokemon TCG Price Tracker

一個類似 snkrdunk 和 pricecharting 的 Pokemon TCG 卡牌價格追蹤平台，專注於日文版和國際版（英文）Pokemon TCG 卡牌。

## 🎯 項目目標

- 提供多語言卡牌搜索（日文/英文）
- 以日本市場為基準的卡牌價格展示
- 價格趨勢圖表與歷史數據
- 卡牌詳情頁面（圖像、版本信息、稀有度等）
- 用戶收藏和價格警報功能

## 🚀 技術架構

### 前端技術棧
- **框架**: Next.js 14 + React 18 + TypeScript
- **UI**: 自定義 CSS，響應式設計
- **狀態管理**: React Query
- **圖表**: Chart.js + React Chart.js 2
- **國際化**: i18next + react-i18next
- **部署**: Vercel/Netlify

### 後端技術棧（計劃中）
- **框架**: Node.js (Express) 或 Python (Django)
- **API**: RESTful + GraphQL
- **數據庫**: PostgreSQL
- **搜索引擎**: Elasticsearch
- **緩存**: Redis
- **任務隊列**: Celery (Python) 或 Bull (Node.js)

## 📁 項目結構

```
boxium/
├── src/
│   ├── components/          # React 組件
│   │   ├── Layout/         # 佈局組件
│   │   ├── Card/           # 卡牌相關組件
│   │   └── Search/         # 搜索相關組件
│   ├── pages/              # Next.js 頁面
│   ├── types/              # TypeScript 類型定義
│   ├── utils/              # 工具函數
│   ├── i18n/               # 國際化配置
│   └── api/                # API 相關
├── public/                 # 靜態資源
├── package.json            # 項目依賴
├── next.config.js          # Next.js 配置
├── tsconfig.json           # TypeScript 配置
└── README.md               # 項目說明
```

## 🎨 核心功能

### 1. 多語言搜索
- 支持日文和英文卡牌名稱搜索
- 智能匹配和模糊搜索
- 高級過濾器（卡包、稀有度、狀態等）

### 2. 價格追蹤
- 日本市場參考價格（Mercari、Yahoo Auctions、Rakuten）
- 國際市場價格（eBay、TCGplayer、TrollandToad）
- 價格趨勢圖表和歷史數據
- 價格警報功能

### 3. 用戶功能
- 收藏卡牌
- 價格警報設置
- 個人儀表板
- 搜索歷史

### 4. 數據展示
- 卡牌詳情頁面
- 價格比較
- 市場趨勢分析
- 熱門卡牌排行

## 🛠️ 安裝和運行

### 前置要求
- Node.js 18+ 
- npm 或 yarn

### 安裝依賴
```bash
npm install
# 或
yarn install
```

### 開發環境運行
```bash
npm run dev
# 或
yarn dev
```

### 構建生產版本
```bash
npm run build
# 或
yarn build
```

### 啟動生產服務器
```bash
npm start
# 或
yarn start
```

## 🌐 環境變量

創建 `.env.local` 文件：

```env
# API 配置
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# 數據庫配置
DATABASE_URL=postgresql://username:password@localhost:5432/pokemon_tcg

# Redis 配置
REDIS_URL=redis://localhost:6379

# Elasticsearch 配置
ELASTICSEARCH_URL=http://localhost:9200

# 外部 API 密鑰
MERCARI_API_KEY=your_mercari_api_key
YAHOO_API_KEY=your_yahoo_api_key
EBAY_API_KEY=your_ebay_api_key
```

## 📊 數據庫設計

### 卡牌表 (cards)
```sql
CREATE TABLE cards (
  id SERIAL PRIMARY KEY,
  jp_name VARCHAR(255) NOT NULL,
  en_name VARCHAR(255) NOT NULL,
  card_number VARCHAR(50),
  rarity VARCHAR(50),
  set_name VARCHAR(100),
  image_url TEXT,
  release_date DATE
);
```

### 價格表 (prices)
```sql
CREATE TABLE prices (
  id SERIAL PRIMARY KEY,
  card_id INTEGER REFERENCES cards(id),
  source VARCHAR(50),
  price_jpy NUMERIC(10,2),
  price_usd NUMERIC(10,2),
  condition VARCHAR(20),
  timestamp TIMESTAMPTZ DEFAULT NOW()
);
```

## 🔧 開發指南

### 添加新組件
1. 在 `src/components/` 下創建新文件夾
2. 創建組件文件（.tsx）
3. 添加類型定義
4. 編寫測試（可選）

### 添加新頁面
1. 在 `src/pages/` 下創建新文件
2. 使用 Layout 組件包裝
3. 添加路由配置（如需要）

### 國際化
1. 在 `src/i18n/index.ts` 中添加翻譯
2. 使用 `useTranslation` hook
3. 使用 `t()` 函數獲取翻譯

## 🚀 部署

### Vercel 部署
1. 連接 GitHub 倉庫
2. 配置環境變量
3. 自動部署

### Docker 部署
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📈 性能優化

- 圖片懶加載
- 代碼分割
- 緩存策略
- CDN 加速
- 數據庫索引優化

## 🔒 安全考慮

- API 速率限制
- 輸入驗證
- XSS 防護
- CSRF 防護
- 數據加密

## 📝 貢獻指南

1. Fork 項目
2. 創建功能分支
3. 提交更改
4. 發起 Pull Request

## 📄 許可證

MIT License

## 🤝 支持

如有問題或建議，請提交 Issue 或聯繫開發團隊。

## 🔮 未來計劃

- [ ] 移動端應用
- [ ] 社交功能
- [ ] 交易功能
- [ ] AI 價格預測
- [ ] 更多語言支持
- [ ] 高級分析工具

---

**注意**: 本項目僅供學習和研究使用，價格數據僅供參考。與 The Pokemon Company 無關聯。 

## 一鍵初始化和數據爬取

系統提供了一個便捷的腳本，可以一鍵完成數據庫初始化、種子數據填充和真實價格數據爬取：

```bash
# 執行一鍵設置腳本
npm run setup-and-crawl

# 或者直接執行
node scripts/setup-and-crawl.js
```

這個腳本會自動執行以下步驟：
1. 初始化數據庫表結構
2. 填充 20+ 張熱門 Pokemon TCG 卡牌數據
3. 測試爬蟲連接（PriceCharting 和 SNKRDUNK）
4. 從真實網站爬取最新價格數據
5. 顯示爬取統計和示例數據

執行完成後，您可以：
- 訪問 http://localhost:3000 查看網站
- 訪問 http://localhost:3000/admin/crawler 管理爬蟲
- 在搜索頁面搜索 Pokemon 卡牌並查看真實價格

## 數據來源

系統支持從以下網站爬取真實價格數據：

- **PriceCharting.com** - 美國市場的 Pokemon TCG 價格數據
- **SNKRDUNK.com** - 日本市場的 Pokemon TCG 價格數據
- **Mercari** - 日本二手交易平台的實際交易價格

所有價格數據都會自動進行貨幣轉換，同時顯示日圓和美元價格。 