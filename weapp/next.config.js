module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["ipfs.infura.io"],
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
