import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getPopularCards } from '@/utils/api';
import { Card as CardType } from '@/types';
import { useTranslation } from 'react-i18next';
import { POPULAR_SEARCHES } from '@/utils/constants';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const [popularCards, setPopularCards] = useState<CardType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularCards = async () => {
      try {
        const cards = await getPopularCards(8);
        setPopularCards(cards);
      } catch (error) {
        console.error('Failed to fetch popular cards:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularCards();
  }, []);

  const handleSearch = (query: string) => {
    // 導航到搜索頁面
    window.location.href = `/search?q=${encodeURIComponent(query)}`;
  };

  const carouselItems = [
    {
      title: t('home.carousel.title1'),
      description: t('home.carousel.description1'),
      image: '/images/carousel1.jpg',
      link: '/sets',
    },
    {
      title: t('home.carousel.title2'),
      description: t('home.carousel.description2'),
      image: '/images/carousel2.jpg',
      link: '/trends',
    },
    {
      title: t('home.carousel.title3'),
      description: t('home.carousel.description3'),
      image: '/images/carousel3.jpg',
      link: '/search',
    },
  ];

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
          
          <div style={{ flex: 1, maxWidth: 500, margin: '0 48px' }}>
            <input
              type="text"
              placeholder={t('header.searchPlaceholder')}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                fontSize: '16px',
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch((e.target as HTMLInputElement).value);
                }
              }}
            />
          </div>
          
          <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <a href="/" style={{ color: '#666', textDecoration: 'none' }}>{t('header.home')}</a>
            <a href="/search" style={{ color: '#666', textDecoration: 'none' }}>搜尋</a>
            <a href="/sets" style={{ color: '#666', textDecoration: 'none' }}>{t('header.sets')}</a>
            <a href="/trends" style={{ color: '#666', textDecoration: 'none' }}>{t('header.trends')}</a>
            <LanguageSwitcher />
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
        {/* Hero Section */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '16px',
          padding: '48px 24px',
          marginBottom: '48px',
          color: 'white',
          textAlign: 'center',
        }}>
          <h1 style={{ fontSize: '48px', marginBottom: '16px', margin: 0 }}>
            {t('home.hero.title')}
          </h1>
          <p style={{ fontSize: '18px', marginBottom: '32px', opacity: 0.9 }}>
            {t('home.hero.subtitle')}
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button
              onClick={() => router.push('/search')}
              style={{
                padding: '12px 24px',
                background: '#1890ff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                cursor: 'pointer',
              }}
            >
              {t('home.hero.searchButton')}
            </button>
            <button
              onClick={() => router.push('/about')}
              style={{
                padding: '12px 24px',
                background: 'transparent',
                color: 'white',
                border: '1px solid white',
                borderRadius: '6px',
                fontSize: '16px',
                cursor: 'pointer',
              }}
            >
              {t('home.hero.learnMoreButton')}
            </button>
          </div>
        </div>

              {/* Statistics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '24px',
          marginBottom: '48px',
        }}>
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1890ff' }}>125,000</div>
            <div style={{ color: '#666' }}>{t('home.stats.totalCards')}</div>
          </div>
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#52c41a' }}>15,000</div>
            <div style={{ color: '#666' }}>{t('home.stats.activeUsers')}</div>
          </div>
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#faad14' }}>5,000</div>
            <div style={{ color: '#666' }}>{t('home.stats.priceUpdates')}</div>
          </div>
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f5222d' }}>98.5%</div>
            <div style={{ color: '#666' }}>{t('home.stats.accuracy')}</div>
          </div>
        </div>

              {/* Popular Searches */}
        <div style={{ marginBottom: '48px' }}>
          <h3 style={{ marginBottom: '24px', fontSize: '24px' }}>
            {t('home.popularSearches')}
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {POPULAR_SEARCHES.map((search, index) => (
              <span
                key={index}
                style={{ 
                  cursor: 'pointer',
                  padding: '8px 16px',
                  fontSize: '14px',
                  borderRadius: '20px',
                  background: '#1890ff',
                  color: 'white',
                }}
                onClick={() => handleSearch(search)}
              >
                {search}
              </span>
            ))}
          </div>
        </div>

        {/* Popular Cards */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ margin: 0, fontSize: '24px' }}>{t('home.popularCards')}</h3>
            <button
              onClick={() => router.push('/trends')}
              style={{
                background: 'none',
                border: 'none',
                color: '#1890ff',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              View All →
            </button>
          </div>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '48px' }}>
              <div style={{
                display: 'inline-block',
                width: '40px',
                height: '40px',
                border: '4px solid #f3f3f3',
                borderTop: '4px solid #1890ff',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}></div>
              <p style={{ marginTop: '16px', color: '#666' }}>Loading...</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '24px',
            }}>
              {popularCards.map((card) => (
                <div
                  key={card.id}
                  style={{
                    background: 'white',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  onClick={() => router.push(`/card/${card.id}`)}
                >
                  <div style={{
                    height: '200px',
                    background: '#f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '48px',
                  }}>
                    🎴
                  </div>
                  <div style={{ padding: '16px' }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>
                      {card.jpName}
                    </h3>
                    <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>
                      {card.enName}
                    </p>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                      <span style={{ fontSize: '12px', color: '#666' }}>
                        {card.cardNumber}
                      </span>
                      <span style={{
                        background: '#1890ff',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                      }}>
                        {card.rarity}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Features */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '48px',
        }}>
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <h3 style={{ marginBottom: '16px' }}>Advanced Search</h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>
              Search cards by name, set, rarity, and more with our powerful search engine.
            </p>
          </div>
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
            <h3 style={{ marginBottom: '16px' }}>Price Tracking</h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>
              Track price movements and get notified when prices change.
            </p>
          </div>
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔔</div>
            <h3 style={{ marginBottom: '16px' }}>Price Alerts</h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>
              Set price alerts and get notified when your target price is reached.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div style={{
          background: '#f0f2f5',
          borderRadius: '16px',
          padding: '48px 24px',
          textAlign: 'center',
        }}>
          <h2 style={{ marginBottom: '16px', fontSize: '32px' }}>Ready to Start?</h2>
          <p style={{ fontSize: '16px', marginBottom: '32px', color: '#666' }}>
            Join thousands of Pokemon TCG enthusiasts who trust our platform for accurate price data.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button
              onClick={() => router.push('/search')}
              style={{
                padding: '12px 24px',
                background: '#1890ff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                cursor: 'pointer',
              }}
            >
              Start Searching
            </button>
            <button
              onClick={() => router.push('/about')}
              style={{
                padding: '12px 24px',
                background: 'white',
                color: '#1890ff',
                border: '1px solid #1890ff',
                borderRadius: '6px',
                fontSize: '16px',
                cursor: 'pointer',
              }}
            >
              Learn More
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        background: '#001529',
        color: 'white',
        padding: '48px 24px 24px',
        marginTop: '48px',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
            marginBottom: '32px',
          }}>
            <div>
              <h4 style={{ marginBottom: '16px' }}>🎴 Pokemon TCG Tracker</h4>
              <p style={{ color: '#ccc', fontSize: '14px' }}>
                The ultimate Pokemon TCG price tracking platform with real-time market data from Japan and international markets.
              </p>
            </div>
            <div>
              <h5 style={{ marginBottom: '16px' }}>Quick Links</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <a href="/" style={{ color: '#ccc', textDecoration: 'none' }}>Home</a>
                <a href="/search" style={{ color: '#ccc', textDecoration: 'none' }}>Search</a>
                <a href="/sets" style={{ color: '#ccc', textDecoration: 'none' }}>Sets</a>
                <a href="/trends" style={{ color: '#ccc', textDecoration: 'none' }}>Trends</a>
              </div>
            </div>
            <div>
              <h5 style={{ marginBottom: '16px' }}>Features</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <a href="/search" style={{ color: '#ccc', textDecoration: 'none' }}>Card Search</a>
                <a href="/price-tracking" style={{ color: '#ccc', textDecoration: 'none' }}>Price Tracking</a>
                <a href="/favorites" style={{ color: '#ccc', textDecoration: 'none' }}>Favorites</a>
                <a href="/alerts" style={{ color: '#ccc', textDecoration: 'none' }}>Price Alerts</a>
              </div>
            </div>
            <div>
              <h5 style={{ marginBottom: '16px' }}>Support</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <a href="/help" style={{ color: '#ccc', textDecoration: 'none' }}>Help</a>
                <a href="/contact" style={{ color: '#ccc', textDecoration: 'none' }}>Contact</a>
                <a href="/privacy" style={{ color: '#ccc', textDecoration: 'none' }}>Privacy</a>
                <a href="/terms" style={{ color: '#ccc', textDecoration: 'none' }}>Terms</a>
              </div>
            </div>
          </div>
          <div style={{
            borderTop: '1px solid #303030',
            paddingTop: '16px',
            textAlign: 'center',
            color: '#ccc',
            fontSize: '14px',
          }}>
            © 2025 Pokemon TCG Tracker. All rights reserved. Prices are for reference only. Not affiliated with The Pokemon Company.
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default HomePage; 