/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  images: { unoptimized: true },
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material'],
  },
  compiler: {
    removeConsole: isProd ? { exclude: ['error'] } : false,
  },
  // Keep deployments fast: do not force Vercel/Next to collect and upload the
  // large generated media folders into the serverless build traces.
  outputFileTracingExcludes: {
    '/*': [
      './screens/**/*',
      './instagram/**/*',
      './pdf-pages/**/*',
      './pdf/**/*',
      './covers/**/*',
      './tabs/**/*',
      './products/**/*',
      './bundles-pdf/**/*',
      './private-assets/**/*',
      './scratch/**/*',
    ],
  },
  // Block direct URL access to any .svg file under the glamour-svg public folder
  // (SVGs were moved to private-assets; this is defense-in-depth for any leftover or
  // misconfigured files that might end up there in the future).
  async headers() {
    return [
      {
        source: '/assets/glamour-svg/:file*.svg',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex' },
          // Returning 403 via headers is not possible in Next.js headers(),
          // so we rely on rewrites() below to redirect to a 403 API route.
        ],
      },
    ];
  },
  async rewrites() {
    return [
      // Rewrite legacy /tables path to /references
      {
        source: '/tables/:path*',
        destination: '/references/:path*',
      },
      // Block direct requests to glamour SVG files (moved to private-assets/)
      {
        source: '/assets/glamour-svg/:slug*.svg',
        destination: '/api/glamour-svg-blocked',
      },
      // Block direct requests to glamour PNG files (moved to private-assets/)
      {
        source: '/assets/glamour-svg/:slug*.png',
        destination: '/api/glamour-svg-blocked',
      },
    ];
  },
};

module.exports = nextConfig;
