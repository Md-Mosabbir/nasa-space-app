/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return process.env.NODE_ENV === "development"
      ? [
        {
          source: "/api/:path*",     // when frontend calls /api/*
          destination: "http://localhost:8000/:path*", // forward to backend
        },
      ]
      : [];
  },
};

module.exports = nextConfig;
