/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ably client is created in useEffect with proper cleanup (ably.close()),
  // so strict mode's double-mount works correctly.
  reactStrictMode: true,
  swcMinify: true,
  images: {
    dangerouslyAllowSVG: true,
    domains: ['static.ably.dev'],
  },
  experimental: {
    serverComponentsExternalPackages: ['ably'],
  },
};

module.exports = nextConfig;
