/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { dev, isServer }) => {
    // Reduzir warnings de cache do webpack
    if (dev) {
      config.cache = {
        type: 'memory',
      }
    }
    
    // Otimizar para strings grandes
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks?.cacheGroups,
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
            maxSize: 100000, // 100KB por chunk
          },
        },
      },
    }

    return config
  },
}

module.exports = nextConfig