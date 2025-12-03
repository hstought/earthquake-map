/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable React Strict Mode due to react-leaflet compatibility issues
  // react-leaflet's MapContainer doesn't handle Strict Mode's double mount properly
  // See: https://github.com/PaulLeCam/react-leaflet/issues/1052
  reactStrictMode: false,
  // Transpile react-leaflet for proper ESM handling
  transpilePackages: ['react-leaflet', '@react-leaflet/core'],
};

module.exports = nextConfig;
