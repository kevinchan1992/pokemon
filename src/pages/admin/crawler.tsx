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

interface UnifiedCrawlerStats {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  successRate: string;
  isRunning: boolean;
  lastRun: string | null;
  sources: {
    pricecharting: { success: number; failed: number };
    snkrdunk: { success: number; failed: number };
    mercari: { success: number; failed: number };
  };
}

const CrawlerManagementPage: React.FC = () => {
  const [stats, setStats] = useState<CrawlerStats | null>(null);
  const [unifiedStats, setUnifiedStats] = useState<UnifiedCrawlerStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCrawlerStats();
    fetchUnifiedCrawlerStats();
    const interval = setInterval(() => {
      fetchCrawlerStats();
      fetchUnifiedCrawlerStats();
    }, 5000); // 每5秒更新一次
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

  const fetchUnifiedCrawlerStats = async () => {
    try {
      const response = await fetch('/api/unified-crawler/stats');
      const data = await response.json();
      
      if (data.success) {
        setUnifiedStats(data.data);
      }
    } catch (error) {
      console.error('獲取統一爬蟲統計失敗:', error);
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

  const startUnifiedCrawler = async () => {
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/unified-crawler/start', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setMessage('統一爬蟲已啟動！正在從 PriceCharting、SNKRDUNK 和 Mercari 獲取真實價格數據...');
        fetchUnifiedCrawlerStats();
      } else {
        setMessage(data.error || '啟動統一爬蟲失敗');
      }
    } catch (error) {
      setMessage('網絡錯誤');
    } finally {
      setLoading(false);
    }
  };

  const runSingleCrawler = async (source: string) => {
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/unified-crawler/single/${source}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setMessage(`${source} 爬蟲執行完成！`);
        fetchUnifiedCrawlerStats();
      } else {
        setMessage(data.error || '執行爬蟲失敗');
      }
    } catch (error) {
      setMessage('網絡錯誤');
    } finally {
      setLoading(false);
    }
  };

  const testConnections = async () => {
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/unified-crawler/test', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setMessage('連接測試完成！');
        console.log('連接測試結果:', data.data);
      } else {
        setMessage(data.error || '連接測試失敗');
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
            {/* 統一爬蟲控制 */}
            <div className="control-section">
              <h2>統一爬蟲控制</h2>
              <div className="control-buttons">
                <button
                  onClick={startUnifiedCrawler}
                  disabled={loading || (unifiedStats?.isRunning || false)}
                  className="start-btn"
                >
                  {loading ? '啟動中...' : '啟動統一爬蟲'}
                </button>
                
                <button
                  onClick={testConnections}
                  disabled={loading}
                  className="test-btn"
                >
                  {loading ? '測試中...' : '測試連接'}
                </button>
              </div>

              <div className="single-crawler-buttons">
                <h3>單個爬蟲控制</h3>
                <div className="single-buttons">
                  <button
                    onClick={() => runSingleCrawler('pricecharting')}
                    disabled={loading}
                    className="single-btn pricecharting"
                  >
                    PriceCharting
                  </button>
                  
                  <button
                    onClick={() => runSingleCrawler('snkrdunk')}
                    disabled={loading}
                    className="single-btn snkrdunk"
                  >
                    SNKRDUNK
                  </button>
                  
                  <button
                    onClick={() => runSingleCrawler('mercari')}
                    disabled={loading}
                    className="single-btn mercari"
                  >
                    Mercari
                  </button>
                </div>
              </div>

              {message && (
                <div className={`message ${message.includes('錯誤') ? 'error' : 'success'}`}>
                  {message}
                </div>
              )}

              <div className="info-box">
                <h3>統一爬蟲功能說明</h3>
                <ul>
                  <li><strong>PriceCharting.com</strong> - 美國市場真實價格數據</li>
                  <li><strong>SNKRDUNK.com</strong> - 日本市場真實價格數據</li>
                  <li><strong>Mercari</strong> - 日本二手交易平台價格</li>
                  <li>支援多個經典系列和熱門卡牌</li>
                  <li>自動處理和標準化價格數據</li>
                  <li>實時價格追蹤和歷史數據</li>
                </ul>
              </div>
            </div>

            {/* 統一爬蟲統計 */}
            <div className="stats-section">
              <h2>統一爬蟲統計</h2>
              {unifiedStats ? (
                <div className="stats-grid">
                  <div className="stat-card">
                    <h3>運行狀態</h3>
                    <p className={`status ${unifiedStats.isRunning ? 'running' : 'stopped'}`}>
                      {unifiedStats.isRunning ? '運行中' : '已停止'}
                    </p>
                  </div>

                  <div className="stat-card">
                    <h3>成功率</h3>
                    <p className="stat-number">{unifiedStats.successRate}</p>
                  </div>

                  <div className="stat-card">
                    <h3>總請求數</h3>
                    <p className="stat-number">{unifiedStats.totalRequests}</p>
                  </div>

                  <div className="stat-card">
                    <h3>成功請求</h3>
                    <p className="stat-number success">{unifiedStats.successfulRequests}</p>
                  </div>

                  <div className="stat-card">
                    <h3>失敗請求</h3>
                    <p className="stat-number error">{unifiedStats.failedRequests}</p>
                  </div>

                  <div className="stat-card">
                    <h3>最後運行</h3>
                    <p className="stat-text">{formatDate(unifiedStats.lastRun)}</p>
                  </div>
                </div>

                <div className="sources-stats">
                  <h3>各數據源統計</h3>
                  <div className="sources-stats-grid">
                    <div className="source-stat">
                      <h4>PriceCharting</h4>
                      <p>成功: {unifiedStats.sources.pricecharting.success}</p>
                      <p>失敗: {unifiedStats.sources.pricecharting.failed}</p>
                    </div>
                    
                    <div className="source-stat">
                      <h4>SNKRDUNK</h4>
                      <p>成功: {unifiedStats.sources.snkrdunk.success}</p>
                      <p>失敗: {unifiedStats.sources.snkrdunk.failed}</p>
                    </div>
                    
                    <div className="source-stat">
                      <h4>Mercari</h4>
                      <p>成功: {unifiedStats.sources.mercari.success}</p>
                      <p>失敗: {unifiedStats.sources.mercari.failed}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p>載入中...</p>
              )}
            </div>
          </div>

          {/* 原始爬蟲統計 */}
          <div className="original-crawler-section">
            <h2>原始 Pokemon 爬蟲統計</h2>
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
                <h3>Mercari</h3>
                <p>日本最大的二手交易平台，提供真實的 Pokemon 卡牌交易價格。</p>
                <div className="source-features">
                  <span>二手市場</span>
                  <span>真實交易</span>
                  <span>即時更新</span>
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

          .start-btn, .stop-btn, .test-btn {
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

          .test-btn {
            background: #17a2b8;
            color: white;
          }

          .test-btn:hover:not(:disabled) {
            background: #138496;
          }

          .single-crawler-buttons {
            margin-bottom: 1.5rem;
          }

          .single-crawler-buttons h3 {
            margin-bottom: 1rem;
            color: #333;
          }

          .single-buttons {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
          }

          .single-btn {
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.9rem;
            font-weight: 500;
          }

          .single-btn.pricecharting {
            background: #007bff;
            color: white;
          }

          .single-btn.snkrdunk {
            background: #dc3545;
            color: white;
          }

          .single-btn.mercari {
            background: #ffc107;
            color: #212529;
          }

          .single-btn:hover:not(:disabled) {
            opacity: 0.8;
          }

          .single-btn:disabled {
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
            margin-bottom: 1.5rem;
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

          .stat-number.success {
            color: #28a745;
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

          .sources-stats {
            margin-top: 1.5rem;
          }

          .sources-stats h3 {
            margin-bottom: 1rem;
            color: #333;
          }

          .sources-stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 1rem;
          }

          .source-stat {
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 4px;
            border: 1px solid #dee2e6;
            text-align: center;
          }

          .source-stat h4 {
            margin: 0 0 0.5rem 0;
            color: #333;
          }

          .source-stat p {
            margin: 0.25rem 0;
            font-size: 0.9rem;
            color: #666;
          }

          .original-crawler-section {
            background: white;
            border-radius: 8px;
            padding: 2rem;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            margin-bottom: 2rem;
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

            .single-buttons {
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