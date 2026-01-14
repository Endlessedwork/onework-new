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
import imgSlippers from "@assets/generated_images/hotel_slippers_collection.png";
import imgBulk from "@assets/generated_images/bulk_4l_hotel_products.png";

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
  "Slippers": imgSlippers,
  "Bags": imgSlippers,
  "Door Hangers": imgSlippers,
  "Thai Spa": imgBulk,
  "Rice Milk Bulk": imgBulk,
  "Lavender Bulk": imgBulk,
  "Cool Water": imgBulk,
  "Coco Paradise": imgBulk,
  "Spa Therapy Bulk": imgBulk,
  "PCR Bulk": imgBulk,
};

const defaultImage = imgSeaBreeze;

const seriesInfo: Record<string, { nameEn: string; nameTh: string; description: string; descriptionTh: string; color: string }> = {
  "Budget Series": {
    nameEn: "Budget Series",
    nameTh: "ซีรีส์งบประมาณ",
    description: "Products for Budget Hotels with good price and smart look",
    descriptionTh: "สินค้าสำหรับโรงแรมงบประมาณ ราคาดี ดูดี",
    color: "bg-blue-500"
  },
  "Standard Series": {
    nameEn: "Standard Series",
    nameTh: "ซีรีส์มาตรฐาน",
    description: "Standard quality products for various hotel styles",
    descriptionTh: "สินค้าคุณภาพมาตรฐาน เหมาะกับโรงแรมหลากหลายสไตล์",
    color: "bg-green-500"
  },
  "Premium Series": {
    nameEn: "Premium Series",
    nameTh: "ซีรีส์พรีเมียม",
    description: "Premium quality products with elegant design",
    descriptionTh: "สินค้าคุณภาพพรีเมียม ดีไซน์หรูหรา",
    color: "bg-purple-500"
  },
  "Luxury Series": {
    nameEn: "Luxury Series",
    nameTh: "ซีรีส์ลักซูรี่",
    description: "Luxury products for upscale hotels and resorts",
    descriptionTh: "สินค้าหรูหราสำหรับโรงแรมและรีสอร์ทระดับสูง",
    color: "bg-amber-500"
  },
  "Earth Series": {
    nameEn: "Earth Series",
    nameTh: "ซีรีส์รักษ์โลก",
    description: "Eco-friendly and environmentally conscious products",
    descriptionTh: "สินค้าเป็นมิตรกับสิ่งแวดล้อม รักษ์โลก",
    color: "bg-emerald-600"
  },
  "Kids Series": {
    nameEn: "Kids Series",
    nameTh: "ซีรีส์สำหรับเด็ก",
    description: "Special products designed for children",
    descriptionTh: "สินค้าพิเศษออกแบบสำหรับเด็ก",
    color: "bg-pink-500"
  },
  "Bulk Products": {
    nameEn: "Bulk Products",
    nameTh: "สินค้าขนาดใหญ่",
    description: "Large size refill products 4L",
    descriptionTh: "สินค้าขนาดใหญ่ 4 ลิตร สำหรับเติม",
    color: "bg-orange-500"
  },
  "Accessories": {
    nameEn: "Accessories",
    nameTh: "อุปกรณ์เสริม",
    description: "Slippers, bags, door hangers and other accessories",
    descriptionTh: "รองเท้าสลิปเปอร์ ถุง ป้ายคล้องประตู และอุปกรณ์อื่นๆ",
    color: "bg-slate-500"
  },
};

const seriesOrder = ["Budget Series", "Standard Series", "Premium Series", "Luxury Series", "Earth Series", "Kids Series", "Bulk Products", "Accessories"];

export default function Collections() {
  const { t, language } = useLanguage();
  const [selectedSeries, setSelectedSeries] = useState<string>("all");

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    queryFn: async () => {
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      return response.json();
    },
  });

  const productsBySeries = useMemo(() => {
    const grouped: Record<string, Record<string, Product[]>> = {};
    products.forEach((product) => {
      const series = product.category || "Other";
      const collection = product.collection;
      if (!grouped[series]) grouped[series] = {};
      if (!grouped[series][collection]) grouped[series][collection] = [];
      grouped[series][collection].push(product);
    });
    return grouped;
  }, [products]);

  const availableSeries = useMemo(() => {
    return seriesOrder.filter(s => productsBySeries[s] && Object.keys(productsBySeries[s]).length > 0);
  }, [productsBySeries]);

  const filteredSeries = selectedSeries === "all" ? availableSeries : [selectedSeries];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />
      <main className="pt-24">
        <section className="bg-gradient-to-b from-primary/10 to-background py-20">
          <div className="container mx-auto px-4 text-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-heading font-bold text-primary mb-6"
            >
              {t('col.page.title')}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              {t('col.page.desc')}
            </motion.p>
          </div>
        </section>

        <section className="py-12 container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <Button 
              variant={selectedSeries === "all" ? "default" : "outline"}
              className="rounded-full font-heading"
              onClick={() => setSelectedSeries("all")}
              data-testid="filter-all"
            >
              {language === 'th' ? 'ทั้งหมด' : 'All Series'}
            </Button>
            {availableSeries.map((series) => {
              const info = seriesInfo[series];
              return (
                <Button 
                  key={series}
                  variant={selectedSeries === series ? "default" : "outline"}
                  className="rounded-full font-heading"
                  onClick={() => setSelectedSeries(series)}
                  data-testid={`filter-${series}`}
                >
                  {language === 'th' ? info?.nameTh : info?.nameEn || series}
                </Button>
              );
            })}
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t('loading') || 'Loading...'}</p>
            </div>
          ) : (
            <div className="space-y-20">
              {filteredSeries.map((series) => {
                const collections = productsBySeries[series];
                if (!collections) return null;
                const info = seriesInfo[series];

                return (
                  <motion.div
                    key={series}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="space-y-8"
                  >
                    <div className="text-center border-b pb-6">
                      <Badge className={`${info?.color || 'bg-primary'} text-white mb-4`}>
                        {language === 'th' ? info?.nameTh : info?.nameEn || series}
                      </Badge>
                      <h2 className="text-3xl font-heading font-bold text-foreground mb-2">
                        {language === 'th' ? info?.nameTh : info?.nameEn || series}
                      </h2>
                      <p className="text-muted-foreground max-w-xl mx-auto">
                        {language === 'th' ? info?.descriptionTh : info?.description}
                      </p>
                    </div>

                    {Object.entries(collections).map(([collectionName, collectionProducts]) => (
                      <div key={collectionName} className="space-y-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-1 h-8 ${info?.color || 'bg-primary'} rounded-full`} />
                          <h3 className="text-xl font-heading font-semibold text-foreground">
                            {language === 'th' && collectionProducts[0]?.collectionTh
                              ? collectionProducts[0].collectionTh
                              : collectionProducts[0]?.collectionEn || collectionName}
                          </h3>
                          <span className="text-sm text-muted-foreground">
                            ({collectionProducts.length} {language === 'th' ? 'รายการ' : 'items'})
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                          {collectionProducts.map((product, index) => {
                            const productName = language === 'th' && product.nameTh
                              ? product.nameTh
                              : product.nameEn || product.name;
                            const productDesc = language === 'th' && product.descriptionTh
                              ? product.descriptionTh
                              : product.descriptionEn || product.description;
                            const productImage = product.imageUrl || collectionImages[product.collection] || defaultImage;

                            return (
                              <motion.div
                                key={product.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.03 }}
                              >
                                <Card className="border-none shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer h-full overflow-hidden">
                                  <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                                    <img 
                                      src={productImage}
                                      alt={productName}
                                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </div>
                                  <CardContent className="p-4" data-testid={`product-${product.id}`}>
                                    <h4 className="text-sm font-heading font-semibold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-2">
                                      {productName}
                                    </h4>
                                    {productDesc && (
                                      <p className="text-xs text-muted-foreground line-clamp-2">
                                        {productDesc}
                                      </p>
                                    )}
                                  </CardContent>
                                </Card>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
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
