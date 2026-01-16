import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/i18n";
import { Link } from "wouter";
import { Droplets, Layers } from "lucide-react";

interface BulkProduct {
  id: number;
  nameEn: string;
  nameTh: string;
  descEn: string;
  descTh: string;
  icon: ReactNode;
  color: string;
  bgColor: string;
}

const gallonProducts: BulkProduct[] = [
  {
    id: 1,
    nameEn: "Shampoo Gallon",
    nameTh: "แชมพูแกลลอน",
    descEn: "5L Professional Size",
    descTh: "ขนาด 5 ลิตร",
    icon: <Droplets className="w-8 h-8" />,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    id: 2,
    nameEn: "Conditioner Gallon",
    nameTh: "ครีมนวดแกลลอน",
    descEn: "5L Professional Size",
    descTh: "ขนาด 5 ลิตร",
    icon: <Droplets className="w-8 h-8" />,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    id: 3,
    nameEn: "Shower Gel Gallon",
    nameTh: "เจลอาบน้ำแกลลอน",
    descEn: "5L Professional Size",
    descTh: "ขนาด 5 ลิตร",
    icon: <Droplets className="w-8 h-8" />,
    color: "text-teal-600",
    bgColor: "bg-teal-50",
  },
  {
    id: 4,
    nameEn: "Body Lotion Gallon",
    nameTh: "โลชั่นแกลลอน",
    descEn: "5L Professional Size",
    descTh: "ขนาด 5 ลิตร",
    icon: <Droplets className="w-8 h-8" />,
    color: "text-rose-600",
    bgColor: "bg-rose-50",
  },
];

const wallProducts: BulkProduct[] = [
  {
    id: 1,
    nameEn: "Shampoo Dispenser",
    nameTh: "เครื่องจ่ายแชมพู",
    descEn: "300ml Wall Mount",
    descTh: "ติดผนัง 300 มล.",
    icon: <Layers className="w-8 h-8" />,
    color: "text-slate-600",
    bgColor: "bg-slate-50",
  },
  {
    id: 2,
    nameEn: "Conditioner Dispenser",
    nameTh: "เครื่องจ่ายครีมนวด",
    descEn: "300ml Wall Mount",
    descTh: "ติดผนัง 300 มล.",
    icon: <Layers className="w-8 h-8" />,
    color: "text-slate-600",
    bgColor: "bg-slate-50",
  },
  {
    id: 3,
    nameEn: "Shower Gel Dispenser",
    nameTh: "เครื่องจ่ายเจลอาบน้ำ",
    descEn: "300ml Wall Mount",
    descTh: "ติดผนัง 300 มล.",
    icon: <Layers className="w-8 h-8" />,
    color: "text-slate-600",
    bgColor: "bg-slate-50",
  },
  {
    id: 4,
    nameEn: "Body Lotion Dispenser",
    nameTh: "เครื่องจ่ายโลชั่น",
    descEn: "300ml Wall Mount",
    descTh: "ติดผนัง 300 มล.",
    icon: <Layers className="w-8 h-8" />,
    color: "text-slate-600",
    bgColor: "bg-slate-50",
  },
];

export function GallonTypeSection() {
  const { language } = useLanguage();

  return (
    <section className="py-20 bg-gradient-to-b from-blue-50/50 to-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <Badge className="bg-blue-100 text-blue-700 border-none mb-3">
              {language === "en" ? "Bulk Supply" : "สินค้าขนาดใหญ่"}
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-primary">
              {language === "en" ? "Gallon Type" : "สินค้าแกลลอน"}
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg">
              {language === "en" 
                ? "Professional-sized gallons for high-volume hotels. Perfect for refilling dispensers and reducing packaging waste."
                : "สินค้าขนาดแกลลอนสำหรับโรงแรมที่มีการใช้งานสูง เหมาะสำหรับเติมเครื่องจ่ายและลดขยะบรรจุภัณฑ์"}
            </p>
          </div>
          <Link href="/collections">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 border-2 border-primary text-primary px-6 py-3 rounded-full font-medium hover:bg-primary hover:text-white transition-colors"
              data-testid="btn-view-gallons"
            >
              {language === "en" ? "View All Gallons" : "ดูสินค้าแกลลอนทั้งหมด"}
            </motion.button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {gallonProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-none shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer h-full bg-white overflow-hidden" data-testid={`gallon-product-${product.id}`}>
                <CardContent className="p-6 text-center">
                  <div className={`w-20 h-20 mx-auto ${product.bgColor} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <div className={product.color}>{product.icon}</div>
                  </div>
                  <h3 className="text-lg font-semibold text-primary mb-1">
                    {language === "en" ? product.nameEn : product.nameTh}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === "en" ? product.descEn : product.descTh}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WallTypeSection() {
  const { language } = useLanguage();

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <Badge className="bg-green-100 text-green-700 border-none mb-3">
              {language === "en" ? "New Arrival" : "สินค้าใหม่"}
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-primary">
              {language === "en" ? "Wall Type" : "สินค้าติดผนัง"}
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg">
              {language === "en" 
                ? "Modern wall-mounted dispensers for a sleek, eco-friendly bathroom experience. Reduce single-use plastics with refillable systems."
                : "เครื่องจ่ายติดผนังทันสมัยสำหรับห้องน้ำที่สวยงามและรักษ์โลก ลดพลาสติกใช้ครั้งเดียวด้วยระบบเติมได้"}
            </p>
          </div>
          <Link href="/collections">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors shadow-lg"
              data-testid="btn-explore-wall-type"
            >
              {language === "en" ? "Explore Wall Type" : "ดูสินค้าติดผนัง"}
            </motion.button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-slate-100 to-slate-50 rounded-3xl p-8 md:p-12 flex flex-col justify-center">
            <h3 className="text-2xl font-bold text-primary mb-4">
              {language === "en" ? "Why Choose Wall Dispensers?" : "ทำไมต้องเลือกเครื่องจ่ายติดผนัง?"}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-muted-foreground">
                  {language === "en" ? "Reduce plastic waste by up to 80%" : "ลดขยะพลาสติกได้ถึง 80%"}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-muted-foreground">
                  {language === "en" ? "Cost-effective refillable system" : "ระบบเติมได้ประหยัดต้นทุน"}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-muted-foreground">
                  {language === "en" ? "Sleek modern bathroom aesthetics" : "ดีไซน์ทันสมัยสวยงาม"}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-muted-foreground">
                  {language === "en" ? "Easy installation and maintenance" : "ติดตั้งและบำรุงรักษาง่าย"}
                </span>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {wallProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-none shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer h-full bg-white" data-testid={`wall-product-${product.id}`}>
                  <CardContent className="p-5 text-center">
                    <div className={`w-14 h-14 mx-auto ${product.bgColor} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                      <div className={product.color}>{product.icon}</div>
                    </div>
                    <h3 className="text-sm font-semibold text-primary mb-1">
                      {language === "en" ? product.nameEn : product.nameTh}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {language === "en" ? product.descEn : product.descTh}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
