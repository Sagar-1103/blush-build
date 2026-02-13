
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Create Your Page | BlushBuild',
    description: 'Design a personalized romantic page for your crush or partner. Choose templates, add music, and create magic.',
    openGraph: {
        title: 'Create Your Page | BlushBuild',
        description: 'Design a personalized romantic page for your crush or partner.',
        url: 'https://www.blush-build.xyz/create',
        siteName: 'BlushBuild',
        images: [
            {
                url: '/landing.png',
                width: 1200,
                height: 630,
                alt: 'Create your BlushBuild page',
            },
            {
                url: '/logo.png',
                width: 500,
                height: 500,
                alt: 'BlushBuild Logo',
            },
        ],
        type: 'website',
    },
    twitter: {
        card: "summary_large_image",
        title: "Create Your Page | BlushBuild",
        description: "Design a personalized romantic page for your crush or partner.",
        images: ["/landing.png"],
    },
};

export default function CreateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BreadcrumbList",
                        "itemListElement": [{
                            "@type": "ListItem",
                            "position": 1,
                            "name": "Home",
                            "item": "https://www.blush-build.xyz"
                        }, {
                            "@type": "ListItem",
                            "position": 2,
                            "name": "Create",
                            "item": "https://www.blush-build.xyz/create"
                        }]
                    })
                }}
            />
            {children}
        </>
    );
}
