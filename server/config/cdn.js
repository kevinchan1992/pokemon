const cloudinary = require('cloudinary').v2;

// CDN 配置
const CDN_CONFIG = {
  // Cloudinary 配置
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'your-cloud-name',
    api_key: process.env.CLOUDINARY_API_KEY || 'your-api-key',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'your-api-secret',
    secure: true
  },
  
  // CDN 提供商配置
  providers: {
    cloudinary: {
      baseUrl: 'https://res.cloudinary.com',
      transformations: {
        thumbnail: 'w_150,h_150,c_fill,q_auto',
        small: 'w_300,h_300,c_fill,q_auto',
        medium: 'w_600,h_600,c_fill,q_auto',
        large: 'w_1200,h_1200,c_fill,q_auto'
      }
    },
    aws: {
      baseUrl: 'https://s3.amazonaws.com',
      bucket: process.env.AWS_S3_BUCKET || 'pokemon-tcg-images'
    }
  },
  
  // 圖片優化設置
  optimization: {
    formats: ['webp', 'jpeg', 'png'],
    quality: {
      webp: 80,
      jpeg: 85,
      png: 9
    },
    compression: {
      webp: true,
      jpeg: true,
      png: true
    }
  }
};

// CDN 服務類
class CDNService {
  constructor() {
    this.initializeCloudinary();
  }

  // 初始化 Cloudinary
  initializeCloudinary() {
    try {
      cloudinary.config(CDN_CONFIG.cloudinary);
      console.log('✅ Cloudinary 配置成功');
    } catch (error) {
      console.error('❌ Cloudinary 配置失敗:', error);
    }
  }

  // 上傳圖片到 Cloudinary
  async uploadToCloudinary(buffer, options = {}) {
    try {
      const uploadOptions = {
        folder: 'pokemon-cards',
        resource_type: 'image',
        transformation: [
          { width: 600, height: 600, crop: 'fill', quality: 'auto' }
        ],
        ...options
      };

      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        ).end(buffer);
      });
    } catch (error) {
      console.error('❌ Cloudinary 上傳失敗:', error);
      throw error;
    }
  }

  // 生成 CDN URL
  generateCDNUrl(publicId, size = 'medium', format = 'webp', provider = 'cloudinary') {
    switch (provider) {
      case 'cloudinary':
        const transformation = CDN_CONFIG.providers.cloudinary.transformations[size];
        return `${CDN_CONFIG.providers.cloudinary.baseUrl}/${CDN_CONFIG.cloudinary.cloud_name}/image/upload/${transformation}/f_${format}/${publicId}`;
      
      case 'aws':
        return `${CDN_CONFIG.providers.aws.baseUrl}/${CDN_CONFIG.providers.aws.bucket}/${size}/${publicId}`;
      
      default:
        return null;
    }
  }

  // 批量上傳到 CDN
  async batchUploadToCDN(files, options = {}) {
    const results = [];
    
    for (const file of files) {
      try {
        const uploadResult = await this.uploadToCloudinary(file.buffer, {
          public_id: file.originalname.replace(/\.[^/.]+$/, ''),
          ...options
        });
        
        results.push({
          originalName: file.originalname,
          cdnUrl: uploadResult.secure_url,
          publicId: uploadResult.public_id,
          size: uploadResult.bytes
        });
      } catch (error) {
        console.error(`CDN 上傳失敗: ${file.originalname}`, error);
        results.push({
          originalName: file.originalname,
          error: error.message
        });
      }
    }
    
    return results;
  }

  // 刪除 CDN 上的圖片
  async deleteFromCDN(publicId) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result.result === 'ok';
    } catch (error) {
      console.error('❌ CDN 刪除失敗:', error);
      return false;
    }
  }

  // 獲取圖片變體 URL
  async getImageVariants(publicId, sizes = ['thumbnail', 'small', 'medium', 'large']) {
    const variants = {};
    
    for (const size of sizes) {
      variants[size] = {
        webp: this.generateCDNUrl(publicId, size, 'webp'),
        jpeg: this.generateCDNUrl(publicId, size, 'jpeg'),
        png: this.generateCDNUrl(publicId, size, 'png')
      };
    }
    
    return variants;
  }

  // 圖片轉換
  async transformImage(publicId, transformations = []) {
    try {
      const result = await cloudinary.url(publicId, {
        transformation: transformations
      });
      return result;
    } catch (error) {
      console.error('❌ 圖片轉換失敗:', error);
      throw error;
    }
  }

  // 獲取圖片信息
  async getImageInfo(publicId) {
    try {
      const result = await cloudinary.api.resource(publicId);
      return {
        width: result.width,
        height: result.height,
        format: result.format,
        size: result.bytes,
        url: result.secure_url
      };
    } catch (error) {
      console.error('❌ 獲取圖片信息失敗:', error);
      return null;
    }
  }
}

module.exports = {
  CDNService,
  CDN_CONFIG
}; 