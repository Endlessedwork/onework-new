import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Collections", href: "/collections" },
    { name: "Customers", href: "/customers" },
    { name: "Q&A", href: "/faq" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const isHome = location === "/";

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
            <Link key={link.name} href={link.href}>
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
              Get a Quote
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className={cn(
            "md:hidden p-2",
            isScrolled || !isHome ? "text-foreground" : "text-white"
          )}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b shadow-lg p-4 md:hidden flex flex-col gap-4 animate-in slide-in-from-top-5">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href}>
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
              Get a Quote
            </Button>
          </Link>
        </div>
      )}
    </nav>
  );
}
