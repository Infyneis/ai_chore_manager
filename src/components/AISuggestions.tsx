"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw, Users, ArrowUpDown, Loader2 } from "lucide-react";

interface AISuggestionsProps {
  onPrioritize: () => Promise<void>;
  onReassign: () => Promise<void>;
}

export function AISuggestions({ onPrioritize, onReassign }: AISuggestionsProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const handleAction = async (
    action: () => Promise<void>,
    actionName: string
  ) => {
    setLoading(actionName);
    setResult(null);
    try {
      await action();
      setResult(`${actionName} completed successfully!`);
    } catch {
      setResult(`Failed to ${actionName.toLowerCase()}. Is Ollama running?`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Let AI help you manage your chores more efficiently.
        </p>

        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => handleAction(onPrioritize, "Optimize schedule")}
            disabled={loading !== null}
          >
            {loading === "Optimize schedule" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowUpDown className="h-4 w-4" />
            )}
            Optimize Schedule
          </Button>

          <Button
            variant="outline"
            className="justify-start"
            onClick={() => handleAction(onReassign, "Balance workload")}
            disabled={loading !== null}
          >
            {loading === "Balance workload" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Users className="h-4 w-4" />
            )}
            Balance Workload
          </Button>
        </div>

        {result && (
          <div
            className={`text-sm p-2 rounded ${
              result.includes("Failed")
                ? "bg-destructive/10 text-destructive"
                : "bg-green-500/10 text-green-600"
            }`}
          >
            {result}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
