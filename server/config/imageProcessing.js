const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

// 圖片處理配置
const IMAGE_CONFIG = {
  // 縮放尺寸
  sizes: {
    thumbnail: { width: 150, height: 150 },
    small: { width: 300, height: 300 },
    medium: { width: 600, height: 600 },
    large: { width: 1200, height: 1200 }
  },
  
  // 圖片格式
  formats: ['webp', 'jpeg', 'png'],
  
  // 質量設置
  quality: {
    webp: 80,
    jpeg: 85,
    png: 9
  },
  
  // 存儲路徑
  storage: {
    local: './public/images',
    cdn: 'https://cdn.pokemontcg.com'
  }
};

// 圖片處理工具類
class ImageProcessor {
  constructor() {
    this.ensureDirectories();
  }

  // 確保目錄存在
  async ensureDirectories() {
    const dirs = [
      IMAGE_CONFIG.storage.local,
      `${IMAGE_CONFIG.storage.local}/thumbnails`,
      `${IMAGE_CONFIG.storage.local}/small`,
      `${IMAGE_CONFIG.storage.local}/medium`,
      `${IMAGE_CONFIG.storage.local}/large`
    ];

    for (const dir of dirs) {
      try {
        await fs.mkdir(dir, { recursive: true });
      } catch (error) {
        console.warn(`目錄已存在: ${dir}`);
      }
    }
  }

  // 處理圖片並生成多種尺寸
  async processImage(inputBuffer, filename, options = {}) {
    try {
      const results = {};
      
      for (const [sizeName, dimensions] of Object.entries(IMAGE_CONFIG.sizes)) {
        const processedImages = {};
        
        for (const format of IMAGE_CONFIG.formats) {
          const processedBuffer = await this.resizeAndOptimize(
            inputBuffer,
            dimensions,
            format,
            options
          );
          
          const outputFilename = this.generateFilename(filename, sizeName, format);
          const outputPath = path.join(IMAGE_CONFIG.storage.local, sizeName, outputFilename);
          
          // 保存文件
          await fs.writeFile(outputPath, processedBuffer);
          
          processedImages[format] = {
            path: outputPath,
            url: `/images/${sizeName}/${outputFilename}`,
            size: processedBuffer.length
          };
        }
        
        results[sizeName] = processedImages;
      }
      
      return results;
    } catch (error) {
      console.error('圖片處理失敗:', error);
      throw error;
    }
  }

  // 調整尺寸和優化
  async resizeAndOptimize(buffer, dimensions, format, options = {}) {
    let sharpInstance = sharp(buffer);
    
    // 調整尺寸
    sharpInstance = sharpInstance.resize(dimensions.width, dimensions.height, {
      fit: 'inside',
      withoutEnlargement: true,
      ...options.resize
    });
    
    // 根據格式設置輸出選項
    switch (format) {
      case 'webp':
        return sharpInstance.webp({ 
          quality: IMAGE_CONFIG.quality.webp,
          ...options.webp 
        }).toBuffer();
        
      case 'jpeg':
        return sharpInstance.jpeg({ 
          quality: IMAGE_CONFIG.quality.jpeg,
          progressive: true,
          ...options.jpeg 
        }).toBuffer();
        
      case 'png':
        return sharpInstance.png({ 
          compressionLevel: IMAGE_CONFIG.quality.png,
          ...options.png 
        }).toBuffer();
        
      default:
        return sharpInstance.toBuffer();
    }
  }

  // 生成文件名
  generateFilename(originalName, size, format) {
    const nameWithoutExt = path.parse(originalName).name;
    const timestamp = Date.now();
    return `${nameWithoutExt}_${size}_${timestamp}.${format}`;
  }

  // 獲取圖片 URL（支持 CDN）
  getImageUrl(filename, size = 'medium', format = 'webp', useCDN = false) {
    if (useCDN) {
      return `${IMAGE_CONFIG.storage.cdn}/${size}/${filename}`;
    } else {
      return `/images/${size}/${filename}`;
    }
  }

  // 批量處理圖片
  async batchProcessImages(files) {
    const results = [];
    
    for (const file of files) {
      try {
        const processed = await this.processImage(file.buffer, file.originalname);
        results.push({
          originalName: file.originalname,
          processed: processed
        });
      } catch (error) {
        console.error(`處理圖片失敗: ${file.originalname}`, error);
        results.push({
          originalName: file.originalname,
          error: error.message
        });
      }
    }
    
    return results;
  }

  // 清理舊圖片
  async cleanupOldImages(directory, maxAge = 24 * 60 * 60 * 1000) { // 24小時
    try {
      const files = await fs.readdir(directory);
      const now = Date.now();
      
      for (const file of files) {
        const filePath = path.join(directory, file);
        const stats = await fs.stat(filePath);
        
        if (now - stats.mtime.getTime() > maxAge) {
          await fs.unlink(filePath);
          console.log(`已刪除舊圖片: ${filePath}`);
        }
      }
    } catch (error) {
      console.error('清理舊圖片失敗:', error);
    }
  }

  // 獲取圖片信息
  async getImageInfo(buffer) {
    try {
      const metadata = await sharp(buffer).metadata();
      return {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        size: buffer.length,
        hasAlpha: metadata.hasAlpha
      };
    } catch (error) {
      console.error('獲取圖片信息失敗:', error);
      return null;
    }
  }
}

module.exports = {
  ImageProcessor,
  IMAGE_CONFIG
}; 