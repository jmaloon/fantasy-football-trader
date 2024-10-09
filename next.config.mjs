/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "a.espncdn.com",
        port: "",
        pathname: "/i/headshots/nfl/players/full/*.png",
        search: "",
      },
    ],
  },
};

export default nextConfig;
