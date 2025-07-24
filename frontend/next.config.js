/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Configuração para permitir imagens de domínios externos
  images: {
    domains: ['localhost'],
  },
};

module.exports = nextConfig;