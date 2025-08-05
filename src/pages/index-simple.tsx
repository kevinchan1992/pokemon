import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getPopularCards } from '@/utils/api';
import { Card as CardType } from '@/types';

const HomePage: React.FC = () => {
  const router = useRouter();
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
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

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
            Pokemon TCG Tracker
          </div>
          
          <div style={{ flex: 1, maxWidth: 500, margin: '0 48px' }}>
            <input
              type="text"
              placeholder="Search Pokemon cards..."
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
          
          <nav style={{ display: 'flex', gap: '24px' }}>
            <a href="/" style={{ color: '#666', textDecoration: 'none' }}>Home</a>
            <a href="/search" style={{ color: '#666', textDecoration: 'none' }}>Search</a>
            <a href="/sets" style={{ color: '#666', textDecoration: 'none' }}>Sets</a>
            <a href="/trends" style={{ color: '#666', textDecoration: 'none' }}>Trends</a>
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
            Track Pokemon TCG Prices
          </h1>
          <p style={{ fontSize: '18px', marginBottom: '32px', opacity: 0.9 }}>
            Get real-time price data from Japanese and international markets. Find the best deals and track price trends.
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
                background: 'transparent',
                color: 'white',
                border: '1px solid white',
                borderRadius: '6px',
                fontSize: '16px',
                cursor: 'pointer',
              }}
            >
              Learn More
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
            <div style={{ color: '#666' }}>Total Cards</div>
          </div>
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#52c41a' }}>15,000</div>
            <div style={{ color: '#666' }}>Active Users</div>
          </div>
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#faad14' }}>5,000</div>
            <div style={{ color: '#666' }}>Price Updates/day</div>
          </div>
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f5222d' }}>98.5%</div>
            <div style={{ color: '#666' }}>Data Accuracy</div>
          </div>
        </div>

        {/* Popular Cards */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
          }}>
            <h2 style={{ margin: 0, fontSize: '32px' }}>Popular Cards</h2>
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