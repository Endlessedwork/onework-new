import { motion } from "framer-motion";
import { Building2, Hospital, Package } from "lucide-react";

const services = [
  {
    icon: Building2,
    title: "Hotel Amenities",
    description: "Complete amenity solutions for luxury hotels and resorts, customized to your brand identity.",
  },
  {
    icon: Hospital,
    title: "Hospital Supplies",
    description: "Hygienic and comforting care packages designed specifically for healthcare environments.",
  },
  {
    icon: Package,
    title: "OEM Manufacturing",
    description: "Full-service OEM production with flexible minimums and premium quality control.",
  },
];

export function Services() {
  return (
    <section id="services" className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold text-primary mb-4">Our Services</h2>
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
