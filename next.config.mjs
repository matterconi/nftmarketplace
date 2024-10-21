/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable image optimization for external domains
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gateway.pinata.cloud', // Updated to Pinata's gateway
        port: '',
        pathname: '/ipfs/**',
      },
    ],
  },

  // Add any other configurations you might have
};

export default nextConfig;

  