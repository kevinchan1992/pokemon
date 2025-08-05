import React from 'react';
import { Layout as AntLayout } from 'antd';
import Header from './Header';
import Footer from './Footer';

const { Content } = AntLayout;

interface LayoutProps {
  children: React.ReactNode;
  onSearch?: (query: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onSearch }) => {
  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Header onSearch={onSearch} />
      <Content style={{ 
        background: '#f5f5f5',
        padding: '24px 0',
        minHeight: 'calc(100vh - 64px - 200px)', // 減去 header 和 footer 高度
      }}>
        <div style={{ 
          maxWidth: 1200, 
          margin: '0 auto', 
          padding: '0 24px',
        }}>
          {children}
        </div>
      </Content>
      <Footer />
    </AntLayout>
  );
};

export default Layout; 