import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { LogOut, ArrowLeft, Save, MessageSquare, Database, Plus, Trash2, Edit2, X, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ChatbotSettings, ChatbotTrainingData } from "@shared/schema";

const AI_MODELS = [
  { value: "gpt-4o", label: "GPT-4o (Recommended)" },
  { value: "gpt-4o-mini", label: "GPT-4o Mini (Faster)" },
  { value: "gpt-5", label: "GPT-5 (Most Advanced)" },
];

export default function AdminChatbot() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("settings");
  
  const [settingsForm, setSettingsForm] = useState({
    modelName: "gpt-4o",
    systemPrompt: "",
    welcomeMessage: "",
    welcomeMessageEn: "",
    isActive: true,
  });

  const [trainingForm, setTrainingForm] = useState({
    category: "",
    question: "",
    answer: "",
    isActive: true,
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

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

  const { data: chatbotSettings, isLoading: settingsLoading } = useQuery<ChatbotSettings>({
    queryKey: ["/api/admin/chatbot/settings"],
    queryFn: async () => {
      const response = await fetch("/api/admin/chatbot/settings", { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch settings");
      return response.json();
    },
    staleTime: 0,
  });

  const { data: trainingData = [], isLoading: trainingLoading } = useQuery<ChatbotTrainingData[]>({
    queryKey: ["/api/admin/chatbot/training"],
    queryFn: async () => {
      const response = await fetch("/api/admin/chatbot/training", { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch training data");
      return response.json();
    },
    staleTime: 0,
  });

  useEffect(() => {
    if (chatbotSettings && chatbotSettings.id) {
      setSettingsForm({
        modelName: chatbotSettings.modelName || "gpt-4o",
        systemPrompt: chatbotSettings.systemPrompt || "",
        welcomeMessage: chatbotSettings.welcomeMessage || "",
        welcomeMessageEn: chatbotSettings.welcomeMessageEn || "",
        isActive: chatbotSettings.isActive ?? true,
      });
    }
  }, [chatbotSettings]);

  const updateSettingsMutation = useMutation({
    mutationFn: async (data: Partial<ChatbotSettings>) => {
      const response = await fetch("/api/admin/chatbot/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update settings");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/chatbot/settings"] });
      toast.success("Chatbot settings saved successfully");
    },
    onError: () => {
      toast.error("Failed to save settings");
    },
  });

  const createTrainingMutation = useMutation({
    mutationFn: async (data: typeof trainingForm) => {
      const response = await fetch("/api/admin/chatbot/training", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create training data");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/chatbot/training"] });
      setDialogOpen(false);
      resetTrainingForm();
      toast.success("Training data added successfully");
    },
    onError: () => {
      toast.error("Failed to add training data");
    },
  });

  const updateTrainingMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<typeof trainingForm> }) => {
      const response = await fetch(`/api/admin/chatbot/training/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update training data");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/chatbot/training"] });
      setEditingId(null);
      setDialogOpen(false);
      resetTrainingForm();
      toast.success("Training data updated successfully");
    },
    onError: () => {
      toast.error("Failed to update training data");
    },
  });

  const deleteTrainingMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/chatbot/training/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to delete training data");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/chatbot/training"] });
      toast.success("Training data deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete training data");
    },
  });

  const resetTrainingForm = () => {
    setTrainingForm({
      category: "",
      question: "",
      answer: "",
      isActive: true,
    });
    setEditingId(null);
  };

  const handleSaveSettings = () => {
    updateSettingsMutation.mutate(settingsForm);
  };

  const handleSaveTraining = () => {
    if (editingId) {
      updateTrainingMutation.mutate({ id: editingId, data: trainingForm });
    } else {
      createTrainingMutation.mutate(trainingForm);
    }
  };

  const handleEditTraining = (item: ChatbotTrainingData) => {
    setEditingId(item.id);
    setTrainingForm({
      category: item.category,
      question: item.question,
      answer: item.answer,
      isActive: item.isActive,
    });
    setDialogOpen(true);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setLocation("/admin/login");
  };

  const categories = Array.from(new Set(trainingData.map(item => item.category)));

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <h1 className="text-xl font-heading font-bold text-primary">AI Chatbot</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 max-w-md">
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Model Settings
            </TabsTrigger>
            <TabsTrigger value="training" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              Training Data
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings">
            {settingsLoading ? (
              <div className="text-center py-12">Loading settings...</div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    AI Model Settings
                  </CardTitle>
                  <CardDescription>Configure the AI chatbot model and behavior</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="modelName">AI Model</Label>
                      <Select
                        value={settingsForm.modelName}
                        onValueChange={(value) => setSettingsForm({ ...settingsForm, modelName: value })}
                      >
                        <SelectTrigger data-testid="select-model">
                          <SelectValue placeholder="Select AI Model" />
                        </SelectTrigger>
                        <SelectContent>
                          {AI_MODELS.map((model) => (
                            <SelectItem key={model.value} value={model.value}>
                              {model.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="isActive">Chatbot Active</Label>
                        <p className="text-sm text-muted-foreground">Enable or disable the chatbot</p>
                      </div>
                      <Switch
                        id="isActive"
                        checked={settingsForm.isActive}
                        onCheckedChange={(checked) => setSettingsForm({ ...settingsForm, isActive: checked })}
                        data-testid="switch-active"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="systemPrompt">System Prompt</Label>
                    <Textarea
                      id="systemPrompt"
                      value={settingsForm.systemPrompt}
                      onChange={(e) => setSettingsForm({ ...settingsForm, systemPrompt: e.target.value })}
                      placeholder="You are a helpful assistant for a hotel amenities supplier..."
                      rows={5}
                      data-testid="input-system-prompt"
                    />
                    <p className="text-sm text-muted-foreground">
                      Instructions for the AI on how to respond. The product catalog is automatically included.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="welcomeMessage">Welcome Message (Thai)</Label>
                      <Textarea
                        id="welcomeMessage"
                        value={settingsForm.welcomeMessage}
                        onChange={(e) => setSettingsForm({ ...settingsForm, welcomeMessage: e.target.value })}
                        placeholder="สวัสดีครับ! ยินดีต้อนรับสู่ Onework..."
                        rows={3}
                        data-testid="input-welcome-th"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="welcomeMessageEn">Welcome Message (English)</Label>
                      <Textarea
                        id="welcomeMessageEn"
                        value={settingsForm.welcomeMessageEn}
                        onChange={(e) => setSettingsForm({ ...settingsForm, welcomeMessageEn: e.target.value })}
                        placeholder="Hello! Welcome to Onework..."
                        rows={3}
                        data-testid="input-welcome-en"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleSaveSettings} disabled={updateSettingsMutation.isPending} data-testid="button-save-settings">
                      <Save className="w-4 h-4 mr-2" />
                      {updateSettingsMutation.isPending ? "Saving..." : "Save Settings"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="training">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Training Data
                  </CardTitle>
                  <CardDescription>Add Q&A pairs to help the AI answer common questions</CardDescription>
                </div>
                <Dialog open={dialogOpen} onOpenChange={(open) => {
                  setDialogOpen(open);
                  if (!open) resetTrainingForm();
                }}>
                  <DialogTrigger asChild>
                    <Button data-testid="button-add-training">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Q&A
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{editingId ? "Edit Training Data" : "Add Training Data"}</DialogTitle>
                      <DialogDescription>
                        Add question and answer pairs to help the AI better respond to customer inquiries.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Input
                          id="category"
                          value={trainingForm.category}
                          onChange={(e) => setTrainingForm({ ...trainingForm, category: e.target.value })}
                          placeholder="e.g., Pricing, Products, Shipping"
                          list="categories"
                          data-testid="input-category"
                        />
                        <datalist id="categories">
                          {categories.map((cat) => (
                            <option key={cat} value={cat} />
                          ))}
                        </datalist>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="question">Question</Label>
                        <Textarea
                          id="question"
                          value={trainingForm.question}
                          onChange={(e) => setTrainingForm({ ...trainingForm, question: e.target.value })}
                          placeholder="What is the minimum order quantity?"
                          rows={2}
                          data-testid="input-question"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="answer">Answer</Label>
                        <Textarea
                          id="answer"
                          value={trainingForm.answer}
                          onChange={(e) => setTrainingForm({ ...trainingForm, answer: e.target.value })}
                          placeholder="Our minimum order quantity is 100 pieces per item..."
                          rows={4}
                          data-testid="input-answer"
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="trainingActive"
                          checked={trainingForm.isActive}
                          onCheckedChange={(checked) => setTrainingForm({ ...trainingForm, isActive: checked })}
                          data-testid="switch-training-active"
                        />
                        <Label htmlFor="trainingActive">Active</Label>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => {
                        setDialogOpen(false);
                        resetTrainingForm();
                      }}>
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleSaveTraining} 
                        disabled={createTrainingMutation.isPending || updateTrainingMutation.isPending}
                        data-testid="button-save-training"
                      >
                        {createTrainingMutation.isPending || updateTrainingMutation.isPending ? "Saving..." : "Save"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {trainingLoading ? (
                  <div className="text-center py-12">Loading training data...</div>
                ) : trainingData.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No training data yet. Add Q&A pairs to help the AI respond better.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[120px]">Category</TableHead>
                        <TableHead>Question</TableHead>
                        <TableHead>Answer</TableHead>
                        <TableHead className="w-[80px]">Active</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {trainingData.map((item) => (
                        <TableRow key={item.id} data-testid={`row-training-${item.id}`}>
                          <TableCell className="font-medium">{item.category}</TableCell>
                          <TableCell className="max-w-[200px] truncate">{item.question}</TableCell>
                          <TableCell className="max-w-[300px] truncate">{item.answer}</TableCell>
                          <TableCell>
                            {item.isActive ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <X className="w-4 h-4 text-gray-400" />
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditTraining(item)}
                                data-testid={`button-edit-${item.id}`}
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  if (confirm("Are you sure you want to delete this training data?")) {
                                    deleteTrainingMutation.mutate(item.id);
                                  }
                                }}
                                data-testid={`button-delete-${item.id}`}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
