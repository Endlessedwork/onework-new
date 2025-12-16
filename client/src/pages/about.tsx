import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import imgFactory from "@assets/generated_images/modern_clean_factory_production_line.png";
import imgTeam from "@assets/generated_images/professional_team_meeting.png";

export default function About() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />
      <main className="pt-24">
        {/* Header */}
        <section className="bg-secondary/30 py-20">
          <div className="container mx-auto px-4 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-serif font-bold text-primary mb-6"
            >
              Our Story
            </motion.h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Dedicated to elevating the hospitality experience through exceptional quality and sustainable design since 2010.
            </p>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="py-20 container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img 
                src={imgTeam} 
                alt="Our Team" 
                className="rounded-2xl shadow-xl w-full h-[400px] object-cover"
              />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-serif font-bold text-primary">Vision & Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                At Onework, we believe that every detail counts. Our mission is to provide hotels and resorts with amenities that not only meet the highest standards of hygiene and quality but also create memorable experiences for guests.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We are committed to sustainability, innovation, and design excellence. We work closely with our partners to create bespoke solutions that reflect their unique brand identity.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Manufacturing */}
        <section className="py-20 bg-stone-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center md:flex-row-reverse">
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="order-first md:order-last"
              >
                <img 
                  src={imgFactory} 
                  alt="Manufacturing" 
                  className="rounded-2xl shadow-xl w-full h-[400px] object-cover"
                />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <h2 className="text-3xl font-serif font-bold text-primary">Manufacturing Excellence</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Our state-of-the-art manufacturing facilities adhere to strict GMP (Good Manufacturing Practice) standards. We control every step of the process to ensure consistency and safety.
                </p>
                <ul className="space-y-4">
                  {[
                    "GMP Certified Facilities",
                    "Eco-friendly Production Processes",
                    "Strict Quality Control (QC)",
                    "Sustainable Material Sourcing"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-foreground/80">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
