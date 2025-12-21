import { Ollama } from "ollama";

const ollama = new Ollama({ host: "http://localhost:11434" });

export interface ChoreForAI {
  id: number;
  title: string;
  description: string | null;
  dueDate: Date | null;
  priority: number;
  category: string;
  estimatedMinutes: number | null;
  roomLocation: string | null;
  difficulty: string;
  assignedTo: string | null;
}

export interface WorkloadSummary {
  userId: number;
  userName: string;
  choreCount: number;
  totalMinutes: number;
  difficultyBreakdown: {
    easy: number;
    medium: number;
    hard: number;
  };
}

export async function getChoresTips(chore: ChoreForAI): Promise<string> {
  const prompt = `You are a helpful household assistant. Given this chore:
Title: ${chore.title}
Description: ${chore.description || "No description"}
Room: ${chore.roomLocation || "Not specified"}
Difficulty: ${chore.difficulty}
Category: ${chore.category}
Estimated time: ${chore.estimatedMinutes ? `${chore.estimatedMinutes} minutes` : "Not specified"}

Provide 2-3 brief, practical tips to complete this chore efficiently. Be concise and actionable.`;

  try {
    const response = await ollama.generate({
      model: "llama3.2",
      prompt,
      stream: false,
    });
    return response.response;
  } catch (error) {
    console.error("Ollama error:", error);
    throw new Error("Failed to get AI tips. Make sure Ollama is running.");
  }
}

export async function prioritizeChores(chores: ChoreForAI[]): Promise<number[]> {
  const choresList = chores.map((c) => ({
    id: c.id,
    title: c.title,
    dueDate: c.dueDate?.toISOString().split("T")[0] || "no due date",
    priority: c.priority,
    category: c.category,
    room: c.roomLocation || "unspecified",
    estimatedMinutes: c.estimatedMinutes || 30,
  }));

  const prompt = `You are organizing household chores. Given these chores:
${JSON.stringify(choresList, null, 2)}

Reorder them in the most logical sequence considering:
- Urgency (due dates - earlier is more urgent)
- Priority level (1 is highest, 5 is lowest)
- Dependencies (e.g., shopping before cooking)
- Efficiency (group by room/type when possible)

Return ONLY a JSON array of chore IDs in optimal order, nothing else. Example: [3, 1, 5, 2, 4]`;

  try {
    const response = await ollama.generate({
      model: "llama3.2",
      prompt,
      stream: false,
    });

    const match = response.response.match(/\[[\d,\s]+\]/);
    if (match) {
      return JSON.parse(match[0]);
    }
    return chores.map((c) => c.id);
  } catch (error) {
    console.error("Ollama error:", error);
    throw new Error("Failed to prioritize chores. Make sure Ollama is running.");
  }
}

export async function suggestReassignments(
  workloads: WorkloadSummary[],
  unassignedChores: ChoreForAI[]
): Promise<{ choreId: number; suggestedUserId: number; reason: string }[]> {
  const prompt = `You are balancing household chores among family members.

Current workload by person:
${workloads
  .map(
    (w) =>
      `- ${w.userName}: ${w.choreCount} chores, ~${w.totalMinutes} mins total (Easy: ${w.difficultyBreakdown.easy}, Medium: ${w.difficultyBreakdown.medium}, Hard: ${w.difficultyBreakdown.hard})`
  )
  .join("\n")}

${
  unassignedChores.length > 0
    ? `Unassigned chores that need assignment:
${unassignedChores.map((c) => `- ID ${c.id}: "${c.title}" (${c.difficulty}, ~${c.estimatedMinutes || 30} mins)`).join("\n")}`
    : "All chores are assigned."
}

Suggest reassignments to balance the workload fairly. Consider difficulty and time.
Return ONLY a JSON array of suggestions. Example:
[{"choreId": 5, "suggestedUserId": 2, "reason": "User 2 has fewer hard chores"}]

If workload is already balanced, return an empty array: []`;

  try {
    const response = await ollama.generate({
      model: "llama3.2",
      prompt,
      stream: false,
    });

    const match = response.response.match(/\[[\s\S]*?\]/);
    if (match) {
      return JSON.parse(match[0]);
    }
    return [];
  } catch (error) {
    console.error("Ollama error:", error);
    throw new Error("Failed to get reassignment suggestions. Make sure Ollama is running.");
  }
}
