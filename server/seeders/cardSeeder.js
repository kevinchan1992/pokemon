const { Card, Price } = require('../models');

const cardData = [
  // Base Set 經典卡牌
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
  },
  
  // 新增更多熱門卡牌
  {
    jpName: 'リザードンVMAX',
    enName: 'Charizard VMAX',
    cardNumber: '020/189',
    rarity: 'Ultra Rare',
    set: 'Darkness Ablaze',
    setCode: 'swsh3',
    imageUrl: 'https://images.pokemontcg.io/swsh3/20.png',
    releaseDate: '2020-08-14',
    language: 'jp',
    description: 'Fire type Pokemon VMAX card',
    hp: 330,
    type: 'Pokemon'
  },
  {
    jpName: 'ピカチュウVMAX',
    enName: 'Pikachu VMAX',
    cardNumber: '044/185',
    rarity: 'Ultra Rare',
    set: 'Vivid Voltage',
    setCode: 'swsh4',
    imageUrl: 'https://images.pokemontcg.io/swsh4/44.png',
    releaseDate: '2020-11-13',
    language: 'jp',
    description: 'Electric type Pokemon VMAX card',
    hp: 310,
    type: 'Pokemon'
  },
  {
    jpName: 'レックウザGX',
    enName: 'Rayquaza GX',
    cardNumber: '109/168',
    rarity: 'Ultra Rare',
    set: 'Celestial Storm',
    setCode: 'sm7',
    imageUrl: 'https://images.pokemontcg.io/sm7/109.png',
    releaseDate: '2018-08-03',
    language: 'jp',
    description: 'Dragon type Pokemon GX card',
    hp: 180,
    type: 'Pokemon'
  },
  {
    jpName: 'ミュウex',
    enName: 'Mew ex',
    cardNumber: '151/165',
    rarity: 'Ultra Rare',
    set: '151',
    setCode: 'sv2a',
    imageUrl: 'https://images.pokemontcg.io/sv2a/151.png',
    releaseDate: '2023-06-16',
    language: 'jp',
    description: 'Psychic type Pokemon ex card',
    hp: 180,
    type: 'Pokemon'
  },
  {
    jpName: 'ブラッキーVMAX',
    enName: 'Umbreon VMAX',
    cardNumber: '095/203',
    rarity: 'Ultra Rare',
    set: 'Evolving Skies',
    setCode: 'swsh7',
    imageUrl: 'https://images.pokemontcg.io/swsh7/95.png',
    releaseDate: '2021-08-27',
    language: 'jp',
    description: 'Dark type Pokemon VMAX card',
    hp: 320,
    type: 'Pokemon'
  },
  {
    jpName: 'リーリエ',
    enName: 'Lillie',
    cardNumber: '147/149',
    rarity: 'Ultra Rare',
    set: 'Sun & Moon',
    setCode: 'sm1',
    imageUrl: 'https://images.pokemontcg.io/sm1/147.png',
    releaseDate: '2017-02-03',
    language: 'jp',
    description: 'Supporter trainer card',
    hp: null,
    type: 'Trainer'
  },
  {
    jpName: 'マリィ',
    enName: 'Marnie',
    cardNumber: '200/202',
    rarity: 'Ultra Rare',
    set: 'Sword & Shield',
    setCode: 'swsh1',
    imageUrl: 'https://images.pokemontcg.io/swsh1/200.png',
    releaseDate: '2020-02-07',
    language: 'jp',
    description: 'Supporter trainer card',
    hp: null,
    type: 'Trainer'
  },
  {
    jpName: 'アルセウスVSTAR',
    enName: 'Arceus VSTAR',
    cardNumber: '123/172',
    rarity: 'Ultra Rare',
    set: 'Brilliant Stars',
    setCode: 'swsh9',
    imageUrl: 'https://images.pokemontcg.io/swsh9/123.png',
    releaseDate: '2022-02-25',
    language: 'jp',
    description: 'Colorless type Pokemon VSTAR card',
    hp: 280,
    type: 'Pokemon'
  },
  {
    jpName: 'ギラティナVSTAR',
    enName: 'Giratina VSTAR',
    cardNumber: '131/196',
    rarity: 'Ultra Rare',
    set: 'Lost Origin',
    setCode: 'swsh11',
    imageUrl: 'https://images.pokemontcg.io/swsh11/131.png',
    releaseDate: '2022-09-09',
    language: 'jp',
    description: 'Dragon type Pokemon VSTAR card',
    hp: 280,
    type: 'Pokemon'
  },
  {
    jpName: 'サーナイトex',
    enName: 'Gardevoir ex',
    cardNumber: '086/091',
    rarity: 'Ultra Rare',
    set: 'Paldea Evolved',
    setCode: 'sv2',
    imageUrl: 'https://images.pokemontcg.io/sv2/86.png',
    releaseDate: '2023-06-09',
    language: 'jp',
    description: 'Psychic type Pokemon ex card',
    hp: 310,
    type: 'Pokemon'
  },
  {
    jpName: 'ルギアV',
    enName: 'Lugia V',
    cardNumber: '186/195',
    rarity: 'Ultra Rare',
    set: 'Silver Tempest',
    setCode: 'swsh12',
    imageUrl: 'https://images.pokemontcg.io/swsh12/186.png',
    releaseDate: '2022-11-11',
    language: 'jp',
    description: 'Colorless type Pokemon V card',
    hp: 220,
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