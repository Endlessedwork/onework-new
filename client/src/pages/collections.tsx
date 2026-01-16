import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "@shared/schema";
import { useState, useMemo } from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";

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

import imgBudgetHero from "@assets/generated_images/budget_series_hero_banner.png";
import imgStandardHero from "@assets/generated_images/standard_series_hero_banner.png";
import imgPremiumHero from "@assets/generated_images/premium_series_hero_banner.png";
import imgLuxuryHero from "@assets/generated_images/luxury_series_hero_banner.png";
import imgEarthHero from "@assets/generated_images/earth_series_hero_banner.png";
import imgKidsHero from "@assets/generated_images/kids_series_hero_banner.png";

const collectionImages: Record<string, string> = {
  "Be Chic": imgBeChic,
  "Bliss": imgBliss,
  "Eco Black": imgBeChic,
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
  "Eco Chic": imgCareForNature,
  "Soft Touch": imgTheBeyond,
  "Happy Little One": imgHappyLittleOne,
  "Happy Dino": imgHappyLittleOne,
  "Wall Dispenser": imgBulk,
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

interface SeriesData {
  nameEn: string;
  nameTh: string;
  description: string;
  descriptionTh: string;
  color: string;
  gradient: string;
  heroImage: string;
}

const seriesInfo: Record<string, SeriesData> = {
  "Budget Series": {
    nameEn: "Budget Series",
    nameTh: "ซีรีส์งบประมาณ",
    description: "Perfect for budget hotels, hostels, and guesthouses. Smart design at affordable prices without compromising quality.",
    descriptionTh: "เหมาะสำหรับโรงแรมราคาประหยัด โฮสเทล และเกสต์เฮาส์ ดีไซน์ดูดี ราคาคุ้มค่า คุณภาพไม่ลดลง",
    color: "bg-blue-500",
    gradient: "from-blue-600 to-blue-400",
    heroImage: imgBudgetHero,
  },
  "Standard Series": {
    nameEn: "Standard Series",
    nameTh: "ซีรีส์มาตรฐาน",
    description: "Ideal for 3-4 star hotels and business hotels. Premium quality with elegant scents and beautiful packaging.",
    descriptionTh: "เหมาะสำหรับโรงแรม 3-4 ดาว และโรงแรมธุรกิจ คุณภาพพรีเมียม กลิ่นหอมหรูหรา บรรจุภัณฑ์สวยงาม",
    color: "bg-green-500",
    gradient: "from-green-600 to-green-400",
    heroImage: imgStandardHero,
  },
  "Premium Series": {
    nameEn: "Premium Series",
    nameTh: "ซีรีส์พรีเมียม",
    description: "Designed for 4-5 star hotels and boutique resorts. Luxurious formulas with sophisticated fragrances.",
    descriptionTh: "ออกแบบสำหรับโรงแรม 4-5 ดาว และบูติครีสอร์ท สูตรหรูหรา กลิ่นหอมระดับพรีเมียม",
    color: "bg-purple-500",
    gradient: "from-purple-600 to-purple-400",
    heroImage: imgPremiumHero,
  },
  "Luxury Series": {
    nameEn: "Luxury Series",
    nameTh: "ซีรีส์ลักซูรี่",
    description: "Exclusively for 5-star luxury hotels, high-end resorts, and wellness spas. The finest ingredients and spa-grade formulas.",
    descriptionTh: "สำหรับโรงแรมหรู 5 ดาว รีสอร์ทระดับสูง และสปาเวลเนส ส่วนผสมคุณภาพสูงสุด สูตรระดับสปา",
    color: "bg-amber-500",
    gradient: "from-amber-600 to-amber-400",
    heroImage: imgLuxuryHero,
  },
  "Earth Series": {
    nameEn: "Earth Series",
    nameTh: "ซีรีส์รักษ์โลก",
    description: "For eco-conscious hotels and green-certified resorts. 100% biodegradable, PCR recycled packaging, and natural ingredients.",
    descriptionTh: "สำหรับโรงแรมรักษ์โลกและรีสอร์ทที่ได้รับการรับรองมาตรฐานสิ่งแวดล้อม บรรจุภัณฑ์ย่อยสลายได้ 100% รีไซเคิล PCR ส่วนผสมจากธรรมชาติ",
    color: "bg-emerald-600",
    gradient: "from-emerald-700 to-emerald-500",
    heroImage: imgEarthHero,
  },
  "Kids Series": {
    nameEn: "Kids Series",
    nameTh: "ซีรีส์สำหรับเด็ก",
    description: "Perfect for family-friendly hotels and resorts with kids' clubs. Gentle formulas, fun designs, and tear-free products.",
    descriptionTh: "เหมาะสำหรับโรงแรมสำหรับครอบครัวและรีสอร์ทที่มีคิดส์คลับ สูตรอ่อนโยน ดีไซน์สนุกสนาน ไม่แสบตา",
    color: "bg-pink-500",
    gradient: "from-pink-600 to-pink-400",
    heroImage: imgKidsHero,
  },
  "Bulk Products": {
    nameEn: "Bulk Products",
    nameTh: "สินค้าขนาดใหญ่",
    description: "Gallon-sized products for high-volume hotels. Cost-effective refills for wall dispensers and large bathrooms.",
    descriptionTh: "สินค้าขนาดแกลลอนสำหรับโรงแรมที่มีการใช้งานสูง ประหยัดต้นทุนสำหรับเติมเครื่องจ่ายติดผนัง",
    color: "bg-orange-500",
    gradient: "from-orange-600 to-orange-400",
    heroImage: imgBulk,
  },
  "Wall Type": {
    nameEn: "Wall Type",
    nameTh: "สินค้าติดผนัง",
    description: "Modern wall-mounted dispensers for eco-conscious hotels. Reduce plastic waste and create a sleek bathroom experience.",
    descriptionTh: "เครื่องจ่ายติดผนังทันสมัยสำหรับโรงแรมรักษ์โลก ลดขยะพลาสติก สร้างประสบการณ์ห้องน้ำที่ทันสมัย",
    color: "bg-slate-600",
    gradient: "from-slate-700 to-slate-500",
    heroImage: imgBulk,
  },
  "Accessories": {
    nameEn: "Accessories",
    nameTh: "อุปกรณ์เสริม",
    description: "Complete your hotel amenity set with slippers, bags, door hangers, and more. Available in various styles and qualities.",
    descriptionTh: "เติมเต็มชุดอุปกรณ์โรงแรมด้วยรองเท้าแตะ ถุง ป้ายคล้องประตู และอื่นๆ มีหลายสไตล์และคุณภาพ",
    color: "bg-slate-500",
    gradient: "from-slate-600 to-slate-400",
    heroImage: imgSlippers,
  },
};

const seriesOrder = ["Budget Series", "Standard Series", "Premium Series", "Luxury Series", "Earth Series", "Kids Series", "Wall Type", "Bulk Products", "Accessories"];

export default function Collections() {
  const { t, language } = useLanguage();
  const [selectedSeries, setSelectedSeries] = useState<string | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);

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

  const handleSeriesClick = (series: string) => {
    setSelectedSeries(series);
    setSelectedCollection(null);
  };

  const handleBack = () => {
    if (selectedCollection) {
      setSelectedCollection(null);
    } else {
      setSelectedSeries(null);
    }
  };

  const renderSeriesGrid = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {availableSeries.map((series, index) => {
        const info = seriesInfo[series];
        const collections = productsBySeries[series] || {};
        const collectionCount = Object.keys(collections).length;
        const productCount = Object.values(collections).flat().length;

        return (
          <motion.div
            key={series}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => handleSeriesClick(series)}
            className="cursor-pointer group"
            data-testid={`series-card-${series}`}
          >
            <Card className="overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-500 h-full">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={info.heroImage}
                  alt={language === 'th' ? info.nameTh : info.nameEn}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${info.gradient} opacity-60 group-hover:opacity-70 transition-opacity`} />
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                  <h3 className="text-2xl font-heading font-bold mb-1">
                    {language === 'th' ? info.nameTh : info.nameEn}
                  </h3>
                  <p className="text-sm text-white/90">
                    {collectionCount} {language === 'th' ? 'คอลเลคชั่น' : 'Collections'} • {productCount} {language === 'th' ? 'รายการ' : 'Products'}
                  </p>
                </div>
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/40 transition-colors">
                  <ChevronRight className="w-5 h-5 text-white" />
                </div>
              </div>
              <CardContent className="p-4 bg-white">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {language === 'th' ? info.descriptionTh : info.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );

  const renderSeriesDetail = () => {
    if (!selectedSeries) return null;
    const info = seriesInfo[selectedSeries];
    const collections = productsBySeries[selectedSeries] || {};

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-8"
      >
        <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden">
          <img
            src={info.heroImage}
            alt={language === 'th' ? info.nameTh : info.nameEn}
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${info.gradient} opacity-70`} />
          <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-12 text-white">
            <Badge className="w-fit mb-4 bg-white/20 backdrop-blur-sm text-white border-none">
              {Object.keys(collections).length} {language === 'th' ? 'คอลเลคชั่น' : 'Collections'}
            </Badge>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              {language === 'th' ? info.nameTh : info.nameEn}
            </h2>
            <p className="text-lg text-white/90 max-w-xl">
              {language === 'th' ? info.descriptionTh : info.description}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(collections).map(([collectionName, collectionProducts], index) => {
            const collectionImage = collectionImages[collectionName] || defaultImage;
            const displayName = language === 'th' && collectionProducts[0]?.collectionTh
              ? collectionProducts[0].collectionTh
              : collectionProducts[0]?.collectionEn || collectionName;

            return (
              <motion.div
                key={collectionName}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedCollection(collectionName)}
                className="cursor-pointer group"
                data-testid={`collection-card-${collectionName}`}
              >
                <Card className="overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 h-full">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={collectionImage}
                      alt={displayName}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-heading font-semibold text-foreground group-hover:text-primary transition-colors">
                          {displayName}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {collectionProducts.length} {language === 'th' ? 'รายการ' : 'products'}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    );
  };

  const renderCollectionDetail = () => {
    if (!selectedSeries || !selectedCollection) return null;
    const info = seriesInfo[selectedSeries];
    const collectionProducts = productsBySeries[selectedSeries]?.[selectedCollection] || [];
    const collectionImage = collectionImages[selectedCollection] || defaultImage;
    const displayName = language === 'th' && collectionProducts[0]?.collectionTh
      ? collectionProducts[0].collectionTh
      : collectionProducts[0]?.collectionEn || selectedCollection;

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-8"
      >
        <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden">
          <img
            src={collectionImage}
            alt={displayName}
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${info.gradient} opacity-60`} />
          <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-12 text-white">
            <Badge className="w-fit mb-2 bg-white/20 backdrop-blur-sm text-white border-none">
              {language === 'th' ? info.nameTh : info.nameEn}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-2">
              {displayName}
            </h2>
            <p className="text-white/90">
              {collectionProducts.length} {language === 'th' ? 'รายการ' : 'Products'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
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
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="border-none shadow-sm hover:shadow-lg transition-all duration-300 group h-full overflow-hidden">
                  <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                    <img
                      src={productImage}
                      alt={productName}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <CardContent className="p-3" data-testid={`product-${product.id}`}>
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
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />
      <main className="pt-24">
        <section className="bg-gradient-to-b from-primary/10 to-background py-16">
          <div className="container mx-auto px-4">
            {(selectedSeries || selectedCollection) && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-6"
              >
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  className="gap-2 font-heading hover:bg-primary/10"
                  data-testid="back-button"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {selectedCollection
                    ? (language === 'th' ? 'กลับไปคอลเลคชั่น' : 'Back to Collections')
                    : (language === 'th' ? 'กลับไปซีรีส์' : 'Back to Series')}
                </Button>
              </motion.div>
            )}

            {!selectedSeries && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
              >
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-4">
                  {t('col.page.title')}
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  {language === 'th'
                    ? 'เลือกซีรีส์ที่คุณสนใจเพื่อดูคอลเลคชั่นและสินค้าภายใน'
                    : 'Select a series to explore collections and products'}
                </p>
              </motion.div>
            )}
          </div>
        </section>

        <section className="py-12 container mx-auto px-4">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
              <p className="text-muted-foreground">{t('loading') || 'Loading...'}</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {!selectedSeries && renderSeriesGrid()}
              {selectedSeries && !selectedCollection && renderSeriesDetail()}
              {selectedSeries && selectedCollection && renderCollectionDetail()}
            </AnimatePresence>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
