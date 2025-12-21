import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { verifyPin, createSession, getSession, destroySession } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, pin } = body;

    if (!userId || !pin) {
      return NextResponse.json(
        { error: "User ID and PIN are required" },
        { status: 400 }
      );
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, parseInt(userId)),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isValid = await verifyPin(pin, user.pinHash);

    if (!isValid) {
      return NextResponse.json({ error: "Invalid PIN" }, { status: 401 });
    }

    await createSession(user.id);

    const { pinHash, ...safeUser } = user;
    return NextResponse.json({ success: true, user: safeUser });
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const userId = await getSession();

    if (!userId) {
      return NextResponse.json({ authenticated: false });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      return NextResponse.json({ authenticated: false });
    }

    const { pinHash, ...safeUser } = user;
    return NextResponse.json({ authenticated: true, user: safeUser });
  } catch (error) {
    console.error("Error checking session:", error);
    return NextResponse.json({ authenticated: false });
  }
}

export async function DELETE() {
  try {
    await destroySession();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error during logout:", error);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
