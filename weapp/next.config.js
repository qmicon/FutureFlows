module.exports = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  future: {
    webpack5: true, 
  },
  webpack(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback, 
      fs: false, 
    };

    return config;
  },
};
