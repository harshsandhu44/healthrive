import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typedRoutes: true,
  
  // Exclude Supabase functions from TypeScript checking
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // PWA configuration
  async headers() {
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    // More permissive CSP for development, stricter for production
    const connectSrc = isDevelopment 
      ? "'self' http://127.0.0.1:54321 http://localhost:* https: wss: ws:"
      : "'self' https://*.supabase.co https://*.supabase.in https: wss:";
    
    return [
      {
        // Apply security headers to all routes
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Content-Security-Policy',
            value: `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src ${connectSrc}; font-src 'self'; manifest-src 'self';`,
          },
        ],
      },
    ];
  },
  
  // Enable service worker
  async rewrites() {
    return [
      {
        source: '/sw.js',
        destination: '/sw.js',
      },
    ];
  },
};

export default nextConfig;
