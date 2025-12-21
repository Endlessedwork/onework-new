import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import imgSea from "@assets/generated_images/blue_ocean_themed_toiletries.png";
import imgFlower from "@assets/generated_images/pink_floral_themed_toiletries.png";
import imgLavender from "@assets/generated_images/lavender_themed_toiletries.png";
import imgNatural from "@assets/generated_images/eco_natural_themed_toiletries.png";
import { useLanguage } from "@/lib/i18n";
import { Link } from "wouter";

const collections = [
  {
    id: 1,
    name: "Sea Breeze",
    category: "Fresh & Revitalizing",
    image: imgSea,
    color: "bg-sky-50 text-sky-900",
  },
  {
    id: 2,
    name: "Flower Blossom",
    category: "Sweet & Romantic",
    image: imgFlower,
    color: "bg-rose-50 text-rose-900",
  },
  {
    id: 3,
    name: "Lavender Dreams",
    category: "Calm & Relaxing",
    image: imgLavender,
    color: "bg-purple-50 text-purple-900",
  },
  {
    id: 4,
    name: "Pure Natural",
    category: "Eco & Earthy",
    image: imgNatural,
    color: "bg-stone-50 text-stone-900",
  },
];

export function ProductCollection() {
  const { t } = useLanguage();

  return (
    <section id="collections" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <span className="text-accent-foreground font-medium tracking-wide uppercase text-sm">{t('col.curated')}</span>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mt-2">{t('col.title')}</h2>
          </div>
          <p className="text-muted-foreground max-w-md text-right md:text-left">
            {t('col.desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href="/collections">
                <Card className="overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer h-full bg-white">
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={collection.image}
                      alt={collection.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  </div>
                  <CardContent className="p-6 text-center">
                    <Badge variant="secondary" className={`mb-3 hover:bg-white/50 border-none ${collection.color}`}>
                      {collection.category}
                    </Badge>
                    <h3 className="text-2xl font-semibold text-primary mb-1">
                      {collection.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{t('col.view')}</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
