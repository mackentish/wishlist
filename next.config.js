/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // https://lh3.googleusercontent.com/a/ACg8ocKm_LfcFOBUNR-DcmLJIq5nSim5WtxYpC_jo8K5xVrzNzo=s96-c
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  output: "standalone",
};

module.exports = nextConfig;
