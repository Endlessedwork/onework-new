import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export default function FAQ() {
  const { t } = useLanguage();

  const faqs = [
    {
      question: t('faq.q1'),
      answer: t('faq.a1')
    },
    {
      question: t('faq.q2'),
      answer: t('faq.a2')
    },
    {
      question: t('faq.q3'),
      answer: t('faq.a3')
    },
    {
      question: t('faq.q4'),
      answer: t('faq.a4')
    },
    {
      question: t('faq.q5'),
      answer: t('faq.a5')
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />
      <main className="pt-24">
        <section className="bg-secondary/30 py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-primary mb-6">
              {t('faq.title')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('faq.desc')}
            </p>
          </div>
        </section>

        <section className="py-20 container mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-100 py-2">
                  <AccordionTrigger className="text-left text-lg font-medium text-foreground hover:text-primary hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed text-base">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          <div className="mt-16 text-center">
            <p className="text-muted-foreground mb-6">{t('faq.still')}</p>
            <Button size="lg" className="rounded-full gap-2">
              <MessageCircle className="w-5 h-5" />
              {t('faq.support')}
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
