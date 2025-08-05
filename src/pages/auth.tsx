import React, { useState } from 'react';
import Head from 'next/head';
import LoginForm from '../components/Auth/LoginForm';
import RegisterForm from '../components/Auth/RegisterForm';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const handleAuthSuccess = () => {
    // 重新加載頁面以更新用戶狀態
    window.location.reload();
  };

  return (
    <>
      <Head>
        <title>{isLogin ? '登錄' : '註冊'} - Pokemon TCG 價格追蹤</title>
        <meta name="description" content="登錄或註冊您的帳號以使用完整功能" />
      </Head>

      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-header">
            <h1>Pokemon TCG 價格追蹤</h1>
            <p>追蹤您最愛的 Pokemon 卡牌價格</p>
          </div>

          {isLogin ? (
            <LoginForm 
              onSuccess={handleAuthSuccess}
              onSwitchToRegister={() => setIsLogin(false)}
            />
          ) : (
            <RegisterForm 
              onSuccess={handleAuthSuccess}
              onSwitchToLogin={() => setIsLogin(true)}
            />
          )}
        </div>

        <style jsx>{`
          .auth-page {
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
          }

          .auth-container {
            width: 100%;
            max-width: 500px;
          }

          .auth-header {
            text-align: center;
            margin-bottom: 2rem;
            color: white;
          }

          .auth-header h1 {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
            font-weight: 700;
          }

          .auth-header p {
            font-size: 1.1rem;
            opacity: 0.9;
          }

          @media (max-width: 768px) {
            .auth-page {
              padding: 1rem;
            }

            .auth-header h1 {
              font-size: 2rem;
            }

            .auth-header p {
              font-size: 1rem;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default AuthPage; 