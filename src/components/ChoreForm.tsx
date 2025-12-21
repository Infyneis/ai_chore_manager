"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Chore, User, NewChore } from "@/db/schema";

interface ChoreFormProps {
  chore?: Chore;
  users: User[];
  onSubmit: (data: NewChore) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ChoreForm({
  chore,
  users,
  onSubmit,
  onCancel,
  isLoading,
}: ChoreFormProps) {
  const [formData, setFormData] = useState<NewChore>({
    title: chore?.title || "",
    description: chore?.description || "",
    dueDate: chore?.dueDate || undefined,
    priority: chore?.priority || 3,
    category: chore?.category || "other",
    estimatedMinutes: chore?.estimatedMinutes || undefined,
    isRecurring: chore?.isRecurring || false,
    recurrencePattern: chore?.recurrencePattern || undefined,
    assignedTo: chore?.assignedTo || undefined,
    roomLocation: chore?.roomLocation || "",
    difficulty: chore?.difficulty || "medium",
    notes: chore?.notes || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          placeholder="e.g., Clean the kitchen"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description || ""}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Add details..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date</Label>
          <Input
            id="dueDate"
            type="date"
            value={
              formData.dueDate
                ? new Date(formData.dueDate).toISOString().split("T")[0]
                : ""
            }
            onChange={(e) =>
              setFormData({
                ...formData,
                dueDate: e.target.value ? new Date(e.target.value) : undefined,
              })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select
            value={String(formData.priority)}
            onValueChange={(v) =>
              setFormData({ ...formData, priority: parseInt(v) })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 - Urgent</SelectItem>
              <SelectItem value="2">2 - High</SelectItem>
              <SelectItem value="3">3 - Medium</SelectItem>
              <SelectItem value="4">4 - Low</SelectItem>
              <SelectItem value="5">5 - Later</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(v) => setFormData({ ...formData, category: v })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cleaning">Cleaning</SelectItem>
              <SelectItem value="cooking">Cooking</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="shopping">Shopping</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="difficulty">Difficulty</Label>
          <Select
            value={formData.difficulty}
            onValueChange={(v) => setFormData({ ...formData, difficulty: v })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="assignedTo">Assign To</Label>
          <Select
            value={formData.assignedTo ? String(formData.assignedTo) : "none"}
            onValueChange={(v) =>
              setFormData({
                ...formData,
                assignedTo: v === "none" ? undefined : parseInt(v),
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Unassigned" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Unassigned</SelectItem>
              {users.map((user) => (
                <SelectItem key={user.id} value={String(user.id)}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="estimatedMinutes">Est. Time (min)</Label>
          <Input
            id="estimatedMinutes"
            type="number"
            min="1"
            value={formData.estimatedMinutes || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                estimatedMinutes: e.target.value
                  ? parseInt(e.target.value)
                  : undefined,
              })
            }
            placeholder="30"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="roomLocation">Room / Location</Label>
        <Input
          id="roomLocation"
          value={formData.roomLocation || ""}
          onChange={(e) =>
            setFormData({ ...formData, roomLocation: e.target.value })
          }
          placeholder="e.g., Kitchen, Living Room"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes || ""}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Additional notes..."
          rows={2}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? "Saving..." : chore ? "Update Chore" : "Create Chore"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
