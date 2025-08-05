import React from 'react';
import { Layout, Row, Col, Typography, Space, Divider } from 'antd';
import { GithubOutlined, TwitterOutlined, MailOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

const { Footer: AntFooter } = Layout;
const { Text, Title } = Typography;

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <AntFooter style={{ 
      background: '#001529', 
      color: '#fff',
      padding: '48px 24px 24px',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Row gutter={[24, 24]}>
          {/* Company Info */}
          <Col xs={24} sm={12} md={6}>
            <Title level={4} style={{ color: '#fff', marginBottom: 16 }}>
              🎴 Pokemon TCG Tracker
            </Title>
            <Text style={{ color: '#ccc', fontSize: '14px' }}>
              {t('footer.description')}
            </Text>
            <Space style={{ marginTop: 16 }}>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <GithubOutlined style={{ fontSize: '20px', color: '#fff' }} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <TwitterOutlined style={{ fontSize: '20px', color: '#fff' }} />
              </a>
              <a href="mailto:contact@pokemontcg.com">
                <MailOutlined style={{ fontSize: '20px', color: '#fff' }} />
              </a>
            </Space>
          </Col>

          {/* Quick Links */}
          <Col xs={24} sm={12} md={6}>
            <Title level={5} style={{ color: '#fff', marginBottom: 16 }}>
              {t('footer.quickLinks')}
            </Title>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link href="/" style={{ color: '#ccc', textDecoration: 'none' }}>
                {t('footer.home')}
              </Link>
              <Link href="/sets" style={{ color: '#ccc', textDecoration: 'none' }}>
                {t('footer.sets')}
              </Link>
              <Link href="/trends" style={{ color: '#ccc', textDecoration: 'none' }}>
                {t('footer.trends')}
              </Link>
              <Link href="/about" style={{ color: '#ccc', textDecoration: 'none' }}>
                {t('footer.about')}
              </Link>
            </div>
          </Col>

          {/* Features */}
          <Col xs={24} sm={12} md={6}>
            <Title level={5} style={{ color: '#fff', marginBottom: 16 }}>
              {t('footer.features')}
            </Title>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link href="/search" style={{ color: '#ccc', textDecoration: 'none' }}>
                {t('footer.cardSearch')}
              </Link>
              <Link href="/price-tracking" style={{ color: '#ccc', textDecoration: 'none' }}>
                {t('footer.priceTracking')}
              </Link>
              <Link href="/favorites" style={{ color: '#ccc', textDecoration: 'none' }}>
                {t('footer.favorites')}
              </Link>
              <Link href="/alerts" style={{ color: '#ccc', textDecoration: 'none' }}>
                {t('footer.priceAlerts')}
              </Link>
            </div>
          </Col>

          {/* Support */}
          <Col xs={24} sm={12} md={6}>
            <Title level={5} style={{ color: '#fff', marginBottom: 16 }}>
              {t('footer.support')}
            </Title>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link href="/help" style={{ color: '#ccc', textDecoration: 'none' }}>
                {t('footer.help')}
              </Link>
              <Link href="/contact" style={{ color: '#ccc', textDecoration: 'none' }}>
                {t('footer.contact')}
              </Link>
              <Link href="/privacy" style={{ color: '#ccc', textDecoration: 'none' }}>
                {t('footer.privacy')}
              </Link>
              <Link href="/terms" style={{ color: '#ccc', textDecoration: 'none' }}>
                {t('footer.terms')}
              </Link>
            </div>
          </Col>
        </Row>

        <Divider style={{ borderColor: '#303030', margin: '32px 0 16px' }} />

        {/* Bottom Section */}
        <Row justify="space-between" align="middle">
          <Col>
            <Text style={{ color: '#ccc', fontSize: '14px' }}>
              © {currentYear} Pokemon TCG Tracker. {t('footer.allRightsReserved')}
            </Text>
          </Col>
          <Col>
            <Text style={{ color: '#ccc', fontSize: '12px' }}>
              {t('footer.disclaimer')}
            </Text>
          </Col>
        </Row>
      </div>
    </AntFooter>
  );
};

export default Footer; 