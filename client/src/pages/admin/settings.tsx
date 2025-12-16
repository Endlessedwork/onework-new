import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { LogOut, ArrowLeft, Save } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Setting } from "@shared/schema";

export default function AdminSettings() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const settingsConfig = [
    {
      key: "site_title_en",
      label: "Site Title (English)",
      description: "Main title displayed on the website",
      type: "text",
    },
    {
      key: "site_title_th",
      label: "Site Title (Thai)",
      description: "Main title in Thai language",
      type: "text",
    },
    {
      key: "contact_email",
      label: "Contact Email",
      description: "Primary contact email address",
      type: "email",
    },
    {
      key: "contact_phone",
      label: "Contact Phone",
      description: "Primary contact phone number",
      type: "text",
    },
    {
      key: "address",
      label: "Address",
      description: "Business address",
      type: "textarea",
    },
    {
      key: "about_en",
      label: "About Us (English)",
      description: "Company description in English",
      type: "textarea",
    },
    {
      key: "about_th",
      label: "About Us (Thai)",
      description: "Company description in Thai",
      type: "textarea",
    },
  ];

  const [formData, setFormData] = useState<Record<string, string>>({});

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

  const { data: settings = [], isLoading } = useQuery<Setting[]>({
    queryKey: ["/api/settings"],
    queryFn: async () => {
      const response = await fetch("/api/settings");
      if (!response.ok) throw new Error("Failed to fetch settings");
      return response.json();
    },
    staleTime: 0,
  });

  useEffect(() => {
    if (settings.length > 0) {
      const data: Record<string, string> = {};
      settings.forEach((setting) => {
        data[setting.key] = setting.value;
      });
      setFormData(data);
    }
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: async ({ key, value, description }: { key: string; value: string; description?: string }) => {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ key, value, description }),
      });
      if (!response.ok) throw new Error("Failed to update setting");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
    },
  });

  const handleSave = async () => {
    try {
      const promises = settingsConfig.map((config) => {
        const value = formData[config.key] || "";
        return updateMutation.mutateAsync({
          key: config.key,
          value,
          description: config.description,
        });
      });

      await Promise.all(promises);
      toast.success("Settings saved successfully");
    } catch (error) {
      toast.error("Failed to save settings");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setLocation("/admin/login");
  };

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
            <h1 className="text-xl font-serif font-bold text-primary">Website Settings</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {isLoading ? (
          <div className="text-center py-12">Loading settings...</div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Site Configuration</CardTitle>
              <CardDescription>
                Update your website settings and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {settingsConfig.map((config) => (
                <div key={config.key} className="space-y-2">
                  <Label htmlFor={config.key}>
                    {config.label}
                    {config.description && (
                      <span className="text-xs text-muted-foreground ml-2">
                        ({config.description})
                      </span>
                    )}
                  </Label>
                  {config.type === "textarea" ? (
                    <Textarea
                      id={config.key}
                      value={formData[config.key] || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, [config.key]: e.target.value })
                      }
                      placeholder={config.label}
                      rows={4}
                    />
                  ) : (
                    <Input
                      id={config.key}
                      type={config.type}
                      value={formData[config.key] || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, [config.key]: e.target.value })
                      }
                      placeholder={config.label}
                    />
                  )}
                </div>
              ))}

              <div className="pt-4">
                <Button
                  onClick={handleSave}
                  disabled={updateMutation.isPending}
                  data-testid="button-save-settings"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {updateMutation.isPending ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
