import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { LogOut, Package, Settings, Plus, FolderTree, MessageSquare } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setLocation("/admin/login");
      }
    } catch (error) {
      setLocation("/admin/login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      toast.success("Logged out successfully");
      setLocation("/admin/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-heading font-bold text-primary">
              onework<span className="text-accent">.</span> Admin
            </h1>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/admin/products">
                <a className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                  Products
                </a>
              </Link>
              <Link href="/admin/categories">
                <a className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                  Categories
                </a>
              </Link>
              <Link href="/admin/settings">
                <a className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                  Settings
                </a>
              </Link>
              <Link href="/admin/chatbot">
                <a className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                  AI Chatbot
                </a>
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden md:block">
              {user?.username}
            </span>
            <Link href="/">
              <Button variant="outline" size="sm">
                View Site
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-heading font-bold text-primary mb-2">
            Dashboard
          </h2>
          <p className="text-muted-foreground">
            Welcome back, {user?.username}! Manage your website content here.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/admin/products">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                  <Package className="w-6 h-6 text-primary group-hover:text-white" />
                </div>
                <CardTitle>Manage Products</CardTitle>
                <CardDescription>
                  Add, edit, or remove products from your collections
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Go to Products
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/categories">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center mb-4 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  <FolderTree className="w-6 h-6 text-orange-600 group-hover:text-white" />
                </div>
                <CardTitle>Manage Categories</CardTitle>
                <CardDescription>
                  Add, edit, or remove product categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Go to Categories
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/settings">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4 group-hover:bg-accent group-hover:text-white transition-colors">
                  <Settings className="w-6 h-6 text-accent-foreground group-hover:text-white" />
                </div>
                <CardTitle>Website Settings</CardTitle>
                <CardDescription>
                  Configure website content and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Configure Settings
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/chatbot">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <MessageSquare className="w-6 h-6 text-blue-600 group-hover:text-white" />
                </div>
                <CardTitle>AI Chatbot</CardTitle>
                <CardDescription>
                  Configure AI model settings and training data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Manage Chatbot
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  );
}
