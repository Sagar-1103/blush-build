import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/src/db/drizzle";
import { users } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { setAuthCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
    try {
        const { username, password } = await request.json();

        // Validate input
        if (!username || !password) {
            return NextResponse.json(
                { error: "Username and password are required" },
                { status: 400 }
            );
        }

        if (username.length < 3 || username.length > 50) {
            return NextResponse.json(
                { error: "Username must be between 3 and 50 characters" },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: "Password must be at least 6 characters" },
                { status: 400 }
            );
        }

        // Check if username already exists
        const [existing] = await db
            .select({ id: users.id })
            .from(users)
            .where(eq(users.username, username.toLowerCase().trim()));

        if (existing) {
            return NextResponse.json(
                { error: "Username already taken" },
                { status: 409 }
            );
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 12);

        // Create user
        const [user] = await db
            .insert(users)
            .values({
                username: username.toLowerCase().trim(),
                passwordHash,
            })
            .returning({ id: users.id, username: users.username });

        // Set JWT cookie
        await setAuthCookie(user.id);

        return NextResponse.json({
            user: { id: user.id, username: user.username },
        });
    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json(
            { error: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}
