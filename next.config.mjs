/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3001", // localhost
        "tradecamp.site",
        "www.tradecamp.site",
      ],
    },
  },
};

export default nextConfig;
