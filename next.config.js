/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  reactStrictMode: false,
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
      "akkogear.eu",
      "lh3.googleusercontent.com",
      "cannonkeys.com",
      "cdn.discordapp.com",
      "cdn.shopify.com",
      "geekhack.org",
      "i.ibb.co",
      "i.imgur.com",
      "i.postimg.cc",
      "images.unsplash.com",
      "imgur.com",
      "keygem.com",
      "live.staticflickr.com",
      "massdrop-s3.imgix.net",
      "media.biipmk.com",
      "media.discordapp.net",
      "mekibo.com",
      "novelkeys.com",
      "oblotzky.industries",
      "omnitype.com",
      "res.cloudinary.com",
      "rndkbd.com",
      "spaceholdings.net",
      "switchmod.net",
      "unikeyboards.com",
      "www.ashkeebs.com",
      "deltakeyco.com",
    ],
  },
};

module.exports = nextConfig;
