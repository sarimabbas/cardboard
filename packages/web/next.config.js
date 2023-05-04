/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  transpilePackages: ["@sarim.garden/emerald-shared"],
};

module.exports = nextConfig;
