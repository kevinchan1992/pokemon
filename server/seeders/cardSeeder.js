const { Card, Price } = require('../models');

const cardData = [
  {
    jpName: 'ピカチュウ',
    enName: 'Pikachu',
    cardNumber: '025/025',
    rarity: 'Rare Holo',
    set: 'Base Set',
    setCode: 'base1',
    imageUrl: 'https://images.pokemontcg.io/base1/25.png',
    releaseDate: '1999-01-09',
    language: 'jp',
    description: 'Electric type Pokemon card',
    hp: 50,
    type: 'Pokemon'
  },
  {
    jpName: 'リザードン',
    enName: 'Charizard',
    cardNumber: '004/102',
    rarity: 'Rare Holo',
    set: 'Base Set',
    setCode: 'base1',
    imageUrl: 'https://images.pokemontcg.io/base1/4.png',
    releaseDate: '1999-01-09',
    language: 'jp',
    description: 'Fire type Pokemon card',
    hp: 120,
    type: 'Pokemon'
  },
  {
    jpName: 'ミュウツー',
    enName: 'Mewtwo',
    cardNumber: '150/150',
    rarity: 'Rare Holo',
    set: 'Base Set',
    setCode: 'base1',
    imageUrl: 'https://images.pokemontcg.io/base1/150.png',
    releaseDate: '1999-01-09',
    language: 'jp',
    description: 'Psychic type Pokemon card',
    hp: 60,
    type: 'Pokemon'
  },
  {
    jpName: 'ルカリオ',
    enName: 'Lucario',
    cardNumber: '019/070',
    rarity: 'Rare Holo V',
    set: 'Sword & Shield',
    setCode: 'swsh1',
    imageUrl: 'https://images.pokemontcg.io/swsh1/19.png',
    releaseDate: '2020-02-07',
    language: 'jp',
    description: 'Fighting type Pokemon V card',
    hp: 210,
    type: 'Pokemon'
  },
  {
    jpName: 'ガルーラ',
    enName: 'Gengar',
    cardNumber: '094/102',
    rarity: 'Rare Holo',
    set: 'Base Set',
    setCode: 'base1',
    imageUrl: 'https://images.pokemontcg.io/base1/94.png',
    releaseDate: '1999-01-09',
    language: 'jp',
    description: 'Ghost type Pokemon card',
    hp: 80,
    type: 'Pokemon'
  },
  {
    jpName: 'イーブイ',
    enName: 'Eevee',
    cardNumber: '063/102',
    rarity: 'Common',
    set: 'Base Set',
    setCode: 'base1',
    imageUrl: 'https://images.pokemontcg.io/base1/63.png',
    releaseDate: '1999-01-09',
    language: 'jp',
    description: 'Normal type Pokemon card',
    hp: 50,
    type: 'Pokemon'
  },
  {
    jpName: 'フシギダネ',
    enName: 'Bulbasaur',
    cardNumber: '044/102',
    rarity: 'Common',
    set: 'Base Set',
    setCode: 'base1',
    imageUrl: 'https://images.pokemontcg.io/base1/44.png',
    releaseDate: '1999-01-09',
    language: 'jp',
    description: 'Grass type Pokemon card',
    hp: 40,
    type: 'Pokemon'
  },
  {
    jpName: 'ヒトカゲ',
    enName: 'Charmander',
    cardNumber: '004/102',
    rarity: 'Common',
    set: 'Base Set',
    setCode: 'base1',
    imageUrl: 'https://images.pokemontcg.io/base1/4.png',
    releaseDate: '1999-01-09',
    language: 'jp',
    description: 'Fire type Pokemon card',
    hp: 50,
    type: 'Pokemon'
  }
];

const priceData = [
  { priceJPY: 15000, priceUSD: 100, source: 'mercari', condition: 'near_mint' },
  { priceJPY: 12000, priceUSD: 80, source: 'yahoo', condition: 'excellent' },
  { priceJPY: 18000, priceUSD: 120, source: 'rakuten', condition: 'mint' },
  { priceJPY: 9000, priceUSD: 60, source: 'ebay', condition: 'good' },
  { priceJPY: 11000, priceUSD: 75, source: 'tcgplayer', condition: 'near_mint' },
  { priceJPY: 8000, priceUSD: 55, source: 'trollandtoad', condition: 'light_played' },
  { priceJPY: 5000, priceUSD: 35, source: 'mercari', condition: 'played' },
  { priceJPY: 3000, priceUSD: 20, source: 'yahoo', condition: 'poor' }
];

const seedCards = async () => {
  try {
    console.log('🌱 Seeding cards...');
    
    // 創建卡牌
    const cards = await Card.bulkCreate(cardData);
    console.log(`✅ Created ${cards.length} cards`);
    
    // 為每個卡牌創建價格數據
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      const priceEntries = priceData.map(price => ({
        ...price,
        cardId: card.id
      }));
      
      await Price.bulkCreate(priceEntries);
    }
    
    console.log(`✅ Created price data for ${cards.length} cards`);
    console.log('✅ Card seeding completed!');
    
    return cards;
  } catch (error) {
    console.error('❌ Card seeding failed:', error);
    throw error;
  }
};

module.exports = { seedCards }; 