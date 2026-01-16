import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowLeft, Plus, Edit, Trash2, Zap } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { QuickResponse, InsertQuickResponse } from "@shared/schema";

export default function AdminQuickResponses() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<QuickResponse | null>(null);
  const [formData, setFormData] = useState<Partial<InsertQuickResponse>>({
    title: "",
    content: "",
    category: "",
    shortcut: "",
    isActive: true,
    sortOrder: 0,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me", { credentials: "include" });
      if (!response.ok) setLocation("/admin/login");
    } catch (error) {
      setLocation("/admin/login");
    }
  };

  const { data: quickResponses = [], isLoading } = useQuery<QuickResponse[]>({
    queryKey: ["/api/admin/chat/quick-responses"],
    queryFn: async () => {
      const response = await fetch("/api/admin/chat/quick-responses", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch");
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertQuickResponse) => {
      const response = await fetch("/api/admin/chat/quick-responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/chat/quick-responses"] });
      toast.success("Quick response created");
      resetForm();
    },
    onError: () => toast.error("Failed to create"),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertQuickResponse> }) => {
      const response = await fetch(`/api/admin/chat/quick-responses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/chat/quick-responses"] });
      toast.success("Quick response updated");
      resetForm();
    },
    onError: () => toast.error("Failed to update"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/chat/quick-responses/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to delete");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/chat/quick-responses"] });
      toast.success("Quick response deleted");
    },
    onError: () => toast.error("Failed to delete"),
  });

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      category: "",
      shortcut: "",
      isActive: true,
      sortOrder: 0,
    });
    setEditing(null);
    setDialogOpen(false);
  };

  const handleEdit = (qr: QuickResponse) => {
    setEditing(qr);
    setFormData({
      title: qr.title,
      content: qr.content,
      category: qr.category || "",
      shortcut: qr.shortcut || "",
      isActive: qr.isActive,
      sortOrder: qr.sortOrder,
    });
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.content) {
      toast.error("Title and content are required");
      return;
    }

    if (editing) {
      updateMutation.mutate({ id: editing.id, data: formData });
    } else {
      createMutation.mutate(formData as InsertQuickResponse);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/chat">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quick Responses</h1>
              <p className="text-sm text-gray-500">
                Pre-defined messages for fast replies
              </p>
            </div>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditing(null); resetForm(); }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Response
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editing ? "Edit Quick Response" : "New Quick Response"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g., Greeting"
                  />
                </div>
                <div>
                  <Label>Content</Label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    placeholder="The message content..."
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Category (optional)</Label>
                    <Input
                      value={formData.category || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      placeholder="e.g., greeting, support"
                    />
                  </div>
                  <div>
                    <Label>Shortcut (optional)</Label>
                    <Input
                      value={formData.shortcut || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, shortcut: e.target.value })
                      }
                      placeholder="e.g., /hi"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Label>Active</Label>
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isActive: checked })
                    }
                  />
                </div>
                <Button onClick={handleSubmit} className="w-full">
                  {editing ? "Update" : "Create"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* List */}
      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : quickResponses.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-64 text-center">
              <Zap className="w-12 h-12 text-gray-300 mb-4" />
              <p className="text-lg font-medium text-gray-500">No quick responses</p>
              <p className="text-sm text-gray-400">
                Create quick responses to reply faster
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {quickResponses.map((qr) => (
              <Card key={qr.id} className={!qr.isActive ? "opacity-50" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{qr.title}</h3>
                        {qr.shortcut && (
                          <code className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                            {qr.shortcut}
                          </code>
                        )}
                        {qr.category && (
                          <span className="text-xs text-gray-400">
                            {qr.category}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 whitespace-pre-wrap">
                        {qr.content}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(qr)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600"
                        onClick={() => {
                          if (confirm("Delete this quick response?")) {
                            deleteMutation.mutate(qr.id);
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
