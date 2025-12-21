import { NextRequest, NextResponse } from "next/server";
import { getChoresTips, type ChoreForAI } from "@/lib/ollama";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const chore: ChoreForAI = body.chore;

    if (!chore) {
      return NextResponse.json(
        { error: "Chore data is required" },
        { status: 400 }
      );
    }

    const tips = await getChoresTips(chore);
    return NextResponse.json({ tips });
  } catch (error) {
    console.error("Error getting AI tips:", error);
    return NextResponse.json(
      { error: "Failed to get AI tips. Make sure Ollama is running." },
      { status: 500 }
    );
  }
}
