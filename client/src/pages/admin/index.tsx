import { useEffect } from "react";
import { useLocation } from "wouter";

export default function AdminIndex() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    checkAuthAndRedirect();
  }, []);

  const checkAuthAndRedirect = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      });

      if (response.ok) {
        // User is logged in, go to dashboard
        setLocation("/admin/dashboard");
      } else {
        // Not logged in, go to login page
        setLocation("/admin/login");
      }
    } catch (error) {
      // Error checking auth, go to login
      setLocation("/admin/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-lg text-muted-foreground">Redirecting...</div>
    </div>
  );
}
