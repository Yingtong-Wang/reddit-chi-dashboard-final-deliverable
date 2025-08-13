/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for GitHub Pages
  output: 'export',
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  
  // Ignore ESLint and TypeScript errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Base path for GitHub Pages (update this with your repo name)
  basePath: process.env.NODE_ENV === 'production' ? '/reddit-chi-dashboard-final-deliverable' : '',
  
  // Trailing slash for GitHub Pages compatibility
  trailingSlash: true,
}

export default nextConfig 