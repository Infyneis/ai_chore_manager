"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChoreCard } from "@/components/ChoreCard";
import { ChoreForm } from "@/components/ChoreForm";
import { AISuggestions } from "@/components/AISuggestions";
import { UserAvatar } from "@/components/UserAvatar";
import { Plus, LogOut, Sparkles, Loader2, Users } from "lucide-react";
import type { Chore, User, NewChore } from "@/db/schema";

interface AuthResponse {
  authenticated: boolean;
  user?: User;
}

export default function Dashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [chores, setChores] = useState<Chore[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showTipsDialog, setShowTipsDialog] = useState(false);
  const [selectedChore, setSelectedChore] = useState<Chore | null>(null);
  const [tips, setTips] = useState<string>("");
  const [tipsLoading, setTipsLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [authRes, usersRes, choresRes] = await Promise.all([
        fetch("/api/auth"),
        fetch("/api/users"),
        fetch("/api/chores"),
      ]);

      const authData: AuthResponse = await authRes.json();
      if (!authData.authenticated) {
        router.push("/login");
        return;
      }

      setCurrentUser(authData.user || null);
      setUsers(await usersRes.json());
      setChores(await choresRes.json());
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/login");
  };

  const handleCreateChore = async (data: NewChore) => {
    try {
      const res = await fetch("/api/chores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setShowCreateDialog(false);
        fetchData();
      }
    } catch (error) {
      console.error("Error creating chore:", error);
    }
  };

  const handleCompleteChore = async (id: number) => {
    try {
      await fetch("/api/chores", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, completed: true }),
      });
      fetchData();
    } catch (error) {
      console.error("Error completing chore:", error);
    }
  };

  const handleGetTips = async (chore: Chore) => {
    setSelectedChore(chore);
    setShowTipsDialog(true);
    setTipsLoading(true);
    setTips("");

    try {
      const assignee = users.find((u) => u.id === chore.assignedTo);
      const res = await fetch("/api/ai/tips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chore: {
            id: chore.id,
            title: chore.title,
            description: chore.description,
            dueDate: chore.dueDate,
            priority: chore.priority,
            category: chore.category,
            estimatedMinutes: chore.estimatedMinutes,
            roomLocation: chore.roomLocation,
            difficulty: chore.difficulty,
            assignedTo: assignee?.name || null,
          },
        }),
      });

      const data = await res.json();
      setTips(data.tips || data.error);
    } catch {
      setTips("Failed to get tips. Make sure Ollama is running.");
    } finally {
      setTipsLoading(false);
    }
  };

  const handlePrioritize = async () => {
    const incompleteChores = chores.filter((c) => !c.completed);
    const choresForAI = incompleteChores.map((c) => {
      const assignee = users.find((u) => u.id === c.assignedTo);
      return {
        id: c.id,
        title: c.title,
        description: c.description,
        dueDate: c.dueDate,
        priority: c.priority,
        category: c.category,
        estimatedMinutes: c.estimatedMinutes,
        roomLocation: c.roomLocation,
        difficulty: c.difficulty,
        assignedTo: assignee?.name || null,
      };
    });

    await fetch("/api/ai/prioritize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chores: choresForAI }),
    });

    fetchData();
  };

  const handleReassign = async () => {
    await fetch("/api/ai/reassign", { method: "POST" });
    fetchData();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const incompleteChores = chores.filter((c) => !c.completed);
  const completedChores = chores.filter((c) => c.completed);
  const myChores = incompleteChores.filter(
    (c) => c.assignedTo === currentUser?.id
  );
  const todayChores = incompleteChores.filter((c) => {
    if (!c.dueDate) return false;
    const today = new Date();
    const dueDate = new Date(c.dueDate);
    return dueDate.toDateString() === today.toDateString();
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">AI Chore Manager</h1>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/users")}>
              <Users className="h-4 w-4 mr-2" />
              Manage Users
            </Button>
            {currentUser && (
              <div className="flex items-center gap-2">
                <UserAvatar
                  name={currentUser.name}
                  color={currentUser.avatarColor}
                  size="sm"
                />
                <span className="text-sm font-medium">{currentUser.name}</span>
              </div>
            )}
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-primary">
                    {myChores.length}
                  </div>
                  <p className="text-sm text-muted-foreground">My Chores</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-amber-500">
                    {todayChores.length}
                  </div>
                  <p className="text-sm text-muted-foreground">Due Today</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-green-500">
                    {completedChores.length}
                  </div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </CardContent>
              </Card>
            </div>

            {/* Add Chore Button */}
            <Button onClick={() => setShowCreateDialog(true)} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add New Chore
            </Button>

            {/* Chore List */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">All Chores</h2>
              {incompleteChores.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No chores yet. Add your first one!
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {incompleteChores.map((chore) => (
                    <ChoreCard
                      key={chore.id}
                      chore={chore}
                      assignee={users.find((u) => u.id === chore.assignedTo)}
                      onComplete={handleCompleteChore}
                      onGetTips={handleGetTips}
                    />
                  ))}
                </div>
              )}

              {completedChores.length > 0 && (
                <>
                  <h2 className="text-lg font-semibold mt-8">Completed</h2>
                  <div className="grid gap-4">
                    {completedChores.slice(0, 5).map((chore) => (
                      <ChoreCard
                        key={chore.id}
                        chore={chore}
                        assignee={users.find((u) => u.id === chore.assignedTo)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <AISuggestions
              onPrioritize={handlePrioritize}
              onReassign={handleReassign}
            />

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Family Members</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {users.map((user) => {
                  const userChoreCount = incompleteChores.filter(
                    (c) => c.assignedTo === user.id
                  ).length;
                  return (
                    <div
                      key={user.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <UserAvatar
                          name={user.name}
                          color={user.avatarColor}
                          size="sm"
                        />
                        <span className="text-sm">{user.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {userChoreCount} chores
                      </span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Create Chore Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Chore</DialogTitle>
          </DialogHeader>
          <ChoreForm
            users={users}
            onSubmit={handleCreateChore}
            onCancel={() => setShowCreateDialog(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Tips Dialog */}
      <Dialog open={showTipsDialog} onOpenChange={setShowTipsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Tips for &quot;{selectedChore?.title}&quot;
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {tipsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
              <div className="text-sm leading-relaxed space-y-2">
                {tips.split('\n').map((line, i) => (
                  <p key={i}>
                    {line.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
                      part.startsWith('**') && part.endsWith('**') ? (
                        <strong key={j} className="font-semibold text-primary">
                          {part.slice(2, -2)}
                        </strong>
                      ) : (
                        <span key={j}>{part}</span>
                      )
                    )}
                  </p>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
