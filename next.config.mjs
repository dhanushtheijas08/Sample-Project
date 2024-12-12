/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/login",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        // https://firebasestorage.googleapis.com/v0/b/wefaa-robotics.appspot.com/o/classroom_badge%2FAnder.png
      },
    ],
  },
};

export default nextConfig;
