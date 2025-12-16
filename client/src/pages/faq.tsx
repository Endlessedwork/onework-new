import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

const faqs = [
  {
    question: "Do you offer custom branding (OEM)?",
    answer: "Yes, we specialize in OEM services. We can customize packaging, scents, formulations, and logos to match your hotel's brand identity. Minimum order quantities (MOQ) apply."
  },
  {
    question: "What is your minimum order quantity?",
    answer: "For standard collections, the MOQ is 1 case per item. For custom OEM projects, MOQ typically starts at 5,000 pieces per item, but this can vary depending on the product type."
  },
  {
    question: "Are your products eco-friendly?",
    answer: "We offer several eco-friendly lines, including our 'Pure Natural' collection. We use biodegradable plastics, wheat straw, bamboo, and recycled paper packaging. We are constantly innovating to reduce our environmental footprint."
  },
  {
    question: "How long does shipping take?",
    answer: "For in-stock items, delivery within Thailand takes 3-5 business days. For international orders or custom production, lead times will be provided in your quotation."
  },
  {
    question: "Can I request samples?",
    answer: "Absolutely. We are happy to provide samples for quality verification. Please contact our sales team to arrange a sample kit."
  }
];

export default function FAQ() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />
      <main className="pt-24">
        <section className="bg-secondary/30 py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about our products, ordering process, and customization options.
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
            <p className="text-muted-foreground mb-6">Still have questions?</p>
            <Button size="lg" className="rounded-full gap-2">
              <MessageCircle className="w-5 h-5" />
              Contact Support
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
