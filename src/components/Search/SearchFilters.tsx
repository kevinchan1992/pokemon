import React from 'react';
import { Card, Form, Select, Input, Button, Space, Divider, Typography } from 'antd';
import { SearchOutlined, ClearOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { POPULAR_SETS, RARITIES, CONDITIONS } from '@/utils/constants';

const { Option } = Select;
const { Text } = Typography;

interface SearchFiltersProps {
  onSearch: (values: any) => void;
  onReset: () => void;
  loading?: boolean;
  initialValues?: any;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  onSearch,
  onReset,
  loading = false,
  initialValues,
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const handleSearch = (values: any) => {
    onSearch(values);
  };

  const handleReset = () => {
    form.resetFields();
    onReset();
  };

  return (
    <Card 
      title={t('search.filters')}
      style={{ marginBottom: '24px' }}
      extra={
        <Space>
          <Button 
            icon={<ClearOutlined />} 
            onClick={handleReset}
            disabled={loading}
          >
            {t('search.reset')}
          </Button>
          <Button 
            type="primary" 
            icon={<SearchOutlined />} 
            onClick={() => form.submit()}
            loading={loading}
          >
            {t('search.search')}
          </Button>
        </Space>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSearch}
        initialValues={initialValues}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {/* Search Query */}
          <Form.Item
            name="query"
            label={t('search.cardName')}
          >
            <Input 
              placeholder={t('search.cardNamePlaceholder')}
              allowClear
            />
          </Form.Item>

          {/* Language */}
          <Form.Item
            name="language"
            label={t('search.language')}
          >
            <Select placeholder={t('search.selectLanguage')} allowClear>
              <Option value="jp">{t('search.japanese')}</Option>
              <Option value="en">{t('search.english')}</Option>
            </Select>
          </Form.Item>

          {/* Card Set */}
          <Form.Item
            name="set"
            label={t('search.cardSet')}
          >
            <Select 
              placeholder={t('search.selectSet')} 
              allowClear
              showSearch
              filterOption={(input, option) =>
                (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {POPULAR_SETS.map(set => (
                <Option key={set.code} value={set.code}>
                  {set.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Rarity */}
          <Form.Item
            name="rarity"
            label={t('search.rarity')}
          >
            <Select placeholder={t('search.selectRarity')} allowClear>
              {Object.entries(RARITIES).map(([key, value]) => (
                <Option key={key} value={value}>
                  {value}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Condition */}
          <Form.Item
            name="condition"
            label={t('search.condition')}
          >
            <Select placeholder={t('search.selectCondition')} allowClear>
              {Object.entries(CONDITIONS).map(([key, value]) => (
                <Option key={key} value={value}>
                  {value}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Card Number */}
          <Form.Item
            name="cardNumber"
            label={t('search.cardNumber')}
          >
            <Input 
              placeholder={t('search.cardNumberPlaceholder')}
              allowClear
            />
          </Form.Item>
        </div>

        <Divider />

        {/* Price Range */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <Form.Item
            name="minPriceJPY"
            label={t('search.minPriceJPY')}
          >
            <Input 
              placeholder="0"
              type="number"
              min="0"
              addonAfter="¥"
            />
          </Form.Item>

          <Form.Item
            name="maxPriceJPY"
            label={t('search.maxPriceJPY')}
          >
            <Input 
              placeholder="∞"
              type="number"
              min="0"
              addonAfter="¥"
            />
          </Form.Item>

          <Form.Item
            name="minPriceUSD"
            label={t('search.minPriceUSD')}
          >
            <Input 
              placeholder="0"
              type="number"
              min="0"
              step="0.01"
              addonAfter="$"
            />
          </Form.Item>

          <Form.Item
            name="maxPriceUSD"
            label={t('search.maxPriceUSD')}
          >
            <Input 
              placeholder="∞"
              type="number"
              min="0"
              step="0.01"
              addonAfter="$"
            />
          </Form.Item>
        </div>

        <Divider />

        {/* Sort Options */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <Form.Item
            name="sortBy"
            label={t('search.sortBy')}
            initialValue="relevance"
          >
            <Select>
              <Option value="relevance">{t('search.relevance')}</Option>
              <Option value="price_low_to_high">{t('search.priceLowToHigh')}</Option>
              <Option value="price_high_to_low">{t('search.priceHighToLow')}</Option>
              <Option value="name_a_to_z">{t('search.nameAToZ')}</Option>
              <Option value="name_z_to_a">{t('search.nameZToA')}</Option>
              <Option value="newest">{t('search.newest')}</Option>
              <Option value="oldest">{t('search.oldest')}</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="pageSize"
            label={t('search.resultsPerPage')}
            initialValue={20}
          >
            <Select>
              <Option value={10}>10</Option>
              <Option value={20}>20</Option>
              <Option value={50}>50</Option>
              <Option value={100}>100</Option>
            </Select>
          </Form.Item>
        </div>
      </Form>
    </Card>
  );
};

export default SearchFilters; 