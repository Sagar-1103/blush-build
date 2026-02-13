"use server";

import { db } from "@/src/db/drizzle";
import { pages, pagePhotos, pageViews, type NewPage } from "@/src/db/schema";
import { eq, desc, count, max, and } from "drizzle-orm";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { getUserFromCookie } from "@/lib/auth";

function generateSlug(crushName: string): string {
    const clean = crushName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 30);
    const id = nanoid(6);
    return `for-${clean}-${id}`;
}

export async function createPage(formData: {
    templateType: string;
    crushName: string;
    mainMessage: string;
    subMessage?: string;
    bgColor: string;
    fontStyle: string;
    musicUrl?: string;
    successMessage: string;
    interactiveTwist: string; // "none" | "runaway"
    unlockType: string; // "none" | "password" | "nickname" | "love-captcha"
    unlockValue?: string;
    photos?: string[];
    captchaImages?: string[];
}) {
    // Require authentication
    const user = await getUserFromCookie();
    if (!user) {
        throw new Error("Authentication required");
    }

    const slug = generateSlug(formData.crushName);

    const [page] = await db
        .insert(pages)
        .values({
            slug,
            userId: user.id,
            templateType: formData.templateType as "confession" | "valentine" | "proposal",
            crushName: formData.crushName,
            mainMessage: formData.mainMessage,
            subMessage: formData.subMessage || null,
            bgColor: formData.bgColor,
            fontStyle: formData.fontStyle,
            musicUrl: formData.musicUrl || null,
            successMessage: formData.successMessage,
            interactiveTwist: formData.interactiveTwist as "none" | "runaway" | "heart-puzzle",
            unlockType: formData.unlockType as "none" | "password" | "nickname" | "love-captcha",
            unlockValue: formData.unlockValue || null,
            captchaImages: formData.unlockType === "love-captcha" ? (formData.captchaImages || null) : null,
            // Keep noButtonStyle for backward compatibility
            noButtonStyle: formData.interactiveTwist === "runaway" ? "runaway" : "sweet-message",
            published: true,
        })
        .returning();

    // Insert photos if provided
    if (formData.photos && formData.photos.length > 0) {
        await db.insert(pagePhotos).values(
            formData.photos.map((url, index) => ({
                pageId: page.id,
                url,
                order: index,
            }))
        );
    }

    revalidatePath("/dashboard");
    return { slug: page.slug, id: page.id };
}

export async function updatePage(
    pageId: string,
    formData: {
        templateType: string;
        crushName: string;
        mainMessage: string;
        subMessage?: string;
        bgColor: string;
        fontStyle: string;
        musicUrl?: string;
        successMessage: string;
        interactiveTwist: string;
        unlockType: string;
        unlockValue?: string;
        photos?: string[];
        captchaImages?: string[];
    }
) {
    // Require authentication and ownership
    const user = await getUserFromCookie();
    if (!user) {
        throw new Error("Authentication required");
    }

    // Verify ownership
    const [existingPage] = await db.select({ userId: pages.userId }).from(pages).where(eq(pages.id, pageId));
    if (!existingPage || (existingPage.userId && existingPage.userId !== user.id)) {
        throw new Error("Not authorized to edit this page");
    }

    await db
        .update(pages)
        .set({
            templateType: formData.templateType as "confession" | "valentine" | "proposal",
            crushName: formData.crushName,
            mainMessage: formData.mainMessage,
            subMessage: formData.subMessage || null,
            bgColor: formData.bgColor,
            fontStyle: formData.fontStyle,
            musicUrl: formData.musicUrl || null,
            successMessage: formData.successMessage,
            interactiveTwist: formData.interactiveTwist as "none" | "runaway" | "heart-puzzle",
            unlockType: formData.unlockType as "none" | "password" | "nickname" | "love-captcha",
            unlockValue: formData.unlockValue || null,
            captchaImages: formData.unlockType === "love-captcha" ? (formData.captchaImages || null) : null,
            // Keep noButtonStyle for backward compatibility
            noButtonStyle: formData.interactiveTwist === "runaway" ? "runaway" : "sweet-message",
            updatedAt: new Date(),
        })
        .where(eq(pages.id, pageId));

    // Update photos
    if (formData.photos) {
        await db.delete(pagePhotos).where(eq(pagePhotos.pageId, pageId));
        if (formData.photos.length > 0) {
            await db.insert(pagePhotos).values(
                formData.photos.map((url, index) => ({
                    pageId,
                    url,
                    order: index,
                }))
            );
        }
    }

    revalidatePath("/dashboard");
    return { success: true };
}

export async function deletePage(pageId: string) {
    // Require authentication and ownership
    const user = await getUserFromCookie();
    if (!user) {
        throw new Error("Authentication required");
    }

    // Verify ownership
    const [existingPage] = await db.select({ userId: pages.userId }).from(pages).where(eq(pages.id, pageId));
    if (!existingPage || (existingPage.userId && existingPage.userId !== user.id)) {
        throw new Error("Not authorized to delete this page");
    }

    await db.delete(pages).where(eq(pages.id, pageId));
    revalidatePath("/dashboard");
    return { success: true };
}

export async function getPages() {
    // Require authentication — only return pages for the current user
    const user = await getUserFromCookie();
    if (!user) {
        return [];
    }

    const result = await db
        .select({
            id: pages.id,
            slug: pages.slug,
            templateType: pages.templateType,
            crushName: pages.crushName,
            mainMessage: pages.mainMessage,
            published: pages.published,
            createdAt: pages.createdAt,
            updatedAt: pages.updatedAt,
            viewCount: count(pageViews.id),
            lastViewed: max(pageViews.viewedAt),
        })
        .from(pages)
        .leftJoin(pageViews, eq(pages.id, pageViews.pageId))
        .where(eq(pages.userId, user.id))
        .groupBy(pages.id)
        .orderBy(desc(pages.createdAt));

    return result;
}

export async function getPage(pageId: string) {
    const [page] = await db.select().from(pages).where(eq(pages.id, pageId));
    if (!page) return null;

    const photos = await db
        .select()
        .from(pagePhotos)
        .where(eq(pagePhotos.pageId, pageId))
        .orderBy(pagePhotos.order);

    return { ...page, photos };
}

export async function getPageBySlug(slug: string) {
    const [page] = await db.select().from(pages).where(eq(pages.slug, slug));
    if (!page) return null;

    const photos = await db
        .select()
        .from(pagePhotos)
        .where(eq(pagePhotos.pageId, page.id))
        .orderBy(pagePhotos.order);

    return { ...page, photos };
}

export async function recordView(pageId: string) {
    await db.insert(pageViews).values({ pageId });
}
