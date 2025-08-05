import React from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

const AboutPage: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div style={{ 
      minHeight: '100vh',
      background: '#f5f5f5',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      {/* Header */}
      <header style={{
        background: '#fff',
        padding: '16px 24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#1890ff',
            cursor: 'pointer',
          }} onClick={() => router.push('/')}>
            <span style={{ marginRight: '8px' }}>🎴</span>
            寶可夢 TCG 追蹤器
          </div>
          
          <nav style={{ display: 'flex', gap: '24px' }}>
            <a href="/" style={{ color: '#666', textDecoration: 'none' }}>{t('header.home')}</a>
            <a href="/search" style={{ color: '#666', textDecoration: 'none' }}>搜尋</a>
            <a href="/sets" style={{ color: '#666', textDecoration: 'none' }}>{t('header.sets')}</a>
            <a href="/trends" style={{ color: '#666', textDecoration: 'none' }}>{t('header.trends')}</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '48px', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '48px', marginBottom: '24px', textAlign: 'center' }}>
            關於寶可夢 TCG 追蹤器
          </h1>
          
          <div style={{ maxWidth: '800px', margin: '0 auto', lineHeight: '1.8' }}>
            <p style={{ fontSize: '18px', marginBottom: '24px', color: '#666' }}>
              寶可夢 TCG 追蹤器是追蹤寶可夢集換式卡牌遊戲價格的終極平台，
              提供來自日本和國際市場的數據。我們的使命是為收藏家、交易者和愛好者
              提供準確的即時價格數據，以做出明智的決策。
            </p>

            <h2 style={{ fontSize: '32px', marginBottom: '16px', marginTop: '48px' }}>我們的特色</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '48px' }}>
              <div style={{ background: '#f8f9fa', padding: '24px', borderRadius: '8px' }}>
                <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>🔍 進階搜尋</h3>
                <p style={{ color: '#666' }}>
                  按名稱、系列、稀有度等搜尋卡牌。我們強大的搜尋引擎支援
                  日文和英文卡牌名稱。
                </p>
              </div>
              
              <div style={{ background: '#f8f9fa', padding: '24px', borderRadius: '8px' }}>
                <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>📊 價格追蹤</h3>
                <p style={{ color: '#666' }}>
                  透過詳細圖表和來自多個市場來源的歷史數據
                  追蹤價格變動。
                </p>
              </div>
              
              <div style={{ background: '#f8f9fa', padding: '24px', borderRadius: '8px' }}>
                <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>🔔 價格警報</h3>
                <p style={{ color: '#666' }}>
                  設定價格警報並在達到目標價格時收到通知。永遠不會錯過
                  完美的買賣機會。
                </p>
              </div>
              
              <div style={{ background: '#f8f9fa', padding: '24px', borderRadius: '8px' }}>
                <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>💾 收藏</h3>
                <p style={{ color: '#666' }}>
                  將您最愛的卡牌儲存到個人收藏中，以便快速存取和
                  輕鬆追蹤。
                </p>
              </div>
            </div>

            <h2 style={{ fontSize: '32px', marginBottom: '16px' }}>Data Sources</h2>
            <p style={{ fontSize: '16px', marginBottom: '24px', color: '#666' }}>
              We aggregate price data from multiple sources including:
            </p>
            <ul style={{ fontSize: '16px', marginBottom: '24px', color: '#666', paddingLeft: '24px' }}>
              <li>Japanese marketplaces (Mercari, Yahoo Auctions, Rakuten)</li>
              <li>International platforms (eBay, TCGplayer, TrollandToad)</li>
              <li>Official Pokemon TCG databases</li>
              <li>Community-driven price tracking</li>
            </ul>

            <h2 style={{ fontSize: '32px', marginBottom: '16px', marginTop: '48px' }}>Technology Stack</h2>
            <p style={{ fontSize: '16px', marginBottom: '24px', color: '#666' }}>
              Built with modern technologies for optimal performance and user experience:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '48px' }}>
              <div style={{ background: '#e6f7ff', padding: '16px', borderRadius: '6px', textAlign: 'center' }}>
                <strong>Frontend</strong><br />
                Next.js, React, TypeScript
              </div>
              <div style={{ background: '#f6ffed', padding: '16px', borderRadius: '6px', textAlign: 'center' }}>
                <strong>Backend</strong><br />
                Node.js, Express
              </div>
              <div style={{ background: '#fff7e6', padding: '16px', borderRadius: '6px', textAlign: 'center' }}>
                <strong>Database</strong><br />
                PostgreSQL, Redis
              </div>
              <div style={{ background: '#fff1f0', padding: '16px', borderRadius: '6px', textAlign: 'center' }}>
                <strong>Search</strong><br />
                Elasticsearch
              </div>
            </div>

            <h2 style={{ fontSize: '32px', marginBottom: '16px' }}>Disclaimer</h2>
            <p style={{ fontSize: '16px', marginBottom: '24px', color: '#666' }}>
              Pokemon TCG Tracker is not affiliated with The Pokemon Company, Nintendo, or any 
              official Pokemon entities. All prices are for reference only and may not reflect 
              actual market conditions. Users should conduct their own research before making 
              purchasing decisions.
            </p>

            <div style={{ textAlign: 'center', marginTop: '48px' }}>
              <button
                onClick={() => router.push('/search')}
                style={{
                  padding: '16px 32px',
                  background: '#1890ff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '18px',
                  cursor: 'pointer',
                  marginRight: '16px',
                }}
              >
                Start Searching
              </button>
              <button
                onClick={() => router.push('/')}
                style={{
                  padding: '16px 32px',
                  background: 'white',
                  color: '#1890ff',
                  border: '1px solid #1890ff',
                  borderRadius: '8px',
                  fontSize: '18px',
                  cursor: 'pointer',
                }}
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AboutPage; 