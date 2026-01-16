import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/lib/i18n";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import About from "@/pages/about";
import Collections from "@/pages/collections";
import FAQ from "@/pages/faq";
import Contact from "@/pages/contact";
import Customers from "@/pages/customers";
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminProducts from "@/pages/admin/products";
import AdminCategories from "@/pages/admin/categories";
import AdminSettings from "@/pages/admin/settings";
import AdminChatbot from "@/pages/admin/chatbot";
import AdminIndex from "@/pages/admin/index";
import AdminChatDashboard from "@/pages/admin/chat/index";
import AdminChatDetail from "@/pages/admin/chat/detail";
import AdminQuickResponses from "@/pages/admin/chat/quick-responses";
import AdminLineSettings from "@/pages/admin/chat/line-settings";
import Chatbot from "@/components/Chatbot";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/collections" component={Collections} />
      <Route path="/faq" component={FAQ} />
      <Route path="/contact" component={Contact} />
      <Route path="/customers" component={Customers} />
      
      {/* Admin routes */}
      <Route path="/admin" component={AdminIndex} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/products" component={AdminProducts} />
      <Route path="/admin/categories" component={AdminCategories} />
      <Route path="/admin/settings" component={AdminSettings} />
      <Route path="/admin/chatbot" component={AdminChatbot} />
      <Route path="/admin/chat" component={AdminChatDashboard} />
      <Route path="/admin/chat/:id" component={AdminChatDetail} />
      <Route path="/admin/chat/quick-responses" component={AdminQuickResponses} />
      <Route path="/admin/chat/line-settings" component={AdminLineSettings} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <LanguageProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
          <Chatbot />
        </TooltipProvider>
      </QueryClientProvider>
    </LanguageProvider>
  );
}

export default App;
