import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n";

const customers = [
  "Centara Hotels",
  "Dusit Thani",
  "Marriott",
  "Hilton",
  "Anantara",
  "Sheraton",
  "Hyatt Regency",
  "Shangri-La"
];

export function TrustSection() {
  const { t } = useLanguage();

  return (
    <section className="py-16 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm font-medium text-muted-foreground tracking-widest uppercase mb-8">
          {t('trust.title')}
        </p>
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          {/* In a real project, these would be logos. Using text for mockup. */}
          {customers.map((customer, i) => (
             <h3 key={i} className="text-xl md:text-2xl font-serif font-bold text-gray-400 hover:text-primary transition-colors cursor-default">
               {customer}
             </h3>
          ))}
        </div>
      </div>
    </section>
  );
}
