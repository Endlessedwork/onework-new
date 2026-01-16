import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import imgSea from "@assets/generated_images_webp/sea_breeze_collection_amenities.webp";
import imgFlower from "@assets/generated_images_webp/flower_blossom_collection_amenities.webp";
import imgLavender from "@assets/generated_images_webp/lavender_collection_amenities.webp";
import imgSpa from "@assets/generated_images_webp/spa_therapy_collection_amenities.webp";
import imgEarth from "@assets/generated_images_webp/care_for_nature_collection_amenities.webp";
import imgKids from "@assets/generated_images_webp/happy_little_one_collection_amenities.webp";
import { useLanguage } from "@/lib/i18n";
import { Link } from "wouter";

interface CollectionItem {
  id: number;
  nameEn: string;
  nameTh: string;
  seriesEn: string;
  seriesTh: string;
  image: string;
  color: string;
}

const collections: CollectionItem[] = [
  {
    id: 1,
    nameEn: "Sea Breeze",
    nameTh: "ซีบรีซ",
    seriesEn: "Standard Series",
    seriesTh: "ซีรีส์มาตรฐาน",
    image: imgSea,
    color: "bg-sky-50 text-sky-900",
  },
  {
    id: 2,
    nameEn: "Flower Blossom",
    nameTh: "ฟลาวเวอร์บลอสซั่ม",
    seriesEn: "Standard Series",
    seriesTh: "ซีรีส์มาตรฐาน",
    image: imgFlower,
    color: "bg-rose-50 text-rose-900",
  },
  {
    id: 3,
    nameEn: "Lavender",
    nameTh: "ลาเวนเดอร์",
    seriesEn: "Standard Series",
    seriesTh: "ซีรีส์มาตรฐาน",
    image: imgLavender,
    color: "bg-purple-50 text-purple-900",
  },
  {
    id: 4,
    nameEn: "Care for Nature",
    nameTh: "แคร์ฟอร์เนเจอร์",
    seriesEn: "Earth Series",
    seriesTh: "ซีรีส์รักษ์โลก",
    image: imgEarth,
    color: "bg-emerald-50 text-emerald-900",
  },
  {
    id: 5,
    nameEn: "Spa Therapy",
    nameTh: "สปาเธอราพี",
    seriesEn: "Luxury Series",
    seriesTh: "ซีรีส์ลักซูรี่",
    image: imgSpa,
    color: "bg-amber-50 text-amber-900",
  },
  {
    id: 6,
    nameEn: "Happy Little One",
    nameTh: "แฮปปี้ลิตเติ้ลวัน",
    seriesEn: "Kids Series",
    seriesTh: "ซีรีส์สำหรับเด็ก",
    image: imgKids,
    color: "bg-pink-50 text-pink-900",
  },
];

export function ProductCollection() {
  const { t, language } = useLanguage();

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                      alt={language === 'th' ? collection.nameTh : collection.nameEn}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  </div>
                  <CardContent className="p-6 text-center">
                    <Badge variant="secondary" className={`mb-3 hover:bg-white/50 border-none ${collection.color}`}>
                      {language === 'th' ? collection.seriesTh : collection.seriesEn}
                    </Badge>
                    <h3 className="text-2xl font-semibold text-primary mb-1">
                      {language === 'th' ? collection.nameTh : collection.nameEn}
                    </h3>
                    <p className="text-sm text-muted-foreground">{t('col.view')}</p>
                  </CardContent>
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
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-medium hover:bg-primary/90 transition-colors shadow-lg"
            >
              {language === 'th' ? 'ดูคอลเลคชั่นทั้งหมด' : 'View All Collections'}
            </motion.button>
          </Link>
        </div>
      </div>
    </section>
  );
}
