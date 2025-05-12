/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@acme/ui"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  devIndicators: false,
};

export default nextConfig;
