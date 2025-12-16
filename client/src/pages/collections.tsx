import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";

// Re-using images or placeholders for now. In a real app, these would be distinct.
import imgSea from "@assets/generated_images/blue_ocean_themed_toiletries.png";
import imgFlower from "@assets/generated_images/pink_floral_themed_toiletries.png";
import imgLavender from "@assets/generated_images/lavender_themed_toiletries.png";
import imgNatural from "@assets/generated_images/eco_natural_themed_toiletries.png";

const products = [
  {
    id: 1,
    name: "Sea Breeze Shampoo",
    collection: "Sea Breeze",
    image: imgSea,
    desc: "Revitalizing shampoo with marine extracts."
  },
  {
    id: 2,
    name: "Sea Breeze Shower Gel",
    collection: "Sea Breeze",
    image: imgSea,
    desc: "Refreshing body wash for a morning wake-up."
  },
  {
    id: 3,
    name: "Blossom Body Lotion",
    collection: "Flower Blossom",
    image: imgFlower,
    desc: "Hydrating lotion with sweet floral scent."
  },
  {
    id: 4,
    name: "Blossom Soap",
    collection: "Flower Blossom",
    image: imgFlower,
    desc: "Gentle cleansing bar with rose petals."
  },
  {
    id: 5,
    name: "Lavender Bath Salt",
    collection: "Lavender Dreams",
    image: imgLavender,
    desc: "Relaxing bath salts for a spa-like experience."
  },
  {
    id: 6,
    name: "Lavender Mist",
    collection: "Lavender Dreams",
    image: imgLavender,
    desc: "Pillow mist to encourage deep sleep."
  },
  {
    id: 7,
    name: "Bamboo Toothbrush",
    collection: "Pure Natural",
    image: imgNatural,
    desc: "Eco-friendly toothbrush with charcoal bristles."
  },
  {
    id: 8,
    name: "Wheat Straw Comb",
    collection: "Pure Natural",
    image: imgNatural,
    desc: "Biodegradable comb for sustainable travel."
  }
];

export default function Collections() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />
      <main className="pt-24">
        {/* Header */}
        <section className="bg-primary/5 py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary mb-6">
              {t('col.page.title')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('col.page.desc')}
            </p>
          </div>
        </section>

        {/* Product Grid */}
        <section className="py-20 container mx-auto px-4">
           {/* Filters (Mockup) */}
           <div className="flex flex-wrap justify-center gap-4 mb-16">
             {[t('col.filter.all'), "Sea Breeze", "Flower Blossom", "Lavender Dreams", "Pure Natural"].map((filter, i) => (
               <Button 
                key={i} 
                variant={i === 0 ? "default" : "outline"}
                className="rounded-full"
               >
                 {filter}
               </Button>
             ))}
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
             {products.map((product, index) => (
               <motion.div
                 key={product.id}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: index * 0.05 }}
               >
                 <Card className="border-none shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer h-full">
                    <div className="aspect-square relative overflow-hidden rounded-t-xl bg-gray-50">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <CardContent className="p-6">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                        {product.collection}
                      </p>
                      <h3 className="text-lg font-serif font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {product.desc}
                      </p>
                    </CardContent>
                 </Card>
               </motion.div>
             ))}
           </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
