/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: process.env.NODE_ENV === 'production' ? '/' : '',
  // You can add other configuration options here as needed
};

module.exports = nextConfig;