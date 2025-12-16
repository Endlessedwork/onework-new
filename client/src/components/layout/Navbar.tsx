import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Menu, X, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: t('nav.home'), href: "/" },
    { name: t('nav.collections'), href: "/collections" },
    { name: t('nav.customers'), href: "/customers" },
    { name: t('nav.qa'), href: "/faq" },
    { name: t('nav.about'), href: "/about" },
    { name: t('nav.contact'), href: "/contact" },
  ];

  const isHome = location === "/";

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'th' : 'en');
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled || !isHome
          ? "bg-white/80 backdrop-blur-md shadow-sm py-4 border-b border-gray-100"
          : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <a className={cn(
            "text-2xl font-serif font-bold tracking-tight transition-colors",
             isScrolled || !isHome ? "text-primary" : "text-primary md:text-white"
          )}>
            onework<span className="text-accent">.</span>
          </a>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <a
                className={cn(
                  "text-sm font-medium transition-colors hover:text-accent",
                  isScrolled || !isHome ? "text-foreground/80" : "text-white/90"
                )}
              >
                {link.name}
              </a>
            </Link>
          ))}

          {/* Language Switcher */}
          <button 
            onClick={toggleLanguage}
            className={cn(
              "flex items-center gap-1 text-sm font-medium transition-colors hover:text-accent",
               isScrolled || !isHome ? "text-foreground/80" : "text-white/90"
            )}
          >
            <Globe className="w-4 h-4" />
            {language.toUpperCase()}
          </button>

          <Link href="/contact">
            <Button 
              variant="outline" 
              className={cn(
                "rounded-full px-6 transition-all",
                isScrolled || !isHome
                  ? "border-primary/20 hover:bg-primary hover:text-white" 
                  : "border-white/40 text-white hover:bg-white hover:text-primary"
              )}
            >
              {t('nav.quote')}
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <button 
            onClick={toggleLanguage}
            className={cn(
              "flex items-center gap-1 text-sm font-medium",
               isScrolled || !isHome ? "text-foreground" : "text-white"
            )}
          >
            {language.toUpperCase()}
          </button>
          
          <button
            className={cn(
              "p-2",
              isScrolled || !isHome ? "text-foreground" : "text-white"
            )}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b shadow-lg p-4 md:hidden flex flex-col gap-4 animate-in slide-in-from-top-5">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <a
                className="text-lg font-medium text-foreground/80 py-2 border-b border-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            </Link>
          ))}
          <Link href="/contact">
            <Button className="w-full rounded-full bg-primary text-white">
              {t('nav.quote')}
            </Button>
          </Link>
        </div>
      )}
    </nav>
  );
}
