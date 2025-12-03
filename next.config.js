/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Transpile react-leaflet for proper ESM handling
  transpilePackages: ['react-leaflet', '@react-leaflet/core'],
};

module.exports = nextConfig;
