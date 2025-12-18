import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { LogOut, ArrowLeft, Save, Building2, Share2, Briefcase, Search, Palette } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Setting } from "@shared/schema";

interface SettingConfig {
  key: string;
  label: string;
  description?: string;
  type: "text" | "email" | "textarea" | "url";
  placeholder?: string;
}

interface SettingSection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  settings: SettingConfig[];
}

const settingsSections: SettingSection[] = [
  {
    id: "company",
    title: "Company Info",
    description: "Basic company information and contact details",
    icon: <Building2 className="w-4 h-4" />,
    settings: [
      { key: "site_title_en", label: "Site Title (English)", type: "text", placeholder: "onework - Premium Hotel Amenities" },
      { key: "site_title_th", label: "Site Title (Thai)", type: "text", placeholder: "onework - อุปกรณ์อำนวยความสะดวกโรงแรม" },
      { key: "contact_email", label: "Contact Email", type: "email", placeholder: "info@onework.co.th" },
      { key: "contact_phone", label: "Contact Phone", type: "text", placeholder: "+66 2 123 4567" },
      { key: "whatsapp", label: "WhatsApp Number", type: "text", placeholder: "+66812345678" },
      { key: "line_id", label: "LINE ID", type: "text", placeholder: "@onework" },
      { key: "address_en", label: "Address (English)", type: "textarea", placeholder: "123 Business District, Bangkok 10110, Thailand" },
      { key: "address_th", label: "Address (Thai)", type: "textarea", placeholder: "123 ย่านธุรกิจ กรุงเทพฯ 10110" },
      { key: "about_en", label: "About Us (English)", type: "textarea", placeholder: "Company description in English..." },
      { key: "about_th", label: "About Us (Thai)", type: "textarea", placeholder: "รายละเอียดบริษัทภาษาไทย..." },
    ],
  },
  {
    id: "social",
    title: "Social Media",
    description: "Social media profiles and links",
    icon: <Share2 className="w-4 h-4" />,
    settings: [
      { key: "facebook_url", label: "Facebook Page URL", type: "url", placeholder: "https://facebook.com/onework" },
      { key: "instagram_url", label: "Instagram URL", type: "url", placeholder: "https://instagram.com/onework" },
      { key: "linkedin_url", label: "LinkedIn URL", type: "url", placeholder: "https://linkedin.com/company/onework" },
      { key: "youtube_url", label: "YouTube URL", type: "url", placeholder: "https://youtube.com/@onework" },
      { key: "twitter_url", label: "Twitter/X URL", type: "url", placeholder: "https://x.com/onework" },
    ],
  },
  {
    id: "business",
    title: "Business Info",
    description: "Business hours, terms, and operational details",
    icon: <Briefcase className="w-4 h-4" />,
    settings: [
      { key: "business_hours_en", label: "Business Hours (English)", type: "text", placeholder: "Mon-Fri: 9:00 AM - 6:00 PM" },
      { key: "business_hours_th", label: "Business Hours (Thai)", type: "text", placeholder: "จันทร์-ศุกร์: 9:00 - 18:00 น." },
      { key: "minimum_order", label: "Minimum Order Quantity (MOQ)", type: "text", placeholder: "100 pieces per item" },
      { key: "payment_terms_en", label: "Payment Terms (English)", type: "textarea", placeholder: "50% deposit, 50% before delivery" },
      { key: "payment_terms_th", label: "Payment Terms (Thai)", type: "textarea", placeholder: "มัดจำ 50%, ชำระส่วนที่เหลือก่อนส่งสินค้า" },
      { key: "shipping_info_en", label: "Shipping Information (English)", type: "textarea", placeholder: "Free shipping for orders over..." },
      { key: "shipping_info_th", label: "Shipping Information (Thai)", type: "textarea", placeholder: "ส่งฟรีสำหรับคำสั่งซื้อ..." },
      { key: "warranty_en", label: "Warranty Policy (English)", type: "textarea", placeholder: "Product warranty details..." },
      { key: "warranty_th", label: "Warranty Policy (Thai)", type: "textarea", placeholder: "รายละเอียดการรับประกัน..." },
    ],
  },
  {
    id: "seo",
    title: "SEO & Marketing",
    description: "Search engine optimization and marketing settings",
    icon: <Search className="w-4 h-4" />,
    settings: [
      { key: "meta_title_en", label: "Meta Title (English)", type: "text", placeholder: "onework | Premium Hotel Amenities & Supplies" },
      { key: "meta_title_th", label: "Meta Title (Thai)", type: "text", placeholder: "onework | อุปกรณ์อำนวยความสะดวกโรงแรมพรีเมียม" },
      { key: "meta_description_en", label: "Meta Description (English)", type: "textarea", placeholder: "Leading supplier of premium hotel amenities..." },
      { key: "meta_description_th", label: "Meta Description (Thai)", type: "textarea", placeholder: "ผู้นำด้านอุปกรณ์โรงแรมพรีเมียม..." },
      { key: "keywords_en", label: "Keywords (English)", type: "text", placeholder: "hotel amenities, bathroom supplies, toiletries" },
      { key: "keywords_th", label: "Keywords (Thai)", type: "text", placeholder: "อุปกรณ์โรงแรม, ของใช้ห้องน้ำ, อเมนิตี้" },
      { key: "google_analytics_id", label: "Google Analytics ID", type: "text", placeholder: "G-XXXXXXXXXX" },
    ],
  },
  {
    id: "branding",
    title: "Branding",
    description: "Logo, favicon, and brand assets",
    icon: <Palette className="w-4 h-4" />,
    settings: [
      { key: "logo_url", label: "Logo URL", type: "url", placeholder: "/images/logo.png" },
      { key: "logo_dark_url", label: "Dark Logo URL", type: "url", placeholder: "/images/logo-dark.png" },
      { key: "favicon_url", label: "Favicon URL", type: "url", placeholder: "/favicon.ico" },
      { key: "primary_color", label: "Primary Color", type: "text", placeholder: "#6B8E6F" },
      { key: "secondary_color", label: "Secondary Color", type: "text", placeholder: "#F5F0E8" },
      { key: "tagline_en", label: "Tagline (English)", type: "text", placeholder: "Elevate Your Guest Experience" },
      { key: "tagline_th", label: "Tagline (Thai)", type: "text", placeholder: "ยกระดับประสบการณ์แขกของคุณ" },
    ],
  },
];

export default function AdminSettings() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState("company");

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
      const allSettings = settingsSections.flatMap((section) => section.settings);
      const promises = allSettings.map((config) => {
        const value = formData[config.key] || "";
        return updateMutation.mutateAsync({
          key: config.key,
          value,
          description: config.label,
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

  const renderSettingField = (config: SettingConfig) => {
    const commonProps = {
      id: config.key,
      value: formData[config.key] || "",
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setFormData({ ...formData, [config.key]: e.target.value }),
      placeholder: config.placeholder || config.label,
    };

    if (config.type === "textarea") {
      return <Textarea {...commonProps} rows={3} />;
    }
    return <Input {...commonProps} type={config.type} />;
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
          <div className="flex items-center gap-2">
            <Button
              onClick={handleSave}
              disabled={updateMutation.isPending}
              data-testid="button-save-settings"
            >
              <Save className="w-4 h-4 mr-2" />
              {updateMutation.isPending ? "Saving..." : "Save All"}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="text-center py-12">Loading settings...</div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8">
              {settingsSections.map((section) => (
                <TabsTrigger key={section.id} value={section.id} className="flex items-center gap-2">
                  {section.icon}
                  <span className="hidden md:inline">{section.title}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {settingsSections.map((section) => (
              <TabsContent key={section.id} value={section.id}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {section.icon}
                      {section.title}
                    </CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {section.settings.map((config) => (
                        <div
                          key={config.key}
                          className={config.type === "textarea" ? "md:col-span-2" : ""}
                        >
                          <Label htmlFor={config.key} className="mb-2 block">
                            {config.label}
                          </Label>
                          {renderSettingField(config)}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </main>
    </div>
  );
}
