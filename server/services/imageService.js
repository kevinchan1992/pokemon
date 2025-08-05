const multer = require('multer');
const { ImageProcessor } = require('../config/imageProcessing');
const { CDNService } = require('../config/cdn');
const { Card } = require('../models');

// Multer 配置
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 10
  },
  fileFilter: (req, file, cb) => {
    // 檢查文件類型
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('只允許上傳圖片文件'), false);
    }
  }
});

class ImageService {
  constructor() {
    this.imageProcessor = new ImageProcessor();
    this.cdnService = new CDNService();
  }

  // 獲取 multer 實例
  getUploadMiddleware() {
    return upload;
  }

  // 處理單個圖片上傳
  async processSingleImage(file, options = {}) {
    try {
      // 獲取圖片信息
      const imageInfo = await this.imageProcessor.getImageInfo(file.buffer);
      
      // 處理圖片
      const processedImages = await this.imageProcessor.processImage(
        file.buffer,
        file.originalname,
        options
      );

      // 上傳到 CDN（如果配置了）
      let cdnResult = null;
      if (options.uploadToCDN) {
        cdnResult = await this.cdnService.uploadToCloudinary(file.buffer, {
          public_id: file.originalname.replace(/\.[^/.]+$/, ''),
          ...options.cdnOptions
        });
      }

      return {
        originalName: file.originalname,
        imageInfo,
        processedImages,
        cdnResult,
        success: true
      };
    } catch (error) {
      console.error('圖片處理失敗:', error);
      return {
        originalName: file.originalname,
        error: error.message,
        success: false
      };
    }
  }

  // 批量處理圖片
  async processMultipleImages(files, options = {}) {
    const results = [];
    
    for (const file of files) {
      const result = await this.processSingleImage(file, options);
      results.push(result);
    }
    
    return results;
  }

  // 更新卡牌圖片
  async updateCardImage(cardId, imageFile, options = {}) {
    try {
      // 處理圖片
      const processedResult = await this.processSingleImage(imageFile, options);
      
      if (!processedResult.success) {
        throw new Error(processedResult.error);
      }

      // 更新數據庫中的圖片 URL
      const imageUrls = {};
      for (const [size, formats] of Object.entries(processedResult.processedImages)) {
        imageUrls[size] = formats.webp.url; // 使用 WebP 格式
      }

      await Card.update(
        { 
          imageUrl: imageUrls.medium,
          imageUrls: JSON.stringify(imageUrls)
        },
        { where: { id: cardId } }
      );

      return {
        cardId,
        imageUrls,
        cdnUrl: processedResult.cdnResult?.secure_url,
        success: true
      };
    } catch (error) {
      console.error('更新卡牌圖片失敗:', error);
      throw error;
    }
  }

  // 獲取圖片 URL（支持響應式）
  getResponsiveImageUrl(imageUrls, size = 'medium', format = 'webp') {
    if (typeof imageUrls === 'string') {
      imageUrls = JSON.parse(imageUrls);
    }

    if (imageUrls && imageUrls[size] && imageUrls[size][format]) {
      return imageUrls[size][format];
    }

    // 回退到默認圖片
    return '/images/default-card.png';
  }

  // 生成響應式圖片標籤
  generateResponsiveImage(imageUrls, alt = '', className = '') {
    if (typeof imageUrls === 'string') {
      imageUrls = JSON.parse(imageUrls);
    }

    const srcset = [];
    const sizes = ['thumbnail', 'small', 'medium', 'large'];
    
    for (const size of sizes) {
      if (imageUrls && imageUrls[size] && imageUrls[size].webp) {
        srcset.push(`${imageUrls[size].webp} ${size === 'thumbnail' ? '150w' : size === 'small' ? '300w' : size === 'medium' ? '600w' : '1200w'}`);
      }
    }

    return {
      src: imageUrls?.medium?.webp || '/images/default-card.png',
      srcset: srcset.join(', '),
      sizes: '(max-width: 768px) 300px, (max-width: 1200px) 600px, 1200px',
      alt,
      className
    };
  }

  // 清理舊圖片
  async cleanupOldImages() {
    try {
      const directories = [
        './public/images/thumbnails',
        './public/images/small',
        './public/images/medium',
        './public/images/large'
      ];

      for (const directory of directories) {
        await this.imageProcessor.cleanupOldImages(directory);
      }

      console.log('✅ 舊圖片清理完成');
    } catch (error) {
      console.error('❌ 清理舊圖片失敗:', error);
    }
  }

  // 獲取圖片統計
  async getImageStats() {
    try {
      const fs = require('fs').promises;
      const path = require('path');

      const stats = {
        totalFiles: 0,
        totalSize: 0,
        bySize: {},
        byFormat: {}
      };

      const directories = [
        './public/images/thumbnails',
        './public/images/small',
        './public/images/medium',
        './public/images/large'
      ];

      for (const directory of directories) {
        try {
          const files = await fs.readdir(directory);
          const sizeName = path.basename(directory);
          
          stats.bySize[sizeName] = {
            count: files.length,
            size: 0
          };

          for (const file of files) {
            const filePath = path.join(directory, file);
            const fileStats = await fs.stat(filePath);
            
            stats.totalFiles++;
            stats.totalSize += fileStats.size;
            stats.bySize[sizeName].size += fileStats.size;

            const format = path.extname(file).slice(1);
            if (!stats.byFormat[format]) {
              stats.byFormat[format] = { count: 0, size: 0 };
            }
            stats.byFormat[format].count++;
            stats.byFormat[format].size += fileStats.size;
          }
        } catch (error) {
          console.warn(`無法讀取目錄: ${directory}`);
        }
      }

      return stats;
    } catch (error) {
      console.error('獲取圖片統計失敗:', error);
      return null;
    }
  }
}

module.exports = {
  ImageService,
  upload
}; 