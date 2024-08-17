/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
    domains: ['scrimba.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ite442.stamford.dev',
        port: '',
        pathname: '/**/*',
      },

    ],
  },
  output: "standalone",
};

export default nextConfig;
