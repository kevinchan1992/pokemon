import React from 'react';

interface ResponsiveImageProps {
  imageUrls: string | object;
  alt: string;
  className?: string;
  size?: 'thumbnail' | 'small' | 'medium' | 'large';
  format?: 'webp' | 'jpeg' | 'png';
  loading?: 'lazy' | 'eager';
  fallback?: string;
}

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  imageUrls,
  alt,
  className = '',
  size = 'medium',
  format = 'webp',
  loading = 'lazy',
  fallback = '/images/default-card.png'
}) => {
  // 解析圖片 URLs
  const parseImageUrls = () => {
    if (typeof imageUrls === 'string') {
      try {
        return JSON.parse(imageUrls);
      } catch {
        return null;
      }
    }
    return imageUrls;
  };

  const urls = parseImageUrls();
  
  // 生成 srcset
  const generateSrcset = () => {
    if (!urls) return '';
    
    const srcset = [];
    const sizes = ['thumbnail', 'small', 'medium', 'large'];
    
    for (const sizeName of sizes) {
      if (urls[sizeName] && urls[sizeName][format]) {
        const width = sizeName === 'thumbnail' ? 150 : 
                     sizeName === 'small' ? 300 : 
                     sizeName === 'medium' ? 600 : 1200;
        srcset.push(`${urls[sizeName][format]} ${width}w`);
      }
    }
    
    return srcset.join(', ');
  };

  // 獲取主要圖片 URL
  const getMainSrc = () => {
    if (urls && urls[size] && urls[size][format]) {
      return urls[size][format];
    }
    return fallback;
  };

  // 生成 sizes 屬性
  const getSizes = () => {
    return '(max-width: 768px) 300px, (max-width: 1200px) 600px, 1200px';
  };

  return (
    <img
      src={getMainSrc()}
      alt={alt}
      className={className}
      loading={loading}
      srcSet={generateSrcset()}
      sizes={getSizes()}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.src = fallback;
      }}
    />
  );
};

export default ResponsiveImage; 