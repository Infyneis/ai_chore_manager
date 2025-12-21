"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/UserAvatar";
import { Check, Clock, Sparkles, MapPin } from "lucide-react";
import type { Chore, User } from "@/db/schema";

interface ChoreCardProps {
  chore: Chore;
  assignee?: User | null;
  onComplete?: (id: number) => void;
  onGetTips?: (chore: Chore) => void;
  onClick?: () => void;
}

const priorityColors: Record<number, string> = {
  1: "destructive",
  2: "warning",
  3: "secondary",
  4: "outline",
  5: "outline",
};

const priorityLabels: Record<number, string> = {
  1: "Urgent",
  2: "High",
  3: "Medium",
  4: "Low",
  5: "Later",
};

const categoryIcons: Record<string, string> = {
  cleaning: "🧹",
  cooking: "🍳",
  maintenance: "🔧",
  shopping: "🛒",
  other: "📋",
};

export function ChoreCard({
  chore,
  assignee,
  onComplete,
  onGetTips,
  onClick,
}: ChoreCardProps) {
  const isOverdue =
    chore.dueDate && new Date(chore.dueDate) < new Date() && !chore.completed;

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${
        chore.completed ? "opacity-60 bg-muted/50" : ""
      } ${isOverdue ? "border-destructive" : ""}`}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">{categoryIcons[chore.category] || "📋"}</span>
            <CardTitle
              className={`text-base ${chore.completed ? "line-through" : ""}`}
            >
              {chore.title}
            </CardTitle>
          </div>
          <Badge variant={priorityColors[chore.priority] as "default"}>
            {priorityLabels[chore.priority]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {chore.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {chore.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          {chore.dueDate && (
            <div className={`flex items-center gap-1 ${isOverdue ? "text-destructive" : ""}`}>
              <Clock className="h-4 w-4" />
              {new Date(chore.dueDate).toLocaleDateString()}
            </div>
          )}
          {chore.roomLocation && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {chore.roomLocation}
            </div>
          )}
          {chore.estimatedMinutes && (
            <span className="text-xs bg-secondary px-2 py-0.5 rounded">
              ~{chore.estimatedMinutes} min
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            {assignee && (
              <div className="flex items-center gap-2">
                <UserAvatar
                  name={assignee.name}
                  color={assignee.avatarColor}
                  size="sm"
                />
                <span className="text-sm">{assignee.name}</span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {onGetTips && !chore.completed && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onGetTips(chore);
                }}
              >
                <Sparkles className="h-4 w-4" />
              </Button>
            )}
            {onComplete && !chore.completed && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onComplete(chore.id);
                }}
              >
                <Check className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
