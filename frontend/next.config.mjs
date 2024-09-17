/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.unsplash.com"],
    domains: ["scrimba.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "files.stamford.dev",
        port: "",
        pathname: "/**/*",
      },
      {
        protocol: "https",
        hostname: "files-beta.stamford.dev",
        port: "",
        pathname: "/**/*",
      },
    ],
  },
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
