/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // <-- ignores ESLint warnings/errors during build
  },
  experimental: {
    turbo: true, // Turbopack
  },
  async rewrites() {
    return process.env.NODE_ENV === "development"
      ? [
          {
            source: "/api/:path*", // frontend calls /api/*
            destination: "http://localhost:8000/:path*", // forward to local backend
          },
        ]
      : [];
  },
};

module.exports = nextConfig;
