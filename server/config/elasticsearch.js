const { Client } = require('@elastic/elasticsearch');

// Elasticsearch 配置
const client = new Client({
  node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
  auth: {
    username: process.env.ELASTICSEARCH_USERNAME || 'elastic',
    password: process.env.ELASTICSEARCH_PASSWORD || 'changeme'
  },
  tls: {
    rejectUnauthorized: false
  }
});

// 索引名稱
const INDEX_NAME = 'pokemon_cards';

// 創建索引映射
const createIndexMapping = async () => {
  try {
    const exists = await client.indices.exists({ index: INDEX_NAME });
    
    if (!exists) {
      await client.indices.create({
        index: INDEX_NAME,
        body: {
          mappings: {
            properties: {
              id: { type: 'keyword' },
              jpName: { 
                type: 'text',
                analyzer: 'kuromoji',
                fields: {
                  keyword: { type: 'keyword' }
                }
              },
              enName: { 
                type: 'text',
                analyzer: 'english',
                fields: {
                  keyword: { type: 'keyword' }
                }
              },
              cardNumber: { type: 'keyword' },
              rarity: { type: 'keyword' },
              set: { type: 'keyword' },
              setCode: { type: 'keyword' },
              language: { type: 'keyword' },
              description: { type: 'text' },
              hp: { type: 'integer' },
              type: { type: 'keyword' },
              releaseDate: { type: 'date' },
              imageUrl: { type: 'keyword' },
              isActive: { type: 'boolean' },
              createdAt: { type: 'date' },
              updatedAt: { type: 'date' }
            }
          },
          settings: {
            analysis: {
              analyzer: {
                kuromoji: {
                  type: 'kuromoji'
                },
                english: {
                  type: 'english'
                }
              }
            }
          }
        }
      });
      console.log('✅ Elasticsearch index created successfully');
    }
  } catch (error) {
    console.error('❌ Elasticsearch index creation failed:', error);
  }
};

// 測試連接
const testConnection = async () => {
  try {
    const info = await client.info();
    console.log('✅ Elasticsearch connection established');
    console.log(`📊 Cluster: ${info.cluster_name}, Version: ${info.version.number}`);
    return true;
  } catch (error) {
    console.error('❌ Elasticsearch connection failed:', error);
    return false;
  }
};

// 索引文檔
const indexCard = async (card) => {
  try {
    await client.index({
      index: INDEX_NAME,
      id: card.id,
      body: card
    });
  } catch (error) {
    console.error('❌ Index card failed:', error);
  }
};

// 批量索引
const bulkIndexCards = async (cards) => {
  try {
    const operations = cards.flatMap(card => [
      { index: { _index: INDEX_NAME, _id: card.id } },
      card
    ]);

    if (operations.length > 0) {
      const result = await client.bulk({ body: operations });
      console.log(`✅ Indexed ${cards.length} cards`);
      return result;
    }
  } catch (error) {
    console.error('❌ Bulk index failed:', error);
  }
};

// 搜索文檔
const searchCards = async (query, filters = {}, page = 1, size = 20) => {
  try {
    const must = [];
    const filter = [];

    // 文本搜索
    if (query) {
      must.push({
        multi_match: {
          query: query,
          fields: ['jpName^2', 'enName^2', 'cardNumber', 'description'],
          type: 'best_fields',
          fuzziness: 'AUTO'
        }
      });
    }

    // 過濾條件
    if (filters.language) {
      filter.push({ term: { language: filters.language } });
    }

    if (filters.set) {
      filter.push({ term: { setCode: filters.set } });
    }

    if (filters.rarity) {
      filter.push({ term: { rarity: filters.rarity } });
    }

    if (filters.type) {
      filter.push({ term: { type: filters.type } });
    }

    // 只顯示活躍的卡牌
    filter.push({ term: { isActive: true } });

    const body = {
      query: {
        bool: {
          must: must,
          filter: filter
        }
      },
      sort: [
        { _score: { order: 'desc' } },
        { createdAt: { order: 'desc' } }
      ],
      from: (page - 1) * size,
      size: size
    };

    const result = await client.search({
      index: INDEX_NAME,
      body: body
    });

    return {
      hits: result.hits.hits.map(hit => ({
        ...hit._source,
        score: hit._score
      })),
      total: result.hits.total.value,
      page: page,
      size: size
    };
  } catch (error) {
    console.error('❌ Search failed:', error);
    throw error;
  }
};

// 刪除索引
const deleteIndex = async () => {
  try {
    await client.indices.delete({ index: INDEX_NAME });
    console.log('✅ Index deleted successfully');
  } catch (error) {
    console.error('❌ Delete index failed:', error);
  }
};

module.exports = {
  client,
  INDEX_NAME,
  createIndexMapping,
  testConnection,
  indexCard,
  bulkIndexCards,
  searchCards,
  deleteIndex
}; 