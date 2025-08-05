import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getCardDetails, getCardPrices } from '@/utils/api';
import { Card as CardType, PriceData } from '@/types';

const CardDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [card, setCard] = useState<CardType | null>(null);
  const [prices, setPrices] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchCardData();
    }
  }, [id]);

  const fetchCardData = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const [cardData, priceData] = await Promise.all([
        getCardDetails(id as string),
        getCardPrices(id as string)
      ]);
      
      setCard(cardData);
      setPrices(priceData);
    } catch (err) {
      console.error('Failed to fetch card data:', err);
      setError('Failed to load card details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: '#f5f5f5',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}>
        <header style={{
          background: '#fff',
          padding: '16px 24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          <div style={{
            maxWidth: 1200,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
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
          </div>
        </header>
        
        <main style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
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
            <p style={{ marginTop: '16px', color: '#666' }}>Loading card details...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !card) {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: '#f5f5f5',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}>
        <header style={{
          background: '#fff',
          padding: '16px 24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          <div style={{
            maxWidth: 1200,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
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
          </div>
        </header>
        
        <main style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
          <div style={{ textAlign: 'center', padding: '48px' }}>
            <h1 style={{ fontSize: '48px', marginBottom: '16px', color: '#ff4d4f' }}>404</h1>
            <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#666' }}>
              Card not found
            </h2>
            <p style={{ fontSize: '16px', marginBottom: '32px', color: '#999' }}>
              The card you're looking for doesn't exist or has been removed.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button
                onClick={() => router.push('/')}
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
                Go Home
              </button>
              <button
                onClick={() => router.back()}
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
                Go Back
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
          {/* Card Image */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
            <div style={{
              height: '400px',
              background: '#f0f0f0',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '120px',
              marginBottom: '16px',
            }}>
              🎴
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <button
                style={{
                  padding: '8px 16px',
                  background: '#1890ff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Add to Favorites
              </button>
              <button
                style={{
                  padding: '8px 16px',
                  background: '#52c41a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Set Price Alert
              </button>
            </div>
          </div>

          {/* Card Details */}
          <div>
            <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>{card.jpName}</h1>
            <p style={{ fontSize: '18px', color: '#666', marginBottom: '24px' }}>{card.enName}</p>
            
            <div style={{ background: 'white', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
              <h3 style={{ marginBottom: '16px' }}>Card Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <strong>Card Number:</strong> {card.cardNumber}
                </div>
                <div>
                  <strong>Rarity:</strong> {card.rarity}
                </div>
                <div>
                  <strong>Set:</strong> {card.set}
                </div>
                <div>
                  <strong>Language:</strong> {card.language === 'jp' ? 'Japanese' : 'English'}
                </div>
                <div>
                  <strong>Release Date:</strong> {new Date(card.releaseDate).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Price Information */}
            <div style={{ background: 'white', borderRadius: '12px', padding: '24px' }}>
              <h3 style={{ marginBottom: '16px' }}>Price Information</h3>
              {prices.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <strong>Current Price (JPY):</strong> ¥{prices[0]?.priceJPY?.toLocaleString()}
                  </div>
                  <div>
                    <strong>Current Price (USD):</strong> ${prices[0]?.priceUSD?.toLocaleString()}
                  </div>
                  <div>
                    <strong>Price Trend:</strong> {prices[0]?.trend || 'Stable'}
                  </div>
                  <div>
                    <strong>Last Updated:</strong> {new Date(prices[0]?.timestamp || Date.now()).toLocaleString()}
                  </div>
                </div>
              ) : (
                <p style={{ color: '#666' }}>No price data available</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CardDetailPage; 