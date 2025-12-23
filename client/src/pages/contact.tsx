import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import imgOffice from "@assets/generated_images/modern_office_building_exterior.png";
import { useLanguage } from "@/lib/i18n";

export default function Contact() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />
      <main className="pt-24">
        <section className="bg-primary text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">
              {t('contact.title')}
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              {t('contact.desc')}
            </p>
          </div>
        </section>

        <section className="py-20 container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-10"
            >
              <div>
                <h2 className="text-3xl font-heading font-bold text-primary mb-6">{t('contact.info')}</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shrink-0 text-primary">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{t('contact.head')}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        75/5 Moo 6, Soi Tha Sai,<br />
                        Pu Chao Saming Phrai Road,<br />
                        Samrong, Phra Pradaeng,<br />
                        Samut Prakan 10130 Thailand
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shrink-0 text-primary">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{t('contact.phone')}</h3>
                      <p className="text-muted-foreground">
                        06 2862 8877<br />
                        Line ID: @onework
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shrink-0 text-primary">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{t('contact.email')}</h3>
                      <p className="text-muted-foreground">
                        contact@oneworkproduct.com<br />
                        onework.co.th
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shrink-0 text-primary">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{t('contact.hours')}</h3>
                      <p className="text-muted-foreground">
                        {t('contact.hours.desc')}<br />
                        {t('contact.hours.closed')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden shadow-lg h-[300px]">
                <img src={imgOffice} alt="Office Building" className="w-full h-full object-cover" />
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100"
            >
              <h2 className="text-3xl font-heading font-bold text-primary mb-2">{t('contact.form.title')}</h2>
              <p className="text-muted-foreground mb-8">{t('contact.form.desc')}</p>
              
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/80">{t('contact.form.fname')}</label>
                    <Input placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/80">{t('contact.form.lname')}</label>
                    <Input placeholder="Doe" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80">{t('contact.form.email')}</label>
                  <Input type="email" placeholder="john@company.com" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80">{t('contact.form.subject')}</label>
                  <Input placeholder="Product Inquiry" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80">{t('contact.form.message')}</label>
                  <Textarea placeholder="Tell us about your requirements..." className="min-h-[150px]" />
                </div>

                <Button className="w-full rounded-full h-12 text-lg" size="lg">
                  {t('contact.form.send')}
                </Button>
              </form>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
