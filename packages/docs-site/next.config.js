/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Remove basePath and assetPrefix for Amplify deployment
  // These are typically handled by Amplify's hosting configuration
  basePath: '',
  assetPrefix: '',
}

module.exports = nextConfig
