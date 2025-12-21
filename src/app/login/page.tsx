"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserAvatar } from "@/components/UserAvatar";
import { PinInput } from "@/components/PinInput";
import { Plus, ArrowLeft } from "lucide-react";

interface User {
  id: number;
  name: string;
  avatarColor: string;
}

const AVATAR_COLORS = [
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#3B82F6", // Blue
  "#10B981", // Green
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#6366F1", // Indigo
  "#14B8A6", // Teal
];

export default function LoginPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPin, setNewPin] = useState("");
  const [selectedColor, setSelectedColor] = useState(AVATAR_COLORS[0]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
    checkSession();
  }, []);

  const checkSession = async () => {
    const res = await fetch("/api/auth");
    const data = await res.json();
    if (data.authenticated) {
      router.push("/");
    }
  };

  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data);
  };

  const handlePinSubmit = async (pin: string) => {
    if (!selectedUser) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selectedUser.id, pin }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid PIN");
        setLoading(false);
        return;
      }

      router.push("/");
    } catch {
      setError("Login failed");
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPin || newPin.length < 4) {
      setError("Name and 4-digit PIN are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          pin: newPin,
          avatarColor: selectedColor,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to create user");
        setLoading(false);
        return;
      }

      setNewName("");
      setNewPin("");
      setIsCreating(false);
      fetchUsers();
    } catch {
      setError("Failed to create user");
    }
    setLoading(false);
  };

  if (selectedUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-4 top-4"
              onClick={() => {
                setSelectedUser(null);
                setError("");
              }}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex justify-center mb-4">
              <UserAvatar
                name={selectedUser.name}
                color={selectedUser.avatarColor}
                size="lg"
              />
            </div>
            <CardTitle>Welcome, {selectedUser.name}!</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Enter your PIN to continue
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <PinInput onComplete={handlePinSubmit} disabled={loading} />
            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isCreating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-4 top-4"
              onClick={() => {
                setIsCreating(false);
                setError("");
              }}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-center">Add Family Member</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Enter name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>PIN (4 digits)</Label>
                <Input
                  type="password"
                  value={newPin}
                  onChange={(e) =>
                    setNewPin(e.target.value.replace(/\D/g, "").slice(0, 4))
                  }
                  placeholder="Enter 4-digit PIN"
                  maxLength={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Avatar Color</Label>
                <div className="flex gap-2 flex-wrap">
                  {AVATAR_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-10 h-10 rounded-full transition-transform ${
                        selectedColor === color
                          ? "ring-2 ring-offset-2 ring-primary scale-110"
                          : ""
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                    />
                  ))}
                </div>
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating..." : "Create User"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">AI Chore Manager</CardTitle>
          <p className="text-muted-foreground">Who&apos;s using the app?</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {users.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
                >
                  <UserAvatar
                    name={user.name}
                    color={user.avatarColor}
                    size="lg"
                  />
                  <span className="font-medium">{user.name}</span>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No users yet. Add your first family member!
            </p>
          )}

          <Button
            variant="outline"
            className="w-full"
            onClick={() => setIsCreating(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Family Member
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
