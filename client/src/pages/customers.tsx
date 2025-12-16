import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";

// Using the same customer list for now
const customers = [
  "Centara Hotels",
  "Dusit Thani",
  "Marriott",
  "Hilton",
  "Anantara",
  "Sheraton",
  "Hyatt Regency",
  "Shangri-La",
  "Le Meridien",
  "Novotel",
  "Ibis",
  "Holiday Inn",
  "Mandarin Oriental",
  "Four Seasons",
  "The Peninsula",
  "Banyan Tree"
];

export default function Customers() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />
      <main className="pt-24">
        <section className="bg-secondary/30 py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary mb-6">
              Our Valued Customers
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We are proud to serve some of the most prestigious names in the hospitality industry.
            </p>
          </div>
        </section>

        <section className="py-20 container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {customers.map((customer, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-center h-32 bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow group"
              >
                <h3 className="text-xl font-serif font-bold text-gray-400 group-hover:text-primary transition-colors text-center">
                  {customer}
                </h3>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
