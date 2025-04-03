/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    SERPAPI_API_KEY: process.env.SERPAPI_API_KEY
  }
}

module.exports = nextConfig 