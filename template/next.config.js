/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    dirs: ["src"],
  },
  i18n: {
    locales: ["en", "ja"],
    defaultLocale: "en",
    localeDetection: false,
  },
  domains: [
    {
      domain: "lvh.me",
      defaultLocale: "en",
    },
    {
      domain: "en.lvh.me",
      defaultLocale: "en",
    },
    {
      domain: "ja.lvh.me",
      defaultLocale: "ja",
    },
  ],
};

module.exports = nextConfig;
