/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3001", // localhost
        "101.32.18.76",
      ],
    },
  },
};

export default nextConfig;
