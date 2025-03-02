/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/robots.txt',
                destination: '/api/robots'
            }
        ];
    },
    experimental: {
        appDir: false,
        dynamicIO: true,
      },
    // Option 1 : Conserver tous les logs en développement ET en production
    compiler: {
        removeConsole: false,
    },
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'image.tmdb.org',
            port: '',
            pathname: '/t/p/**',
          },
        ],
      },

    // OU Option 2 : Ne conserver que certains types de logs
    // compiler: {
    //     removeConsole: {
    //         exclude: ['log', 'warn', 'error', 'info', 'debug'],
    //     },
    // }
};

export default nextConfig;