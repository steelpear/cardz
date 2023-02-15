/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    MONGODB_URL: "mongodb://root:5WyJKW2gPkmA@185.151.240.199:31017/portal?authSource=admin",
    API_URL: process.env.NODE_ENV === 'production' ? "https://cards-api.broniryem.ru" : "http://localhost:3000"
  }
}

module.exports = nextConfig
