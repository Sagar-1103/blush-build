import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { db } from "@/src/db/drizzle";
import { users } from "@/src/db/schema";
import { eq } from "drizzle-orm";

const JWT_SECRET = process.env.JWT_SECRET || "blushbuild-dev-secret-change-me";
const COOKIE_NAME = "bb_token";
const TOKEN_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export function signJwt(userId: string): string {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: TOKEN_MAX_AGE });
}

export function verifyJwt(token: string): { userId: string } | null {
    try {
        return jwt.verify(token, JWT_SECRET) as { userId: string };
    } catch {
        return null;
    }
}

export async function setAuthCookie(userId: string) {
    const token = signJwt(userId);
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: TOKEN_MAX_AGE,
        path: "/",
    });
}

export async function clearAuthCookie() {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
}

export async function getUserFromCookie(): Promise<{ id: string; username: string } | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = verifyJwt(token);
    if (!payload) return null;

    const [user] = await db
        .select({ id: users.id, username: users.username })
        .from(users)
        .where(eq(users.id, payload.userId));

    return user || null;
}
