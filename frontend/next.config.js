const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development' && !process.env.ENABLE_PWA,
  sw: 'sw-custom.js'
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  trailingSlash: true,
  experimental: {
    serverComponentsExternalPackages: [],
    // Otimizações para desenvolvimento
    ...(process.env.NODE_ENV === 'development' && {
      webpackDevMiddleware: {
        watchOptions: {
          poll: 1000,
          aggregateTimeout: 300,
        },
      },
    }),
  },
  // Otimizações de build
  webpack: (config, { dev, isServer }) => {
    // Otimizações para desenvolvimento
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
    }

    // Otimizações para produção
    if (!dev && !isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10,
        },
        radix: {
          test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
          name: 'radix-ui',
          chunks: 'all',
          priority: 20,
        },
      }
    }

    return config
  },
}

module.exports = withPWA(nextConfig)