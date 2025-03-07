/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
  images: {
    domains: [
      "i.imgur.com",
      "novelkeys.com",
      "cannonkeys.com",
      "cdn.shopify.com",
      "massdrop-s3.imgix.net",
      "i.ibb.co",
      "imgur.com",
      "media.discordapp.net",
      "cdn.discordapp.com",
      "omnitype.com",
      "live.staticflickr.com",
      "geekhack.org",
      "switchmod.net",
      "mekibo.com",
      "media.biipmk.com",
      "i.postimg.cc",
      "spaceholdings.net",
      "oblotzky.industries",
      "keygem.com",
      "rndkbd.com",
      "res.cloudinary.com",
    ],
  },
};

module.exports = nextConfig;
