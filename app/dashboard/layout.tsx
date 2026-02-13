
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Dashboard | BlushBuild',
    description: 'Manage your created pages, track views, and create new romantic surprises.',
    openGraph: {
        title: 'Dashboard | BlushBuild',
        description: 'Manage your created pages and view responses.',
        url: 'https://www.blush-build.xyz/dashboard',
        siteName: 'BlushBuild',
        images: [
            {
                url: '/landing.png',
                width: 1200,
                height: 630,
                alt: 'BlushBuild Dashboard',
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
        title: "Dashboard | BlushBuild",
        description: "Manage your created pages, track views, and create new romantic surprises.",
        images: ["/landing.png"],
    },
};

export default function DashboardLayout({
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
                            "name": "Dashboard",
                            "item": "https://www.blush-build.xyz/dashboard"
                        }]
                    })
                }}
            />
            {children}
        </>
    );
}
