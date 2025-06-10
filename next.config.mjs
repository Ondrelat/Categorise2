import webpack from 'webpack';

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
    // Suppression de experimental.appDir (obsolète dans les versions récentes)
    
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
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                port: '',
                pathname: '/**',  // allow all paths under this hostname
            },
        ],
    },
    
    // Configuration Webpack pour résoudre l'erreur @mapbox/node-pre-gyp
    webpack: (config, { isServer }) => {
        if (!isServer) {
            // Exclure les modules Node.js côté client
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                net: false,
                tls: false,
                crypto: false,
                stream: false,
                url: false,
                zlib: false,
                http: false,
                https: false,
                assert: false,
                os: false,
                path: false,
            };
            
            // Ignorer les fichiers HTML problématiques
            config.module.rules.push({
                test: /\.html$/,
                loader: 'ignore-loader'
            });
            
            // Ignorer complètement @mapbox/node-pre-gyp côté client
            config.plugins.push(
                new webpack.IgnorePlugin({
                    resourceRegExp: /^@mapbox\/node-pre-gyp$/,
                })
            );
        }
        return config;
    },

    // OU Option 2 : Ne conserver que certains types de logs
    // compiler: {
    //     removeConsole: {
    //         exclude: ['log', 'warn', 'error', 'info', 'debug'],
    //     },
    // }
};

export default nextConfig;