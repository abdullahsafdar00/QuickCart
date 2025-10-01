/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
  experimental: {
    serverComponentsExternalPackages: ['mongoose'],
  },
  async generateStaticParams() {
    return [];
  },
  async generateBuildId() {
    return 'build-' + Date.now();
  },
  output: 'standalone',
};

export default nextConfig;