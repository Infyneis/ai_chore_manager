import { NextRequest, NextResponse } from "next/server";
import { suggestReassignments, type WorkloadSummary, type ChoreForAI } from "@/lib/ollama";
import { db } from "@/lib/db";
import { chores, users } from "@/db/schema";
import { eq, isNull, and } from "drizzle-orm";

export async function POST() {
  try {
    // Get all users
    const allUsers = await db.select().from(users);

    if (allUsers.length === 0) {
      return NextResponse.json(
        { error: "No users found" },
        { status: 400 }
      );
    }

    // Get all incomplete chores
    const incompleteChores = await db
      .select()
      .from(chores)
      .where(eq(chores.completed, false));

    // Calculate workload per user
    const workloads: WorkloadSummary[] = allUsers.map((user) => {
      const userChores = incompleteChores.filter(
        (c) => c.assignedTo === user.id
      );

      const difficultyBreakdown = {
        easy: userChores.filter((c) => c.difficulty === "easy").length,
        medium: userChores.filter((c) => c.difficulty === "medium").length,
        hard: userChores.filter((c) => c.difficulty === "hard").length,
      };

      const totalMinutes = userChores.reduce(
        (sum, c) => sum + (c.estimatedMinutes || 30),
        0
      );

      return {
        userId: user.id,
        userName: user.name,
        choreCount: userChores.length,
        totalMinutes,
        difficultyBreakdown,
      };
    });

    // Get unassigned chores
    const unassignedChores: ChoreForAI[] = incompleteChores
      .filter((c) => !c.assignedTo)
      .map((c) => ({
        id: c.id,
        title: c.title,
        description: c.description,
        dueDate: c.dueDate,
        priority: c.priority,
        category: c.category,
        estimatedMinutes: c.estimatedMinutes,
        roomLocation: c.roomLocation,
        difficulty: c.difficulty,
        assignedTo: null,
      }));

    const suggestions = await suggestReassignments(workloads, unassignedChores);

    // Apply suggestions
    for (const suggestion of suggestions) {
      await db
        .update(chores)
        .set({ assignedTo: suggestion.suggestedUserId, updatedAt: new Date() })
        .where(eq(chores.id, suggestion.choreId));
    }

    return NextResponse.json({
      suggestions,
      workloads,
      message:
        suggestions.length > 0
          ? `Applied ${suggestions.length} reassignment(s)`
          : "Workload is already balanced",
    });
  } catch (error) {
    console.error("Error reassigning chores:", error);
    return NextResponse.json(
      { error: "Failed to reassign chores. Make sure Ollama is running." },
      { status: 500 }
    );
  }
}
