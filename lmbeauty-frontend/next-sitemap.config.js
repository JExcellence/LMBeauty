/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.SITE_URL || 'https://lmbeauty.de',
    generateRobotsTxt: true,
    generateIndexSitemap: false,
    exclude: ['/admin/*', '/api/*', '/auth/*', '/mein-bereich/*'],
    robotsTxtOptions: {
        policies: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin', '/api', '/auth', '/mein-bereich'],
            },
        ],
        additionalSitemaps: [
            'https://lmbeauty.de/sitemap.xml',
        ],
    },
    transform: async (config, path) => {
        if (path === '/') {
            return {
                loc: path,
                changefreq: 'daily',
                priority: 1.0,
                lastmod: new Date().toISOString(),
            }
        }

        if (path === '/wimpernlifting-oldenburg' || path === '/wimpernverlaengerung-oldenburg') {
            return {
                loc: path,
                changefreq: 'weekly',
                priority: 0.9,
                lastmod: new Date().toISOString(),
            }
        }

        if (path === '/faq' || path === '/ueber-lm-beauty') {
            return {
                loc: path,
                changefreq: 'monthly',
                priority: 0.8,
                lastmod: new Date().toISOString(),
            }
        }

        if (path === '/impressum' || path === '/datenschutz' || path === '/agb') {
            return {
                loc: path,
                changefreq: 'yearly',
                priority: 0.3,
                lastmod: new Date().toISOString(),
            }
        }

        return {
            loc: path,
            changefreq: 'monthly',
            priority: 0.7,
            lastmod: new Date().toISOString(),
        }
    },
}
