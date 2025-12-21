import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import imgFactory from "@assets/generated_images/modern_clean_factory_production_line.png";
import imgTeam from "@assets/generated_images/professional_team_meeting.png";
import { useLanguage } from "@/lib/i18n";

export default function About() {
  const { t } = useLanguage();

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
              className="text-4xl md:text-6xl font-heading font-bold text-primary mb-6"
            >
              {t('about.title')}
            </motion.h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('about.desc')}
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
              <h2 className="text-3xl font-heading font-bold text-primary">{t('about.vision')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('about.vision.desc1')}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {t('about.vision.desc2')}
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
                <h2 className="text-3xl font-heading font-bold text-primary">{t('about.manufacture')}</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {t('about.manufacture.desc')}
                </p>
                <ul className="space-y-4">
                  {[
                    t('about.list.1'),
                    t('about.list.2'),
                    t('about.list.3'),
                    t('about.list.4')
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
