import { notFound } from "next/navigation";
import { getPageBySlug, recordView } from "@/app/create/actions";
import { PublicPageClient } from "../../../components/client";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const page = await getPageBySlug(slug);
    if (!page) return { title: "Page Not Found" };

    return {
        title: `${page.crushName} | BlushBuild`,
        description: page.mainMessage.slice(0, 160),
        openGraph: {
            title: `Hey ${page.crushName}, someone has something to tell you 💕`,
            description: page.mainMessage.slice(0, 160),
            url: `https://blush.build/p/${slug}`,
            siteName: "BlushBuild",
            images: [
                {
                    url: "/landing.png",
                    width: 1200,
                    height: 630,
                    alt: "A special message for you",
                },
                {
                    url: "/logo.png",
                    width: 500,
                    height: 500,
                    alt: "BlushBuild Logo",
                },
            ],
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: `Hey ${page.crushName}, someone has something to tell you 💕`,
            description: page.mainMessage.slice(0, 160),
            images: ["/landing.png"],
        },
    };
}

export default async function PublicPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const page = await getPageBySlug(slug);

    if (!page) {
        notFound();
    }

    // Record view
    await recordView(page.id);

    const TEMPLATE_EMOJIS: Record<string, string> = {
        confession: "💖",
        valentine: "💌",
        proposal: "💍",
    };

    const templateEmoji = TEMPLATE_EMOJIS[page.templateType] || "💕";

    const pageData = {
        crushName: page.crushName,
        mainMessage: page.mainMessage,
        subMessage: page.subMessage,
        bgColor: page.bgColor,
        fontStyle: page.fontStyle,
        musicUrl: page.musicUrl,
        successMessage: page.successMessage,
        noButtonStyle: page.noButtonStyle,
        interactiveTwist: page.interactiveTwist,
        unlockType: page.unlockType,
        unlockValue: page.unlockValue,
        captchaImages: page.captchaImages,
        templateEmoji,
        templateType: page.templateType,
        photos: page.photos.map((p) => p.url),
    };

    return <PublicPageClient data={pageData} />;
}
