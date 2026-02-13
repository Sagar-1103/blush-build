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

        // Find user
        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.username, username.toLowerCase().trim()));

        if (!user) {
            return NextResponse.json(
                { error: "Invalid username or password" },
                { status: 401 }
            );
        }

        // Compare password
        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
            return NextResponse.json(
                { error: "Invalid username or password" },
                { status: 401 }
            );
        }

        // Set JWT cookie
        await setAuthCookie(user.id);

        return NextResponse.json({
            user: { id: user.id, username: user.username },
        });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}
