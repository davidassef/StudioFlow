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
  // Force client-side rendering only - disable all prerendering
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  experimental: {
    // Disable static optimization for all pages
    serverComponentsExternalPackages: [],
  },
  // Disable static generation completely
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
}

module.exports = withPWA(nextConfig)
