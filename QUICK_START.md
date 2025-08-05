# 🎮 Pokemon TCG 價格追蹤系統 - 快速開始指南

## 概述

本系統現在可以從 **PriceCharting.com** 和 **SNKRDUNK.com** 自動爬取真實的 Pokemon 卡牌價格數據，讓你能夠搜索和追蹤真實的市場價格！

## 🚀 一鍵啟動（推薦）

### 方法 1: 使用啟動腳本
```bash
./start-pokemon-system.sh
```

這個腳本會自動：
- ✅ 檢查系統環境
- ✅ 安裝必要依賴
- ✅ 初始化數據庫
- ✅ 填充 15 張熱門 Pokemon 卡牌
- ✅ 從真實網站爬取價格數據
- ✅ 啟動前端和後端服務

### 方法 2: 使用 npm 命令
```bash
npm install          # 安裝依賴
npm run setup        # 完整系統設置
npm run dev:all      # 啟動前端和後端
```

## 📊 系統功能

### 🌐 網站訪問
- **主要界面**: http://localhost:3000
- **爬蟲管理**: http://localhost:3000/admin/crawler
- **API 服務器**: http://localhost:5000

### 🕷️ 數據來源
系統會從以下網站自動爬取真實價格：

1. **PriceCharting.com** 🇺🇸
   - 美國最大的遊戲收藏品價格網站
   - 提供國際市場價格（美元）
   - 歷史價格趨勢

2. **SNKRDUNK.com** 🇯🇵
   - 日本領先的收藏品交易平台
   - 日本市場價格（日圓）
   - 即時交易價格

## 🎯 包含的熱門卡牌

系統已預載以下熱門 Pokemon 卡牌：

### 經典系列
- 皮卡丘 (Pikachu) - Base Set
- 噴火龍 (Charizard) - Base Set
- 妙蛙種子 (Bulbasaur) - Base Set
- 傑尼龜 (Squirtle) - Base Set

### 現代熱門
- 皮卡丘 VMAX (Pikachu VMAX)
- 噴火龍 VMAX (Charizard VMAX)
- 超夢 V (Mewtwo V)
- 洛奇亞 V (Lugia V)

### 新系列
- 新葉貓 (Sprigatito)
- 呆火鱷 (Fuecoco)
- 潤水鴨 (Quaxly)

### 訓練師卡牌
- 老大的指令 (Boss's Orders)
- 博士的研究 (Professor's Research)

## 🛠️ 管理功能

### 爬蟲管理界面 (http://localhost:3000/admin/crawler)
- 📊 實時監控爬蟲狀態
- 🚀 手動啟動統一爬蟲
- 🔍 測試個別數據源連接
- 📈 查看成功率和統計數據

### 可用的爬蟲命令
```bash
# 運行所有爬蟲
npm run crawl

# 測試 PriceCharting 爬蟲
npm run crawl:pricecharting

# 測試 SNKRDUNK 爬蟲
npm run crawl:snkrdunk

# 查看幫助
node scripts/setup-and-crawl.js --help
```

## 🔄 定期更新價格

系統支持定時自動更新價格：

1. **透過管理界面**: 訪問 `/admin/crawler` 啟動定時任務
2. **手動更新**: 隨時運行 `npm run crawl`
3. **單一來源測試**: 使用 `npm run crawl:pricecharting` 或 `npm run crawl:snkrdunk`

## 📋 系統架構

```
Pokemon TCG 價格追蹤系統
├── 🌐 Next.js 前端 (端口 3000)
├── 🔧 Express API 服務器 (端口 5000)  
├── 🗄️ SQLite 數據庫
├── 🕷️ 統一爬蟲服務
│   ├── PriceCharting 爬蟲
│   ├── SNKRDUNK 爬蟲
│   └── Mercari 爬蟲 (計劃中)
└── 📊 管理界面
```

## 🛟 故障排除

### 常見問題

**Q: 爬蟲無法獲取數據怎麼辦？**
A: 
1. 檢查網絡連接
2. 使用測試命令：`npm run crawl:pricecharting`
3. 查看 `/admin/crawler` 頁面的錯誤信息

**Q: 數據庫相關錯誤？**
A:
1. 重新初始化：`npm run db:reset`
2. 完整重設：`npm run setup`

**Q: 端口衝突？**
A: 
1. 確保端口 3000 和 5000 未被占用
2. 修改 `server/index.js` 中的端口設置

### 手動設置步驟

如果自動設置失敗，可以手動執行以下步驟：

```bash
# 1. 安裝依賴
npm install

# 2. 初始化數據庫
npm run db:init

# 3. 測試爬蟲連接
node scripts/setup-and-crawl.js test pricecharting

# 4. 爬取初始數據
npm run crawl

# 5. 啟動系統
npm run dev:all
```

## 🌟 功能特色

- ✅ **真實價格數據**: 從實際交易網站獲取價格
- ✅ **多貨幣支持**: 美元和日圓價格
- ✅ **自動更新**: 定時爬取最新價格
- ✅ **圖形界面**: 美觀的管理界面
- ✅ **搜索功能**: 快速查找卡牌價格
- ✅ **歷史數據**: 價格變化追蹤
- ✅ **多語言**: 支援中文、英文、日文卡牌名稱

## 📝 下一步

1. 訪問 http://localhost:3000 開始使用
2. 在搜索框中輸入卡牌名稱（如 "Pikachu", "Charizard"）
3. 查看真實的市場價格數據
4. 使用 `/admin/crawler` 管理和監控爬蟲狀態

## 🤝 技術支持

如果遇到問題：
1. 查看控制台輸出的錯誤信息
2. 檢查 `/admin/crawler` 頁面的統計數據
3. 嘗試重新運行設置：`npm run setup`

---

**🎉 現在你的 Pokemon TCG 價格追蹤系統已經可以提供真實的卡牌價格搜索功能了！**