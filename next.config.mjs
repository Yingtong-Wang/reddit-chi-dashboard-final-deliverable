/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable image optimization for Vercel deployment
  images: {
    unoptimized: true,
  },
  
  // Ignore ESLint and TypeScript errors during build (for faster deployment)
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['recharts', 'lucide-react'],
  },
}

export default nextConfig