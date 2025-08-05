import React, { useState, useEffect } from 'react';
import Head from 'next/head';

interface CrawlerStats {
  totalCards: number;
  totalPrices: number;
  errors: number;
  isRunning: boolean;
  startTime: string | null;
  endTime: string | null;
  duration: number;
}

const CrawlerManagementPage: React.FC = () => {
  const [stats, setStats] = useState<CrawlerStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCrawlerStats();
    const interval = setInterval(fetchCrawlerStats, 5000); // 每5秒更新一次
    return () => clearInterval(interval);
  }, []);

  const fetchCrawlerStats = async () => {
    try {
      const response = await fetch('/api/pokemon-crawler/stats');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('獲取爬蟲統計失敗:', error);
    }
  };

  const startCrawler = async () => {
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/pokemon-crawler/start', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setMessage('爬蟲已啟動！正在從 PriceCharting 和 SNKRDUNK 獲取 Pokemon 卡牌數據...');
        fetchCrawlerStats();
      } else {
        setMessage(data.error || '啟動爬蟲失敗');
      }
    } catch (error) {
      setMessage('網絡錯誤');
    } finally {
      setLoading(false);
    }
  };

  const stopCrawler = async () => {
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/pokemon-crawler/stop', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setMessage('爬蟲已停止');
        fetchCrawlerStats();
      } else {
        setMessage(data.error || '停止爬蟲失敗');
      }
    } catch (error) {
      setMessage('網絡錯誤');
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}小時 ${minutes}分鐘 ${secs}秒`;
    } else if (minutes > 0) {
      return `${minutes}分鐘 ${secs}秒`;
    } else {
      return `${secs}秒`;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '未開始';
    return new Date(dateString).toLocaleString('zh-TW');
  };

  return (
    <>
      <Head>
        <title>爬蟲管理 - Pokemon TCG 價格追蹤</title>
        <meta name="description" content="管理 Pokemon TCG 數據爬蟲" />
      </Head>

      <div className="crawler-management-page">
        <div className="container">
          <div className="page-header">
            <h1>Pokemon TCG 爬蟲管理</h1>
            <button onClick={() => window.history.back()} className="back-btn">
              返回
            </button>
          </div>

          <div className="content-grid">
            {/* 爬蟲控制 */}
            <div className="control-section">
              <h2>爬蟲控制</h2>
              <div className="control-buttons">
                <button
                  onClick={startCrawler}
                  disabled={loading || (stats?.isRunning || false)}
                  className="start-btn"
                >
                  {loading ? '啟動中...' : '啟動爬蟲'}
                </button>
                
                <button
                  onClick={stopCrawler}
                  disabled={loading || !(stats?.isRunning || false)}
                  className="stop-btn"
                >
                  {loading ? '停止中...' : '停止爬蟲'}
                </button>
              </div>

              {message && (
                <div className={`message ${message.includes('錯誤') ? 'error' : 'success'}`}>
                  {message}
                </div>
              )}

              <div className="info-box">
                <h3>爬蟲功能說明</h3>
                <ul>
                  <li><strong>PriceCharting.com</strong> - 獲取國際 Pokemon 卡牌價格</li>
                  <li><strong>SNKRDUNK.com</strong> - 獲取日本市場 Pokemon 卡牌價格</li>
                  <li><strong>Pokemon API</strong> - 獲取官方卡牌數據</li>
                  <li>自動處理和標準化卡牌數據</li>
                  <li>保存到本地數據庫</li>
                </ul>
              </div>
            </div>

            {/* 爬蟲統計 */}
            <div className="stats-section">
              <h2>爬蟲統計</h2>
              {stats ? (
                <div className="stats-grid">
                  <div className="stat-card">
                    <h3>運行狀態</h3>
                    <p className={`status ${stats.isRunning ? 'running' : 'stopped'}`}>
                      {stats.isRunning ? '運行中' : '已停止'}
                    </p>
                  </div>

                  <div className="stat-card">
                    <h3>總卡牌數</h3>
                    <p className="stat-number">{stats.totalCards}</p>
                  </div>

                  <div className="stat-card">
                    <h3>總價格數</h3>
                    <p className="stat-number">{stats.totalPrices}</p>
                  </div>

                  <div className="stat-card">
                    <h3>錯誤數</h3>
                    <p className="stat-number error">{stats.errors}</p>
                  </div>

                  <div className="stat-card">
                    <h3>開始時間</h3>
                    <p className="stat-text">{formatDate(stats.startTime)}</p>
                  </div>

                  <div className="stat-card">
                    <h3>結束時間</h3>
                    <p className="stat-text">{formatDate(stats.endTime)}</p>
                  </div>

                  <div className="stat-card">
                    <h3>運行時間</h3>
                    <p className="stat-text">{formatDuration(stats.duration)}</p>
                  </div>
                </div>
              ) : (
                <p>載入中...</p>
              )}
            </div>
          </div>

          {/* 數據來源說明 */}
          <div className="sources-section">
            <h2>數據來源</h2>
            <div className="sources-grid">
              <div className="source-card">
                <h3>PriceCharting.com</h3>
                <p>美國最大的遊戲收藏品價格追蹤網站，提供 Pokemon 卡牌的國際市場價格數據。</p>
                <div className="source-features">
                  <span>國際價格</span>
                  <span>歷史數據</span>
                  <span>多種貨幣</span>
                </div>
              </div>

              <div className="source-card">
                <h3>SNKRDUNK.com</h3>
                <p>日本最大的運動鞋和收藏品交易平台，提供日本市場的 Pokemon 卡牌價格。</p>
                <div className="source-features">
                  <span>日本市場</span>
                  <span>即時價格</span>
                  <span>日圓計價</span>
                </div>
              </div>

              <div className="source-card">
                <h3>Pokemon API</h3>
                <p>官方 Pokemon TCG API，提供卡牌的基本信息和官方數據。</p>
                <div className="source-features">
                  <span>官方數據</span>
                  <span>卡牌圖片</span>
                  <span>詳細信息</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .crawler-management-page {
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
            margin-bottom: 2rem;
          }

          .control-section, .stats-section {
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

          .control-buttons {
            display: flex;
            gap: 1rem;
            margin-bottom: 1.5rem;
          }

          .start-btn, .stop-btn {
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 500;
          }

          .start-btn {
            background: #28a745;
            color: white;
          }

          .start-btn:hover:not(:disabled) {
            background: #218838;
          }

          .stop-btn {
            background: #dc3545;
            color: white;
          }

          .stop-btn:hover:not(:disabled) {
            background: #c82333;
          }

          .start-btn:disabled, .stop-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .message {
            padding: 1rem;
            border-radius: 4px;
            margin-bottom: 1rem;
          }

          .message.success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
          }

          .message.error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
          }

          .info-box {
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 4px;
            border: 1px solid #dee2e6;
          }

          .info-box h3 {
            margin-top: 0;
            color: #333;
          }

          .info-box ul {
            margin: 0;
            padding-left: 1.5rem;
          }

          .info-box li {
            margin-bottom: 0.5rem;
            color: #666;
          }

          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
          }

          .stat-card {
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 4px;
            border: 1px solid #dee2e6;
            text-align: center;
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

          .stat-number.error {
            color: #dc3545;
          }

          .stat-text {
            font-size: 0.9rem;
            color: #666;
            margin: 0;
          }

          .status {
            font-weight: bold;
            font-size: 1.1rem;
          }

          .status.running {
            color: #28a745;
          }

          .status.stopped {
            color: #dc3545;
          }

          .sources-section {
            background: white;
            border-radius: 8px;
            padding: 2rem;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }

          .sources-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
          }

          .source-card {
            background: #f8f9fa;
            padding: 1.5rem;
            border-radius: 6px;
            border: 1px solid #dee2e6;
          }

          .source-card h3 {
            margin-top: 0;
            color: #333;
            font-size: 1.2rem;
          }

          .source-card p {
            color: #666;
            line-height: 1.6;
            margin-bottom: 1rem;
          }

          .source-features {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
          }

          .source-features span {
            background: #007bff;
            color: white;
            padding: 0.25rem 0.5rem;
            border-radius: 12px;
            font-size: 0.8rem;
          }

          @media (max-width: 768px) {
            .content-grid {
              grid-template-columns: 1fr;
            }

            .control-buttons {
              flex-direction: column;
            }

            .stats-grid {
              grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            }

            .sources-grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default CrawlerManagementPage; 