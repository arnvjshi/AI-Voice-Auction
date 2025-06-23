/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize build performance
  experimental: {
    optimizePackageImports: ['three', 'lucide-react'],
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Configure static export settings
  trailingSlash: false,
  
  // Optimize images
  images: {
    unoptimized: true,
  },
  
  // Configure webpack for better performance
  webpack: (config, { isServer }) => {
    // Optimize Three.js bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      }
    }
    
    return config
  },
  
  // Configure API routes
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ]
  },
}

export default nextConfig
