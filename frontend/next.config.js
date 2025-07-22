/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Configuração para usar a porta 3200 em desenvolvimento
  devServer: {
    port: 3200,
  },
  // Configuração para permitir imagens de domínios externos
  images: {
    domains: ['localhost'],
  },
};

module.exports = nextConfig;