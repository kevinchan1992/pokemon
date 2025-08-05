/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['images.pokemontcg.io', 'assets.pokemon.com', 'cdn.shopify.com'],
  },
  i18n: {
    locales: ['en', 'ja'],
    defaultLocale: 'en',
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}

module.exports = nextConfig 