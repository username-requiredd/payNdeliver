/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: process.env.NODE_ENV === 'production' ? '/' : '',
  images: {
    domains: ['via.placeholder.com'], // Add allowed domains here
  },
};

module.exports = nextConfig;
