"use client";

import { RevealIntro } from "@/components/reveal-intro";
import { UnlockGate } from "@/components/unlock-gate";
import { PageInteractions } from "@/components/interactions";

interface PageData {
    crushName: string;
    mainMessage: string;
    subMessage: string | null;
    bgColor: string;
    fontStyle: string;
    musicUrl: string | null;
    successMessage: string;
    noButtonStyle: string;
    interactiveTwist: string;
    unlockType: string;
    unlockValue: string | null;
    captchaImages: string[] | null;
    templateEmoji: string;
    templateType: string;
    photos: string[];
}

export function PublicPageClient({ data }: { data: PageData }) {
    const showGate = data.unlockType !== "none";

    const content = showGate ? (
        <UnlockGate
            unlockType={data.unlockType}
            unlockValue={data.unlockValue || ""}
            crushName={data.crushName}
            captchaImages={data.captchaImages || undefined}
        >
            <PageInteractions data={data} />
        </UnlockGate>
    ) : (
        <PageInteractions data={data} />
    );

    return <RevealIntro>{content}</RevealIntro>;
}
