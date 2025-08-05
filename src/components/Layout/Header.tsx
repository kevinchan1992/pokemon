import React, { useState } from 'react';
import { Layout, Menu, Button, Input, Avatar, Dropdown, Space, Badge } from 'antd';
import { SearchOutlined, UserOutlined, HeartOutlined, BellOutlined, GlobalOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

const { Header: AntHeader } = Layout;
const { Search } = Input;

interface HeaderProps {
  onSearch?: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (value: string) => {
    if (onSearch) {
      onSearch(value);
    } else {
      router.push(`/search?q=${encodeURIComponent(value)}`);
    }
  };

  const handleLanguageChange = (locale: string) => {
    i18n.changeLanguage(locale);
    router.push(router.asPath, router.asPath, { locale });
  };

  const userMenuItems = [
    {
      key: 'profile',
      label: t('header.profile'),
      icon: <UserOutlined />,
    },
    {
      key: 'favorites',
      label: t('header.favorites'),
      icon: <HeartOutlined />,
    },
    {
      key: 'alerts',
      label: t('header.priceAlerts'),
      icon: <BellOutlined />,
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      label: t('header.logout'),
    },
  ];

  const languageMenuItems = [
    {
      key: 'en',
      label: 'English',
      onClick: () => handleLanguageChange('en'),
    },
    {
      key: 'ja',
      label: '日本語',
      onClick: () => handleLanguageChange('ja'),
    },
  ];

  return (
    <AntHeader style={{ 
      background: '#fff', 
      padding: '0 24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        height: '100%',
        maxWidth: 1200,
        margin: '0 auto',
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer',
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#1890ff',
          }}>
            <span style={{ marginRight: '8px' }}>🎴</span>
            Pokemon TCG Tracker
          </div>
        </Link>

        {/* Search Bar */}
        <div style={{ flex: 1, maxWidth: 500, margin: '0 48px' }}>
          <Search
            placeholder={t('header.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onSearch={handleSearch}
            size="large"
            enterButton={<SearchOutlined />}
            style={{ width: '100%' }}
          />
        </div>

        {/* Navigation Menu */}
        <Menu
          mode="horizontal"
          selectedKeys={[router.pathname]}
          style={{ 
            border: 'none', 
            background: 'transparent',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <Menu.Item key="/">
            <Link href="/">{t('header.home')}</Link>
          </Menu.Item>
          <Menu.Item key="/sets">
            <Link href="/sets">{t('header.sets')}</Link>
          </Menu.Item>
          <Menu.Item key="/trends">
            <Link href="/trends">{t('header.trends')}</Link>
          </Menu.Item>
          <Menu.Item key="/about">
            <Link href="/about">{t('header.about')}</Link>
          </Menu.Item>
        </Menu>

        {/* User Actions */}
        <Space size="middle">
          {/* Language Selector */}
          <Dropdown menu={{ items: languageMenuItems }} placement="bottomRight">
            <Button 
              icon={<GlobalOutlined />} 
              type="text"
              style={{ color: '#666' }}
            />
          </Dropdown>

          {/* Favorites */}
          <Badge count={5} size="small">
            <Button 
              icon={<HeartOutlined />} 
              type="text"
              style={{ color: '#666' }}
              onClick={() => router.push('/favorites')}
            />
          </Badge>

          {/* Price Alerts */}
          <Badge count={2} size="small">
            <Button 
              icon={<BellOutlined />} 
              type="text"
              style={{ color: '#666' }}
              onClick={() => router.push('/alerts')}
            />
          </Badge>

          {/* User Menu */}
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Avatar 
              icon={<UserOutlined />} 
              style={{ cursor: 'pointer' }}
            />
          </Dropdown>
        </Space>
      </div>
    </AntHeader>
  );
};

export default Header; 