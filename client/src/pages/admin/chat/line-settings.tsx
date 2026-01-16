import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Copy, ExternalLink, CheckCircle, TestTube, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { LineSettings } from "@shared/schema";

export default function AdminLineSettings() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<Partial<LineSettings>>({
    channelId: "",
    channelSecret: "",
    channelAccessToken: "",
    webhookUrl: "",
    isActive: false,
    autoReplyEnabled: true,
    lineOaUrl: "",
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

  const { data: settings, isLoading } = useQuery<LineSettings>({
    queryKey: ["/api/admin/line/settings"],
    queryFn: async () => {
      const response = await fetch("/api/admin/line/settings", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch");
      return response.json();
    },
  });

  // Update form when settings load
  useEffect(() => {
    if (settings && Object.keys(settings).length > 0) {
      setFormData({
        channelId: settings.channelId || "",
        channelSecret: settings.channelSecret || "",
        channelAccessToken: settings.channelAccessToken || "",
        webhookUrl: settings.webhookUrl || "",
        isActive: settings.isActive || false,
        autoReplyEnabled: settings.autoReplyEnabled ?? true,
        lineOaUrl: settings.lineOaUrl || "",
      });
    }
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<LineSettings>) => {
      const response = await fetch("/api/admin/line/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/line/settings"] });
      toast.success("LINE settings saved");
    },
    onError: () => toast.error("Failed to save settings"),
  });

  const handleSave = () => {
    updateMutation.mutate(formData);
  };

  const testMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/admin/line/test", {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Test failed");
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(`Connection successful! Bot: ${data.botInfo?.displayName || "Unknown"}`);
      } else {
        toast.error(data.error || "Connection failed");
      }
    },
    onError: () => toast.error("Connection test failed"),
  });

  const handleTestConnection = () => {
    testMutation.mutate();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  // Generate webhook URL based on current domain
  const webhookUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/api/webhook/line`
      : "";

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
              <h1 className="text-2xl font-bold text-gray-900">LINE Settings</h1>
              <p className="text-sm text-gray-500">
                Configure LINE Official Account integration
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleTestConnection}
              disabled={testMutation.isPending || !formData.channelAccessToken}
            >
              {testMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <TestTube className="w-4 h-4 mr-2" />
              )}
              Test Connection
            </Button>
            <Button onClick={handleSave} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-3xl mx-auto space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <>
            {/* Status Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>LINE Integration Status</span>
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isActive: checked })
                    }
                  />
                </CardTitle>
                <CardDescription>
                  Enable or disable LINE integration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      formData.isActive ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                  <span className="text-sm">
                    {formData.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Credentials Card */}
            <Card>
              <CardHeader>
                <CardTitle>LINE Channel Credentials</CardTitle>
                <CardDescription>
                  Get these from{" "}
                  <a
                    href="https://developers.line.biz/console/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline"
                  >
                    LINE Developers Console
                    <ExternalLink className="w-3 h-3 inline ml-1" />
                  </a>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Channel ID</Label>
                  <Input
                    value={formData.channelId || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, channelId: e.target.value })
                    }
                    placeholder="1234567890"
                  />
                </div>
                <div>
                  <Label>Channel Secret</Label>
                  <Input
                    type="password"
                    value={formData.channelSecret || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, channelSecret: e.target.value })
                    }
                    placeholder="••••••••••••••••"
                  />
                </div>
                <div>
                  <Label>Channel Access Token</Label>
                  <Input
                    type="password"
                    value={formData.channelAccessToken || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        channelAccessToken: e.target.value,
                      })
                    }
                    placeholder="••••••••••••••••"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Webhook Card */}
            <Card>
              <CardHeader>
                <CardTitle>Webhook Configuration</CardTitle>
                <CardDescription>
                  Copy this URL and paste it in LINE Developers Console
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Webhook URL</Label>
                  <div className="flex gap-2">
                    <Input value={webhookUrl} readOnly className="bg-gray-50" />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(webhookUrl)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Set this URL in LINE Developers Console → Messaging API →
                    Webhook settings
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Settings Card */}
            <Card>
              <CardHeader>
                <CardTitle>Chat Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto Reply with AI</Label>
                    <p className="text-xs text-gray-400">
                      Automatically respond to LINE messages using AI
                    </p>
                  </div>
                  <Switch
                    checked={formData.autoReplyEnabled}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, autoReplyEnabled: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* LINE OA URL Card */}
            <Card>
              <CardHeader>
                <CardTitle>LINE Official Account URL</CardTitle>
                <CardDescription>
                  Share this URL with customers to add your LINE account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <Label>LINE OA URL / Add Friend Link</Label>
                  <Input
                    value={formData.lineOaUrl || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, lineOaUrl: e.target.value })
                    }
                    placeholder="https://line.me/R/ti/p/@xxxxx"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Get this from LINE Official Account Manager → Add Friend →
                    Copy URL
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="bg-blue-50 border-blue-100">
              <CardHeader>
                <CardTitle className="text-blue-900">Setup Instructions</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-blue-800 space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 text-blue-600" />
                  <span>
                    Create a LINE Messaging API channel at{" "}
                    <a
                      href="https://developers.line.biz/console/"
                      target="_blank"
                      className="underline"
                    >
                      LINE Developers
                    </a>
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 text-blue-600" />
                  <span>
                    Copy Channel ID, Channel Secret, and Channel Access Token
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 text-blue-600" />
                  <span>Set the Webhook URL in Messaging API settings</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 text-blue-600" />
                  <span>Enable "Use webhook" and disable auto-reply messages</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 text-blue-600" />
                  <span>Enable integration here and test by sending a message</span>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
