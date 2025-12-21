import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  pinHash: text("pin_hash").notNull(),
  avatarColor: text("avatar_color").notNull().default("#8B5CF6"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const chores = sqliteTable("chores", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: integer("due_date", { mode: "timestamp" }),
  priority: integer("priority").notNull().default(3), // 1-5
  category: text("category").notNull().default("other"), // cleaning, cooking, maintenance, shopping, other
  estimatedMinutes: integer("estimated_minutes"),
  isRecurring: integer("is_recurring", { mode: "boolean" }).notNull().default(false),
  recurrencePattern: text("recurrence_pattern"), // daily, weekly, monthly
  assignedTo: integer("assigned_to").references(() => users.id),
  roomLocation: text("room_location"),
  difficulty: text("difficulty").notNull().default("medium"), // easy, medium, hard
  notes: text("notes"),
  completed: integer("completed", { mode: "boolean" }).notNull().default(false),
  completedAt: integer("completed_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Chore = typeof chores.$inferSelect;
export type NewChore = typeof chores.$inferInsert;
