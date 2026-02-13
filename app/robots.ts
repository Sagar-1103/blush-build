import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api', '/dashboard', '/p/preview'],
        },
        sitemap: 'https://www.blush-build.xyz/sitemap.xml',
    };
}
