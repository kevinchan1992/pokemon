import React from 'react';
import { Card as AntCard, Tag, Space, Typography, Button, Tooltip } from 'antd';
import { HeartOutlined, HeartFilled, EyeOutlined, BellOutlined } from '@ant-design/icons';
import Image from 'next/image';
import Link from 'next/link';
import { Card as CardType } from '@/types';
import { useTranslation } from 'react-i18next';

const { Text, Title } = Typography;

interface CardItemProps {
  card: CardType;
  isFavorite?: boolean;
  onFavoriteToggle?: (cardId: string) => void;
  onViewDetails?: (cardId: string) => void;
  onSetAlert?: (cardId: string) => void;
  showPrice?: boolean;
  priceJPY?: number;
  priceUSD?: number;
}

const CardItem: React.FC<CardItemProps> = ({
  card,
  isFavorite = false,
  onFavoriteToggle,
  onViewDetails,
  onSetAlert,
  showPrice = true,
  priceJPY,
  priceUSD,
}) => {
  const { t } = useTranslation();

  const handleFavoriteClick = () => {
    if (onFavoriteToggle) {
      onFavoriteToggle(card.id);
    }
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(card.id);
    }
  };

  const handleSetAlert = () => {
    if (onSetAlert) {
      onSetAlert(card.id);
    }
  };

  const formatPrice = (price: number, currency: 'JPY' | 'USD') => {
    if (currency === 'JPY') {
      return `¥${price.toLocaleString()}`;
    }
    return `$${price.toFixed(2)}`;
  };

  const getRarityColor = (rarity: string) => {
    const rarityColors: { [key: string]: string } = {
      'Common': 'default',
      'Uncommon': 'blue',
      'Rare': 'purple',
      'Rare Holo': 'gold',
      'Rare Holo GX': 'orange',
      'Rare Holo V': 'red',
      'Rare Holo VMAX': 'volcano',
      'Rare Holo VSTAR': 'magenta',
      'Secret': 'cyan',
      'Ultra Rare': 'geekblue',
      'Rainbow Rare': 'rainbow',
      'Gold Rare': 'gold',
    };
    return rarityColors[rarity] || 'default';
  };

  return (
    <AntCard
      hoverable
      style={{ 
        width: '100%',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
      cover={
        <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
          <Image
            src={card.imageUrl}
            alt={card.jpName}
            fill
            style={{ objectFit: 'contain' }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div style={{ 
            position: 'absolute', 
            top: '8px', 
            right: '8px',
            display: 'flex',
            gap: '4px',
          }}>
            <Tooltip title={isFavorite ? t('card.removeFromFavorites') : t('card.addToFavorites')}>
              <Button
                type="text"
                icon={isFavorite ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
                onClick={handleFavoriteClick}
                size="small"
                style={{ 
                  background: 'rgba(255,255,255,0.9)',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                }}
              />
            </Tooltip>
            <Tooltip title={t('card.setPriceAlert')}>
              <Button
                type="text"
                icon={<BellOutlined />}
                onClick={handleSetAlert}
                size="small"
                style={{ 
                  background: 'rgba(255,255,255,0.9)',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                }}
              />
            </Tooltip>
          </div>
        </div>
      }
      actions={[
        <Tooltip key="view" title={t('card.viewDetails')}>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={handleViewDetails}
            style={{ color: '#1890ff' }}
          >
            {t('card.details')}
          </Button>
        </Tooltip>,
      ]}
    >
      <div style={{ padding: '8px 0' }}>
        {/* Card Name */}
        <Title level={5} style={{ marginBottom: '8px', lineHeight: '1.4' }}>
          <Link href={`/card/${card.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
            {card.jpName}
          </Link>
        </Title>
        
        {/* English Name */}
        <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '8px' }}>
          {card.enName}
        </Text>

        {/* Card Info */}
        <Space direction="vertical" size="small" style={{ width: '100%', marginBottom: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {t('card.number')}: {card.cardNumber}
            </Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {card.set}
            </Text>
          </div>
          
          {/* Rarity Tag */}
          <Tag color={getRarityColor(card.rarity)} style={{ margin: 0 }}>
            {card.rarity}
          </Tag>
        </Space>

        {/* Price Information */}
        {showPrice && (priceJPY || priceUSD) && (
          <div style={{ 
            marginTop: '12px',
            padding: '8px',
            background: '#f8f9fa',
            borderRadius: '6px',
          }}>
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              {priceJPY && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text strong style={{ color: '#52c41a' }}>
                    {t('card.referencePrice')}:
                  </Text>
                  <Text strong style={{ color: '#52c41a' }}>
                    {formatPrice(priceJPY, 'JPY')}
                  </Text>
                </div>
              )}
              {priceUSD && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">
                    {t('card.internationalPrice')}:
                  </Text>
                  <Text type="secondary">
                    {formatPrice(priceUSD, 'USD')}
                  </Text>
                </div>
              )}
            </Space>
          </div>
        )}
      </div>
    </AntCard>
  );
};

export default CardItem; 