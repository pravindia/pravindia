/** @type {import('next').NextConfig} */

const path = require('path')

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'miro.medium.com', pathname: '/**' },
      new URL('https://smazee.com/uploads/**'),
      new URL('https://media2.dev.to/dynamic/image/**'),
    ],
    formats: ['image/avif', 'image/webp'],
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  // Vercel optimizations
  compress: true,
  async rewrites() {
    return ['llms.txt', 'developers.md', 'openapi.json', 'sitemap.xml', 'robots.txt'].map(file => ({
      source: `/${file}`,
      destination: `/api/developer-files/${file}`,
    }))
  },
}

module.exports = nextConfig
