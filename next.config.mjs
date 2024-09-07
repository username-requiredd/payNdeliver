/** @type {import('next').NextConfig} */
const nextConfig = {
    assetPrefix: process.env.NODE_ENV === 'production' ? 'https://payndeliverr.netlify.app' : '',
    // Add any other configuration options here
  };
  
  export default nextConfig;