import { NextRequest, NextResponse } from "next/server";
import { prioritizeChores, type ChoreForAI } from "@/lib/ollama";
import { db } from "@/lib/db";
import { chores } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const choresList: ChoreForAI[] = body.chores;

    if (!choresList || !Array.isArray(choresList)) {
      return NextResponse.json(
        { error: "Chores array is required" },
        { status: 400 }
      );
    }

    const orderedIds = await prioritizeChores(choresList);

    // Update priorities based on new order
    for (let i = 0; i < orderedIds.length; i++) {
      const choreId = orderedIds[i];
      // Map position to priority (1-5 scale, lower number = higher priority)
      const newPriority = Math.min(5, Math.max(1, Math.ceil((i + 1) / (orderedIds.length / 5))));

      await db
        .update(chores)
        .set({ priority: newPriority, updatedAt: new Date() })
        .where(eq(chores.id, choreId));
    }

    return NextResponse.json({ orderedIds, message: "Chores prioritized successfully" });
  } catch (error) {
    console.error("Error prioritizing chores:", error);
    return NextResponse.json(
      { error: "Failed to prioritize chores. Make sure Ollama is running." },
      { status: 500 }
    );
  }
}
