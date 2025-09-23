/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: process.env.NODE_ENV === 'production' ? '/op-interop-alerts' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/op-interop-alerts' : '',
}

module.exports = nextConfig
