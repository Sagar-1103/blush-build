import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'BlushBuild',
        short_name: 'BlushBuild',
        description: 'Create a cute, personalized proposal or confession page for your crush.',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#ff4d6d',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
            {
                src: '/logo.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    };
}
