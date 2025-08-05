import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { searchCards } from '@/utils/api';
import { Card as CardType, SearchResult } from '@/types';
import { useTranslation } from 'react-i18next';

const SearchPage: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState({
    query: '',
    language: undefined,
    set: undefined,
    rarity: undefined,
    condition: undefined,
    cardNumber: undefined,
    minPriceJPY: undefined,
    maxPriceJPY: undefined,
    minPriceUSD: undefined,
    maxPriceUSD: undefined,
    sortBy: 'relevance',
    page: 1,
    pageSize: 20,
  });

  useEffect(() => {
    // 從 URL 參數初始化搜索條件
    const { q, ...params } = router.query;
    if (q) {
      setSearchParams(prev => ({
        ...prev,
        query: q as string,
        ...params,
      }));
    }
  }, [router.query]);

  useEffect(() => {
    // 當搜索參數改變時執行搜索
    if (searchParams.query || Object.values(searchParams).some(val => val && val !== 'relevance' && val !== 1 && val !== 20)) {
      performSearch();
    }
  }, [searchParams]);

  const performSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      // 過濾掉空值
      const params = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => 
          value !== undefined && value !== '' && value !== null
        )
      );

      const results = await searchCards(params);
      setSearchResults(results);
    } catch (err) {
      console.error('Search failed:', err);
      setError(t('search.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (values: any) => {
    setSearchParams(prev => ({
      ...prev,
      ...values,
      page: 1, // 重置到第一頁
    }));

    // 更新 URL
    const queryParams = new URLSearchParams();
    Object.entries({ ...searchParams, ...values, page: 1 }).forEach(([key, value]) => {
      if (value && value !== 'relevance' && value !== 1 && value !== 20) {
        queryParams.append(key, value.toString());
      }
    });

    router.push(`/search?${queryParams.toString()}`, undefined, { shallow: true });
  };

  const handleReset = () => {
    setSearchParams({
      query: '',
      language: undefined,
      set: undefined,
      rarity: undefined,
      condition: undefined,
      cardNumber: undefined,
      minPriceJPY: undefined,
      maxPriceJPY: undefined,
      minPriceUSD: undefined,
      maxPriceUSD: undefined,
      sortBy: 'relevance',
      page: 1,
      pageSize: 20,
    });
    setSearchResults(null);
    router.push('/search', undefined, { shallow: true });
  };

  const handlePageChange = (page: number, pageSize?: number) => {
    setSearchParams(prev => ({
      ...prev,
      page,
      pageSize: pageSize || prev.pageSize,
    }));

    // 更新 URL
    const queryParams = new URLSearchParams();
    Object.entries({ ...searchParams, page, pageSize: pageSize || searchParams.pageSize }).forEach(([key, value]) => {
      if (value && value !== 'relevance') {
        queryParams.append(key, value.toString());
      }
    });

    router.push(`/search?${queryParams.toString()}`, undefined, { shallow: true });
  };

  const handleFavoriteToggle = (cardId: string) => {
    // TODO: 實現收藏功能
    console.log('Toggle favorite for card:', cardId);
  };

  const handleViewDetails = (cardId: string) => {
    router.push(`/card/${cardId}`);
  };

  const handleSetAlert = (cardId: string) => {
    // TODO: 實現價格警報功能
    console.log('Set alert for card:', cardId);
  };

  const renderSearchResults = () => {
    if (loading) {
      return (
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
          <div style={{ marginTop: '16px' }}>Searching...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div style={{
          background: '#fff2f0',
          border: '1px solid #ffccc7',
          borderRadius: '6px',
          padding: '16px',
          marginBottom: '24px',
        }}>
          <div style={{ color: '#cf1322', fontWeight: '500', marginBottom: '8px' }}>
            Search Error
          </div>
          <div style={{ color: '#666' }}>{error}</div>
        </div>
      );
    }

    if (!searchResults || searchResults.cards.length === 0) {
      return (
        <div style={{
          textAlign: 'center',
          padding: '48px',
          background: 'white',
          borderRadius: '12px',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
          <h3 style={{ marginBottom: '8px' }}>No cards found</h3>
          <p style={{ color: '#666' }}>Try adjusting your search criteria</p>
        </div>
      );
    }

    return (
      <>
        {/* Search Results Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '24px',
          padding: '16px',
          background: '#f8f9fa',
          borderRadius: '8px',
        }}>
          <div>
            <span style={{ fontWeight: '500' }}>
              Found {searchResults.total} cards
            </span>
            {searchParams.query && (
              <span style={{ marginLeft: '8px', color: '#666' }}>
                for: "{searchParams.query}"
              </span>
            )}
          </div>
          <div>
            <span style={{ color: '#666' }}>
              Showing {((searchParams.page - 1) * searchParams.pageSize) + 1} - {Math.min(searchParams.page * searchParams.pageSize, searchResults.total)} of {searchResults.total}
            </span>
          </div>
        </div>

        {/* Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
        }}>
          {searchResults.cards.map((card) => (
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
              onClick={() => handleViewDetails(card.id)}
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

        {/* Pagination */}
        {searchResults.total > searchParams.pageSize && (
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center' }}>
              <button
                onClick={() => handlePageChange(searchParams.page - 1)}
                disabled={searchParams.page === 1}
                style={{
                  padding: '8px 12px',
                  background: searchParams.page === 1 ? '#f5f5f5' : '#1890ff',
                  color: searchParams.page === 1 ? '#ccc' : 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: searchParams.page === 1 ? 'not-allowed' : 'pointer',
                }}
              >
                Previous
              </button>
              <span style={{ padding: '8px 12px' }}>
                Page {searchParams.page} of {Math.ceil(searchResults.total / searchParams.pageSize)}
              </span>
              <button
                onClick={() => handlePageChange(searchParams.page + 1)}
                disabled={searchParams.page >= Math.ceil(searchResults.total / searchParams.pageSize)}
                style={{
                  padding: '8px 12px',
                  background: searchParams.page >= Math.ceil(searchResults.total / searchParams.pageSize) ? '#f5f5f5' : '#1890ff',
                  color: searchParams.page >= Math.ceil(searchResults.total / searchParams.pageSize) ? '#ccc' : 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: searchParams.page >= Math.ceil(searchResults.total / searchParams.pageSize) ? 'not-allowed' : 'pointer',
                }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </>
    );
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
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Search Pokemon Cards</h1>
          <p style={{ color: '#666' }}>Find cards by name, set, rarity, and more. Get real-time price data from Japanese and international markets.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '24px' }}>
          {/* Filters Sidebar */}
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', height: 'fit-content' }}>
            <h3 style={{ marginBottom: '16px' }}>Filters</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Card Name</label>
                <input
                  type="text"
                  placeholder="Enter card name..."
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Language</label>
                <select style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d9d9d9',
                  borderRadius: '4px',
                }}>
                  <option value="">All Languages</option>
                  <option value="jp">Japanese</option>
                  <option value="en">English</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Rarity</label>
                <select style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d9d9d9',
                  borderRadius: '4px',
                }}>
                  <option value="">All Rarities</option>
                  <option value="Common">Common</option>
                  <option value="Uncommon">Uncommon</option>
                  <option value="Rare">Rare</option>
                  <option value="Rare Holo">Rare Holo</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handleReset}
                  style={{
                    flex: 1,
                    padding: '8px 16px',
                    background: '#f5f5f5',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Reset
                </button>
                <button
                  onClick={() => handleSearch('')}
                  style={{
                    flex: 1,
                    padding: '8px 16px',
                    background: '#1890ff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Search Results */}
          <div>
            {renderSearchResults()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SearchPage; 