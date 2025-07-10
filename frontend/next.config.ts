/** @type {import('next').NextConfig} */
const nextConfig = {
  webpackDevMiddleware: (config: { watchOptions: { poll: number; aggregateTimeout: number; }; }) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };
    return config;
  },
};

module.exports = nextConfig;