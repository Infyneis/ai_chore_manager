import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { chores } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const completed = searchParams.get("completed");

    let query = db.select().from(chores);

    if (userId) {
      const allChores = await db
        .select()
        .from(chores)
        .where(eq(chores.assignedTo, parseInt(userId)))
        .orderBy(desc(chores.priority), chores.dueDate);
      return NextResponse.json(allChores);
    }

    if (completed !== null) {
      const allChores = await db
        .select()
        .from(chores)
        .where(eq(chores.completed, completed === "true"))
        .orderBy(desc(chores.priority), chores.dueDate);
      return NextResponse.json(allChores);
    }

    const allChores = await db
      .select()
      .from(chores)
      .orderBy(chores.completed, desc(chores.priority), chores.dueDate);

    return NextResponse.json(allChores);
  } catch (error) {
    console.error("Error fetching chores:", error);
    return NextResponse.json(
      { error: "Failed to fetch chores" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const [newChore] = await db
      .insert(chores)
      .values({
        title: body.title,
        description: body.description || null,
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        priority: body.priority || 3,
        category: body.category || "other",
        estimatedMinutes: body.estimatedMinutes || null,
        isRecurring: body.isRecurring || false,
        recurrencePattern: body.recurrencePattern || null,
        assignedTo: body.assignedTo || null,
        roomLocation: body.roomLocation || null,
        difficulty: body.difficulty || "medium",
        notes: body.notes || null,
      })
      .returning();

    return NextResponse.json(newChore, { status: 201 });
  } catch (error) {
    console.error("Error creating chore:", error);
    return NextResponse.json(
      { error: "Failed to create chore" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Chore ID is required" },
        { status: 400 }
      );
    }

    // Handle date conversion
    if (updates.dueDate) {
      updates.dueDate = new Date(updates.dueDate);
    }

    // Handle completion
    if (updates.completed && !updates.completedAt) {
      updates.completedAt = new Date();
    }

    updates.updatedAt = new Date();

    const [updatedChore] = await db
      .update(chores)
      .set(updates)
      .where(eq(chores.id, parseInt(id)))
      .returning();

    if (!updatedChore) {
      return NextResponse.json({ error: "Chore not found" }, { status: 404 });
    }

    return NextResponse.json(updatedChore);
  } catch (error) {
    console.error("Error updating chore:", error);
    return NextResponse.json(
      { error: "Failed to update chore" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Chore ID is required" },
        { status: 400 }
      );
    }

    await db.delete(chores).where(eq(chores.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting chore:", error);
    return NextResponse.json(
      { error: "Failed to delete chore" },
      { status: 500 }
    );
  }
}
