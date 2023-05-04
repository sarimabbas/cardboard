/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  transpilePackages: ["@cardboard/shared"],
};

module.exports = nextConfig;
