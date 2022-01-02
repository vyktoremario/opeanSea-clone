require("dotenv").config()
/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  env: {
    PROJECT_ID: process.env.PROJECT_ID,
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    PROJECT_SECRET: process.env.PROJECT_SECRET
  },
  images: {
    domains: ['ipfs.infura.io'],
  },
}
