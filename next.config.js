/** @type {import('next').NextConfig} */

const isStaticExport = process.env.BUILD_TARGET === 'mobile';

const nextConfig = {
  reactStrictMode: true,
  ...(isStaticExport && { output: 'export' }),
  trailingSlash: true,
  ...(isStaticExport && { distDir: 'out' }),
  images: {
    unoptimized: true,
    domains: ['localhost'],
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;