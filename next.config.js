/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/creator-collabs',
  assetPrefix: '/creator-collabs/',
  trailingSlash: false,

  output: 'standalone',

  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;