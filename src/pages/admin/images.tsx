import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import ImageUpload from '../../components/Image/ImageUpload';
import ResponsiveImage from '../../components/Image/ResponsiveImage';

interface ImageStats {
  totalFiles: number;
  totalSize: number;
  bySize: Record<string, { count: number; size: number }>;
  byFormat: Record<string, { count: number; size: number }>;
}

const ImageManagementPage: React.FC = () => {
  const [stats, setStats] = useState<ImageStats | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchImageStats();
  }, []);

  const fetchImageStats = async () => {
    try {
      const response = await fetch('/api/images/stats');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('獲取圖片統計失敗:', error);
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    setError('');
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('uploadToCDN', 'false');

      const token = localStorage.getItem('token');
      const response = await fetch('/api/images/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setUploadResult(data.data);
        fetchImageStats(); // 刷新統計
      } else {
        setError(data.error || '上傳失敗');
      }
    } catch (error) {
      setError('網絡錯誤');
    } finally {
      setUploading(false);
    }
  };

  const handleCleanup = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/images/cleanup', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        alert('舊圖片清理完成！');
        fetchImageStats();
      } else {
        setError(data.error || '清理失敗');
      }
    } catch (error) {
      setError('網絡錯誤');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <>
      <Head>
        <title>圖片管理 - Pokemon TCG 價格追蹤</title>
        <meta name="description" content="管理系統圖片和 CDN" />
      </Head>

      <div className="image-management-page">
        <div className="container">
          <div className="page-header">
            <h1>圖片管理</h1>
            <button onClick={() => window.history.back()} className="back-btn">
              返回
            </button>
          </div>

          <div className="content-grid">
            {/* 圖片上傳區域 */}
            <div className="upload-section">
              <h2>上傳圖片</h2>
              <ImageUpload
                onUpload={handleImageUpload}
                onError={setError}
                disabled={uploading}
                maxSize={10}
              />
              
              {uploading && (
                <div className="upload-status">
                  <div className="spinner"></div>
                  <p>正在處理圖片...</p>
                </div>
              )}

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              {uploadResult && (
                <div className="upload-result">
                  <h3>上傳結果</h3>
                  <div className="result-grid">
                    {Object.entries(uploadResult.processedImages).map(([size, formats]: [string, any]) => (
                      <div key={size} className="result-item">
                        <h4>{size}</h4>
                        {Object.entries(formats).map(([format, data]: [string, any]) => (
                          <div key={format} className="format-item">
                            <span>{format.toUpperCase()}</span>
                            <span>{formatFileSize(data.size)}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 統計信息 */}
            <div className="stats-section">
              <h2>圖片統計</h2>
              {stats ? (
                <div className="stats-grid">
                  <div className="stat-card">
                    <h3>總文件數</h3>
                    <p className="stat-number">{stats.totalFiles}</p>
                  </div>
                  
                  <div className="stat-card">
                    <h3>總大小</h3>
                    <p className="stat-number">{formatFileSize(stats.totalSize)}</p>
                  </div>

                  <div className="stat-card">
                    <h3>按尺寸分類</h3>
                    <div className="stat-list">
                      {Object.entries(stats.bySize).map(([size, data]) => (
                        <div key={size} className="stat-item">
                          <span>{size}</span>
                          <span>{data.count} 文件 ({formatFileSize(data.size)})</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="stat-card">
                    <h3>按格式分類</h3>
                    <div className="stat-list">
                      {Object.entries(stats.byFormat).map(([format, data]) => (
                        <div key={format} className="stat-item">
                          <span>{format.toUpperCase()}</span>
                          <span>{data.count} 文件 ({formatFileSize(data.size)})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p>載入中...</p>
              )}

              <button onClick={handleCleanup} className="cleanup-btn">
                清理舊圖片
              </button>
            </div>
          </div>
        </div>

        <style jsx>{`
          .image-management-page {
            min-height: 100vh;
            background: #f5f5f5;
            padding: 2rem;
          }

          .container {
            max-width: 1200px;
            margin: 0 auto;
          }

          .page-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
          }

          .page-header h1 {
            color: #333;
            margin: 0;
          }

          .back-btn {
            padding: 0.5rem 1rem;
            background: #6c757d;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }

          .content-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
          }

          .upload-section, .stats-section {
            background: white;
            border-radius: 8px;
            padding: 2rem;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }

          h2 {
            margin-top: 0;
            margin-bottom: 1.5rem;
            color: #333;
          }

          .upload-status {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-top: 1rem;
            padding: 1rem;
            background: #e3f2fd;
            border-radius: 4px;
          }

          .spinner {
            border: 2px solid #f3f3f3;
            border-top: 2px solid #007bff;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          .error-message {
            background: #f8d7da;
            color: #721c24;
            padding: 0.75rem;
            border-radius: 4px;
            margin-top: 1rem;
          }

          .upload-result {
            margin-top: 2rem;
            padding: 1rem;
            background: #f8f9fa;
            border-radius: 4px;
          }

          .result-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-top: 1rem;
          }

          .result-item {
            background: white;
            padding: 1rem;
            border-radius: 4px;
            border: 1px solid #dee2e6;
          }

          .result-item h4 {
            margin: 0 0 0.5rem 0;
            color: #333;
          }

          .format-item {
            display: flex;
            justify-content: space-between;
            padding: 0.25rem 0;
            font-size: 0.9rem;
          }

          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
          }

          .stat-card {
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 4px;
            border: 1px solid #dee2e6;
          }

          .stat-card h3 {
            margin: 0 0 0.5rem 0;
            color: #333;
            font-size: 1rem;
          }

          .stat-number {
            font-size: 1.5rem;
            font-weight: bold;
            color: #007bff;
            margin: 0;
          }

          .stat-list {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }

          .stat-item {
            display: flex;
            justify-content: space-between;
            font-size: 0.9rem;
          }

          .cleanup-btn {
            width: 100%;
            padding: 0.75rem;
            background: #dc3545;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 1rem;
          }

          .cleanup-btn:hover {
            background: #c82333;
          }

          @media (max-width: 768px) {
            .content-grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default ImageManagementPage; 