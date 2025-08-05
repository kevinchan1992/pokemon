const { Card, Price } = require('../models');

const cardData = [
  // 經典基礎系列卡牌
  {
    jpName: 'ピカチュウ',
    enName: 'Pikachu',
    cardNumber: '025/102',
    rarity: 'Rare Holo',
    set: 'Base Set',
    setCode: 'base1',
    imageUrl: 'https://images.pokemontcg.io/base1/25.png',
    releaseDate: '1999-01-09',
    language: 'jp',
    description: 'Electric type Pokemon card',
    hp: 60,
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
    jpName: 'ゼニガメ',
    enName: 'Squirtle',
    cardNumber: '063/102',
    rarity: 'Common',
    set: 'Base Set',
    setCode: 'base1',
    imageUrl: 'https://images.pokemontcg.io/base1/63.png',
    releaseDate: '1999-01-09',
    language: 'jp',
    description: 'Water type Pokemon card',
    hp: 40,
    type: 'Pokemon'
  },
  
  // 現代熱門卡牌
  {
    jpName: 'ピカチュウVMAX',
    enName: 'Pikachu VMAX',
    cardNumber: '044/185',
    rarity: 'Rare Holo VMAX',
    set: 'Vivid Voltage',
    setCode: 'swsh04',
    imageUrl: 'https://images.pokemontcg.io/swsh4/44.png',
    releaseDate: '2020-11-13',
    language: 'jp',
    description: 'Electric type Pokemon VMAX card',
    hp: 320,
    type: 'Pokemon'
  },
  {
    jpName: 'リザードンVMAX',
    enName: 'Charizard VMAX',
    cardNumber: '020/189',
    rarity: 'Rare Holo VMAX',
    set: 'Darkness Ablaze',
    setCode: 'swsh03',
    imageUrl: 'https://images.pokemontcg.io/swsh3/20.png',
    releaseDate: '2020-08-14',
    language: 'jp',
    description: 'Fire type Pokemon VMAX card',
    hp: 330,
    type: 'Pokemon'
  },
  {
    jpName: 'ミュウツーV',
    enName: 'Mewtwo V',
    cardNumber: '030/189',
    rarity: 'Rare Holo V',
    set: 'Pokemon GO',
    setCode: 'pgo',
    imageUrl: 'https://images.pokemontcg.io/pgo/30.png',
    releaseDate: '2022-07-01',
    language: 'jp',
    description: 'Psychic type Pokemon V card',
    hp: 220,
    type: 'Pokemon'
  },
  {
    jpName: 'ルギアV',
    enName: 'Lugia V',
    cardNumber: '138/195',
    rarity: 'Rare Holo V',
    set: 'Silver Tempest',
    setCode: 'swsh12',
    imageUrl: 'https://images.pokemontcg.io/swsh12/138.png',
    releaseDate: '2022-11-11',
    language: 'jp',
    description: 'Psychic type Pokemon V card',
    hp: 220,
    type: 'Pokemon'
  },
  
  // 經典稀有卡牌
  {
    jpName: 'ミュウ',
    enName: 'Mew',
    cardNumber: '011/072',
    rarity: 'Rare Holo',
    set: 'Celebrations',
    setCode: 'cel25',
    imageUrl: 'https://images.pokemontcg.io/cel25/11.png',
    releaseDate: '2021-10-08',
    language: 'jp',
    description: 'Psychic type Pokemon card',
    hp: 60,
    type: 'Pokemon'
  },
  {
    jpName: 'イーブイ',
    enName: 'Eevee',
    cardNumber: '101/203',
    rarity: 'Common',
    set: 'Evolving Skies',
    setCode: 'swsh07',
    imageUrl: 'https://images.pokemontcg.io/swsh7/101.png',
    releaseDate: '2021-08-27',
    language: 'jp',
    description: 'Normal type Pokemon card',
    hp: 50,
    type: 'Pokemon'
  },
  
  // 新系列卡牌
  {
    jpName: 'ニャオハ',
    enName: 'Sprigatito',
    cardNumber: '013/198',
    rarity: 'Common',
    set: 'Paldea Evolved',
    setCode: 'pev',
    imageUrl: 'https://images.pokemontcg.io/pev/13.png',
    releaseDate: '2023-06-09',
    language: 'jp',
    description: 'Grass type Pokemon card',
    hp: 60,
    type: 'Pokemon'
  },
  {
    jpName: 'ホゲータ',
    enName: 'Fuecoco',
    cardNumber: '026/198',
    rarity: 'Common',
    set: 'Paldea Evolved',
    setCode: 'pev',
    imageUrl: 'https://images.pokemontcg.io/pev/26.png',
    releaseDate: '2023-06-09',
    language: 'jp',
    description: 'Fire type Pokemon card',
    hp: 70,
    type: 'Pokemon'
  },
  {
    jpName: 'クワッス',
    enName: 'Quaxly',
    cardNumber: '055/198',
    rarity: 'Common',
    set: 'Paldea Evolved',
    setCode: 'pev',
    imageUrl: 'https://images.pokemontcg.io/pev/55.png',
    releaseDate: '2023-06-09',
    language: 'jp',
    description: 'Water type Pokemon card',
    hp: 60,
    type: 'Pokemon'
  },
  
  // 熱門交換卡牌
  {
    jpName: 'ボスの指令',
    enName: 'Boss\'s Orders',
    cardNumber: '154/192',
    rarity: 'Uncommon',
    set: 'Rebel Clash',
    setCode: 'swsh02',
    imageUrl: 'https://images.pokemontcg.io/swsh2/154.png',
    releaseDate: '2020-05-01',
    language: 'jp',
    description: 'Supporter card',
    hp: null,
    type: 'Trainer'
  },
  {
    jpName: 'プロフェッサーの研究',
    enName: 'Professor\'s Research',
    cardNumber: '178/192',
    rarity: 'Uncommon',
    set: 'Sword & Shield',
    setCode: 'swsh01',
    imageUrl: 'https://images.pokemontcg.io/swsh1/178.png',
    releaseDate: '2020-02-07',
    language: 'jp',
    description: 'Supporter card',
    hp: null,
    type: 'Trainer'
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