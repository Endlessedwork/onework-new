import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/home/Hero";
import { TrustSection } from "@/components/home/TrustSection";
import { Services } from "@/components/home/Services";
import { ProductCollection } from "@/components/home/ProductCollection";
import { Footer } from "@/components/layout/Footer";
import { useLanguage } from "@/lib/i18n";
import { Link } from "wouter";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />
      <main>
        <Hero />
        <TrustSection />
        <ProductCollection />
        <Services />
        <section className="py-24 bg-accent/20">
          <div className="container mx-auto px-4 text-center">
             <h2 className="text-4xl font-bold text-primary mb-6">{t('cta.title')}</h2>
             <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
               {t('cta.desc')}
             </p>
             <Link href="/contact">
               <button className="bg-primary text-white px-8 py-4 rounded-full font-medium hover:bg-primary/90 transition-colors shadow-lg">
                 {t('cta.btn')}
               </button>
             </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
