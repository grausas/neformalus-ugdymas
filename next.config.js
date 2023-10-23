/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images: {
    formats: ["image/webp", "image/avif"],
  },
};

module.exports = nextConfig;
