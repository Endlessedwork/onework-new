import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { Link } from "wouter";

import imgBudgetHero from "@assets/generated_images/budget_series_hero_banner.png";
import imgStandardHero from "@assets/generated_images/standard_series_hero_banner.png";
import imgPremiumHero from "@assets/generated_images/premium_series_hero_banner.png";
import imgLuxuryHero from "@assets/generated_images/luxury_series_hero_banner.png";
import imgEarthHero from "@assets/generated_images/earth_series_hero_banner.png";
import imgKidsHero from "@assets/generated_images/kids_series_hero_banner.png";

interface SeriesItem {
  id: string;
  nameEn: string;
  nameTh: string;
  descEn: string;
  descTh: string;
  image: string;
  gradient: string;
}

const seriesList: SeriesItem[] = [
  {
    id: "budget",
    nameEn: "Budget Series",
    nameTh: "ซีรีส์งบประมาณ",
    descEn: "Smart quality for budget-conscious hotels",
    descTh: "คุณภาพดี ราคาประหยัด",
    image: imgBudgetHero,
    gradient: "from-blue-600/80 to-blue-400/80",
  },
  {
    id: "standard",
    nameEn: "Standard Series",
    nameTh: "ซีรีส์มาตรฐาน",
    descEn: "Versatile products for various styles",
    descTh: "สินค้าคุณภาพมาตรฐานหลากหลายสไตล์",
    image: imgStandardHero,
    gradient: "from-green-600/80 to-green-400/80",
  },
  {
    id: "premium",
    nameEn: "Premium Series",
    nameTh: "ซีรีส์พรีเมียม",
    descEn: "Elegant design for upscale properties",
    descTh: "ดีไซน์หรูหราสำหรับโรงแรมระดับสูง",
    image: imgPremiumHero,
    gradient: "from-purple-600/80 to-purple-400/80",
  },
  {
    id: "luxury",
    nameEn: "Luxury Series",
    nameTh: "ซีรีส์ลักซูรี่",
    descEn: "Ultimate luxury for 5-star resorts",
    descTh: "หรูหราที่สุดสำหรับรีสอร์ท 5 ดาว",
    image: imgLuxuryHero,
    gradient: "from-amber-600/80 to-amber-400/80",
  },
  {
    id: "earth",
    nameEn: "Earth Series",
    nameTh: "ซีรีส์รักษ์โลก",
    descEn: "Eco-friendly sustainable products",
    descTh: "สินค้าเป็นมิตรกับสิ่งแวดล้อม",
    image: imgEarthHero,
    gradient: "from-emerald-700/80 to-emerald-500/80",
  },
  {
    id: "kids",
    nameEn: "Kids Series",
    nameTh: "ซีรีส์สำหรับเด็ก",
    descEn: "Safe and fun for young guests",
    descTh: "ปลอดภัยและสนุกสำหรับเด็ก",
    image: imgKidsHero,
    gradient: "from-pink-600/80 to-pink-400/80",
  },
];

export function ProductCollection() {
  const { t, language } = useLanguage();

  return (
    <section id="collections" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <span className="text-accent-foreground font-medium tracking-wide uppercase text-sm font-heading">
              {t('col.curated')}
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary mt-2">
              {language === 'th' ? 'ซีรีส์ผลิตภัณฑ์ของเรา' : 'Our Product Series'}
            </h2>
          </div>
          <p className="text-muted-foreground max-w-md text-right md:text-left">
            {language === 'th' 
              ? 'เลือกซีรีส์ที่เหมาะกับโรงแรมของคุณ ตั้งแต่ระดับงบประมาณจนถึงลักซูรี่'
              : 'Choose the perfect series for your hotel, from budget-friendly to luxury'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {seriesList.map((series, index) => (
            <motion.div
              key={series.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href="/collections">
                <Card className="overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-500 group cursor-pointer h-full">
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={series.image}
                      alt={language === 'th' ? series.nameTh : series.nameEn}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${series.gradient} group-hover:opacity-90 transition-opacity`} />
                    <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                      <h3 className="text-2xl font-heading font-bold mb-1">
                        {language === 'th' ? series.nameTh : series.nameEn}
                      </h3>
                      <p className="text-sm text-white/90">
                        {language === 'th' ? series.descTh : series.descEn}
                      </p>
                    </div>
                    <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/collections">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-heading font-medium hover:bg-primary/90 transition-colors shadow-lg"
            >
              {language === 'th' ? 'ดูทั้งหมด' : 'View All Collections'}
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </div>
      </div>
    </section>
  );
}
