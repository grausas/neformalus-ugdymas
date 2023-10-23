/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images: {
    loader: "custom",
  },
};

module.exports = nextConfig;
