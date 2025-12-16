import { motion } from "framer-motion";
import { Building2, Hospital, Package } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export function Services() {
  const { t } = useLanguage();

  const services = [
    {
      icon: Building2,
      title: t('serv.hotel'),
      description: t('serv.hotel.desc'),
    },
    {
      icon: Hospital,
      title: t('serv.hospital'),
      description: t('serv.hospital.desc'),
    },
    {
      icon: Package,
      title: t('serv.oem'),
      description: t('serv.oem.desc'),
    },
  ];

  return (
    <section id="services" className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold text-primary mb-4">{t('serv.title')}</h2>
          <div className="w-20 h-1 bg-accent mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-sm">
                <service.icon className="w-10 h-10" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-serif font-semibold text-foreground mb-4">
                {service.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed max-w-sm">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
