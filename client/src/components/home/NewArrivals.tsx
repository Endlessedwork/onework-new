import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "@shared/schema";

import imgBeChic from "@assets/generated_images/be_chic_collection_amenities.png";
import imgBliss from "@assets/generated_images/bliss_collection_amenities.png";
import imgSeaBreeze from "@assets/generated_images/sea_breeze_collection_amenities.png";
import imgBloom from "@assets/generated_images/bloom_collection_amenities.png";
import imgFlowerBlossom from "@assets/generated_images/flower_blossom_collection_amenities.png";
import imgRiceMilk from "@assets/generated_images/rice_milk_collection_amenities.png";
import imgLavender from "@assets/generated_images/lavender_collection_amenities.png";
import imgHappyHolidays from "@assets/generated_images/happy_holidays_collection_amenities.png";
import imgTheClassic from "@assets/generated_images/the_classic_collection_amenities.png";
import imgSpaTherapy from "@assets/generated_images/spa_therapy_collection_amenities.png";
import imgPCR from "@assets/generated_images/pcr_recycling_collection_amenities.png";
import imgCareForNature from "@assets/generated_images/care_for_nature_collection_amenities.png";
import imgTheBeyond from "@assets/generated_images/the_beyond_collection_amenities.png";
import imgHappyLittleOne from "@assets/generated_images/happy_little_one_collection_amenities.png";

const collectionImages: Record<string, string> = {
  "Be Chic": imgBeChic,
  "Bliss": imgBliss,
  "Sea Breeze": imgSeaBreeze,
  "Bloom": imgBloom,
  "Flower Blossom": imgFlowerBlossom,
  "Rice Milk": imgRiceMilk,
  "Lavender": imgLavender,
  "Happy Holidays": imgHappyHolidays,
  "The Classic": imgTheClassic,
  "Spa Therapy": imgSpaTherapy,
  "PCR Recycling": imgPCR,
  "Care for Nature": imgCareForNature,
  "The Beyond": imgTheBeyond,
  "Happy Little One": imgHappyLittleOne,
};

const defaultImage = imgSeaBreeze;

export function NewArrivals() {
  const { language } = useLanguage();

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    queryFn: async () => {
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      return response.json();
    },
  });

  const newProducts = products.slice(0, 8);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Sparkles className="w-6 h-6 text-amber-500" />
          <span className="text-amber-600 font-medium tracking-wide uppercase text-sm">
            {language === 'th' ? 'มาใหม่' : 'Just In'}
          </span>
          <Sparkles className="w-6 h-6 text-amber-500" />
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-primary text-center mb-4">
          {language === 'th' ? 'สินค้าแนะนำ' : 'Featured Products'}
        </h2>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
          {language === 'th' 
            ? 'สินค้าคุณภาพพรีเมียมคัดสรรมาเพื่อโรงแรมของคุณ'
            : 'Premium quality products curated for your hotel'}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {newProducts.map((product, index) => {
            const productName = language === 'th' && product.nameTh
              ? product.nameTh
              : product.nameEn || product.name;
            const collectionName = language === 'th' && product.collectionTh
              ? product.collectionTh
              : product.collectionEn || product.collection;
            const productImage = product.imageUrl || collectionImages[product.collection] || defaultImage;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="overflow-hidden border-none shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer h-full bg-white">
                  <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                    <img
                      src={productImage}
                      alt={productName}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {index < 3 && (
                      <Badge className="absolute top-2 left-2 bg-amber-500 text-white border-none text-xs">
                        {language === 'th' ? 'แนะนำ' : 'Featured'}
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">{collectionName}</p>
                    <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {productName}
                    </h4>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
