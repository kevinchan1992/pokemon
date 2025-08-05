import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const TestLanguagePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div style={{ 
      minHeight: '100vh',
      background: '#f5f5f5',
      padding: '2rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      <div style={{
        maxWidth: 800,
        margin: '0 auto',
        background: 'white',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}>
          <h1 style={{ margin: 0, color: '#333' }}>語言測試頁面</h1>
          <LanguageSwitcher />
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h2>當前語言: {t('header.home')}</h2>
          <p>這是一個測試頁面，用來驗證多語言功能是否正常工作。</p>
        </div>

        <div style={{ display: 'grid', gap: '1rem' }}>
          <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
            <h3>標題翻譯測試</h3>
            <p><strong>首頁:</strong> {t('header.home')}</p>
            <p><strong>卡牌系列:</strong> {t('header.sets')}</p>
            <p><strong>價格趨勢:</strong> {t('header.trends')}</p>
            <p><strong>關於:</strong> {t('header.about')}</p>
          </div>

          <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
            <h3>首頁內容翻譯測試</h3>
            <p><strong>英雄標題:</strong> {t('home.hero.title')}</p>
            <p><strong>英雄副標題:</strong> {t('home.hero.subtitle')}</p>
            <p><strong>開始搜尋按鈕:</strong> {t('home.hero.searchButton')}</p>
            <p><strong>了解更多按鈕:</strong> {t('home.hero.learnMoreButton')}</p>
          </div>

          <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
            <h3>統計數據翻譯測試</h3>
            <p><strong>總卡牌數:</strong> {t('home.stats.totalCards')}</p>
            <p><strong>活躍用戶:</strong> {t('home.stats.activeUsers')}</p>
            <p><strong>價格更新:</strong> {t('home.stats.priceUpdates')}</p>
            <p><strong>數據準確度:</strong> {t('home.stats.accuracy')}</p>
          </div>

          <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
            <h3>搜尋功能翻譯測試</h3>
            <p><strong>搜尋標題:</strong> {t('search.title')}</p>
            <p><strong>搜尋描述:</strong> {t('search.description')}</p>
            <p><strong>篩選:</strong> {t('search.filters')}</p>
            <p><strong>重設:</strong> {t('search.reset')}</p>
            <p><strong>搜尋:</strong> {t('search.search')}</p>
          </div>

          <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
            <h3>認證功能翻譯測試</h3>
            <p><strong>登入:</strong> {t('auth.login')}</p>
            <p><strong>註冊:</strong> {t('auth.register')}</p>
            <p><strong>電子郵件:</strong> {t('auth.email')}</p>
            <p><strong>密碼:</strong> {t('auth.password')}</p>
          </div>
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button
            onClick={() => window.history.back()}
            style={{
              padding: '12px 24px',
              background: '#1890ff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            返回
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestLanguagePage; 