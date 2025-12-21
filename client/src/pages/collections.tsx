import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "@shared/schema";
import { useState, useMemo } from "react";

// Fallback images
import imgSea from "@assets/generated_images/blue_ocean_themed_toiletries.png";
import imgFlower from "@assets/generated_images/pink_floral_themed_toiletries.png";
import imgLavender from "@assets/generated_images/lavender_themed_toiletries.png";
import imgNatural from "@assets/generated_images/eco_natural_themed_toiletries.png";

const fallbackImages = [imgSea, imgFlower, imgLavender, imgNatural];

export default function Collections() {
  const { t, language } = useLanguage();
  const [selectedCollection, setSelectedCollection] = useState<string>("all");

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    queryFn: async () => {
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      return response.json();
    },
  });

  // Get unique collections
  const collections = useMemo(() => {
    const uniqueCollections = new Set<string>();
    products.forEach((product) => {
      const collectionName = language === 'th' && product.collectionTh
        ? product.collectionTh
        : product.collectionEn || product.collection;
      uniqueCollections.add(collectionName);
    });
    return Array.from(uniqueCollections);
  }, [products, language]);

  // Filter products by selected collection
  const filteredProducts = useMemo(() => {
    if (selectedCollection === "all") return products;
    return products.filter((product) => {
      const collectionName = language === 'th' && product.collectionTh
        ? product.collectionTh
        : product.collectionEn || product.collection;
      return collectionName === selectedCollection;
    });
  }, [products, selectedCollection, language]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />
      <main className="pt-24">
        {/* Header */}
        <section className="bg-primary/5 py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-primary mb-6">
              {t('col.page.title')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('col.page.desc')}
            </p>
          </div>
        </section>

        {/* Product Grid */}
        <section className="py-20 container mx-auto px-4">
           {/* Filters */}
           <div className="flex flex-wrap justify-center gap-4 mb-16">
             <Button 
               variant={selectedCollection === "all" ? "default" : "outline"}
               className="rounded-full"
               onClick={() => setSelectedCollection("all")}
               data-testid="filter-all"
             >
               {t('col.filter.all')}
             </Button>
             {collections.map((collection) => (
               <Button 
                 key={collection}
                 variant={selectedCollection === collection ? "default" : "outline"}
                 className="rounded-full"
                 onClick={() => setSelectedCollection(collection)}
                 data-testid={`filter-${collection}`}
               >
                 {collection}
               </Button>
             ))}
           </div>

           {isLoading ? (
             <div className="text-center py-12">
               <p className="text-muted-foreground">{t('loading') || 'Loading...'}</p>
             </div>
           ) : filteredProducts.length === 0 ? (
             <div className="text-center py-12">
               <p className="text-muted-foreground">{t('col.no_products') || 'No products available'}</p>
             </div>
           ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
               {filteredProducts.map((product, index) => {
                 const productName = language === 'th' && product.nameTh
                   ? product.nameTh
                   : product.nameEn || product.name;
                 const productDesc = language === 'th' && product.descriptionTh
                   ? product.descriptionTh
                   : product.descriptionEn || product.description;
                 const collectionName = language === 'th' && product.collectionTh
                   ? product.collectionTh
                   : product.collectionEn || product.collection;
                 const productImage = product.imageUrl || fallbackImages[index % fallbackImages.length];

                 return (
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
                           src={productImage}
                           alt={productName}
                           className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                         />
                       </div>
                       <CardContent className="p-6" data-testid={`product-${product.id}`}>
                         <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                           {collectionName}
                         </p>
                         <h3 className="text-lg font-heading font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                           {productName}
                         </h3>
                         {productDesc && (
                           <p className="text-sm text-muted-foreground line-clamp-2">
                             {productDesc}
                           </p>
                         )}
                       </CardContent>
                     </Card>
                   </motion.div>
                 );
               })}
             </div>
           )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
