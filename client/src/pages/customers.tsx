import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n";
import { Star, Award, Clock, Shield } from "lucide-react";

const hotelCustomers = [
  "Centara Hotels & Resorts",
  "Dusit Thani",
  "Marriott International", 
  "Hilton Hotels",
  "Anantara Hotels",
  "Sheraton Hotels",
  "Hyatt Regency",
  "Shangri-La Hotels",
  "Le Meridien",
  "Novotel",
  "Ibis Hotels",
  "Holiday Inn",
  "Mandarin Oriental",
  "Four Seasons",
  "The Peninsula",
  "Banyan Tree",
  "Amari Hotels",
  "Mövenpick Hotels",
  "Renaissance Hotels",
  "JW Marriott",
];

const hospitalCustomers = [
  "Bumrungrad International Hospital",
  "Bangkok Hospital",
  "Samitivej Hospital",
  "Vejthani Hospital",
  "BNH Hospital",
  "Piyavate Hospital",
  "Phyathai Hospital",
  "Paolo Hospital",
];

const resortDestinations = [
  "Phuket",
  "Koh Samui",
  "Chiang Mai",
  "Krabi",
  "Hua Hin",
  "Pattaya",
  "Khao Lak",
  "Koh Phangan",
];

export default function Customers() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />
      <main className="pt-24">
        <section className="bg-gradient-to-b from-primary/10 to-background py-20">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6"
            >
              <Star className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                {language === "en" ? "500+ Trusted Partners" : "พันธมิตรที่ไว้วางใจกว่า 500+ แห่ง"}
              </span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-heading font-bold text-primary mb-6"
            >
              {language === "en" ? "Our Valued Customers" : "ลูกค้าที่ไว้วางใจเรา"}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-muted-foreground max-w-3xl mx-auto"
            >
              {language === "en" 
                ? "Trusted by leading hotels, resorts, and hospitals across Thailand and Southeast Asia."
                : "ได้รับความไว้วางใจจากโรงแรม รีสอร์ท และโรงพยาบาลชั้นนำทั่วประเทศไทยและเอเชียตะวันออกเฉียงใต้"}
            </motion.p>
          </div>
        </section>

        <section className="py-20 container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-3">
              {language === "en" ? "Hotels & Resorts" : "โรงแรมและรีสอร์ท"}
            </h2>
            <p className="text-muted-foreground">
              {language === "en" ? "World-class hospitality brands trust our amenities" : "แบรนด์โรงแรมระดับโลกไว้วางใจสินค้าของเรา"}
            </p>
          </div>
          
          <div className="relative overflow-hidden py-8">
            <div className="flex flex-wrap justify-center gap-x-2 gap-y-4 max-w-5xl mx-auto">
              {hotelCustomers.map((customer, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.03 }}
                  className="group"
                  data-testid={`customer-hotel-${index}`}
                >
                  <span className="inline-block px-5 py-2.5 bg-gradient-to-r from-primary/5 to-primary/10 hover:from-primary hover:to-primary/90 text-primary hover:text-white rounded-full text-sm font-medium transition-all duration-300 cursor-default border border-primary/10 hover:border-primary hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5">
                    {customer}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-b from-rose-50/80 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-rose-100 px-4 py-2 rounded-full mb-4">
                <Shield className="w-4 h-4 text-rose-600" />
                <span className="text-sm font-medium text-rose-600">
                  {language === "en" ? "Healthcare Partners" : "พันธมิตรสถานพยาบาล"}
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-3">
                {language === "en" ? "Hospitals & Healthcare" : "โรงพยาบาลและสถานพยาบาล"}
              </h2>
              <p className="text-muted-foreground">
                {language === "en" ? "Leading healthcare facilities trust our hygienic products" : "สถานพยาบาลชั้นนำไว้วางใจผลิตภัณฑ์ที่ถูกสุขลักษณะของเรา"}
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto mb-12">
              {hospitalCustomers.map((customer, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  data-testid={`customer-hospital-${index}`}
                >
                  <span className="inline-block px-5 py-2.5 bg-white hover:bg-rose-500 text-gray-700 hover:text-white rounded-full text-sm font-medium transition-all duration-300 cursor-default border border-rose-200 hover:border-rose-500 hover:shadow-lg hover:shadow-rose-200 hover:-translate-y-0.5">
                    {customer}
                  </span>
                </motion.div>
              ))}
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-rose-100 max-w-4xl mx-auto"
            >
              <h3 className="text-xl font-heading font-bold text-center text-primary mb-8">
                {language === "en" ? "Why Healthcare Facilities Choose Us" : "ทำไมสถานพยาบาลถึงเลือกเรา"}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-7 h-7 text-rose-500" />
                  </div>
                  <div className="text-2xl font-bold text-rose-500 mb-1">100%</div>
                  <p className="text-xs text-muted-foreground">
                    {language === "en" ? "Hypoallergenic" : "ไม่ก่อให้เกิดการแพ้"}
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Award className="w-7 h-7 text-rose-500" />
                  </div>
                  <div className="text-2xl font-bold text-rose-500 mb-1">FDA</div>
                  <p className="text-xs text-muted-foreground">
                    {language === "en" ? "Certified" : "ได้รับรอง อย."}
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-7 h-7 text-rose-500" />
                  </div>
                  <div className="text-2xl font-bold text-rose-500 mb-1">24/7</div>
                  <p className="text-xs text-muted-foreground">
                    {language === "en" ? "Supply Ready" : "พร้อมจัดส่ง"}
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Star className="w-7 h-7 text-rose-500" />
                  </div>
                  <div className="text-2xl font-bold text-rose-500 mb-1">15+</div>
                  <p className="text-xs text-muted-foreground">
                    {language === "en" ? "Years Experience" : "ปีประสบการณ์"}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-20 container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-3">
              {language === "en" ? "Destinations We Serve" : "จุดหมายปลายทางที่เราให้บริการ"}
            </h2>
            <p className="text-muted-foreground">
              {language === "en" ? "Premium resorts across Thailand's top destinations" : "รีสอร์ทพรีเมียมทั่วจุดหมายปลายทางยอดนิยมของประเทศไทย"}
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
            {resortDestinations.map((destination, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                data-testid={`customer-resort-${index}`}
              >
                <span className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-sky-50 to-blue-50 hover:from-sky-500 hover:to-blue-600 text-sky-700 hover:text-white rounded-xl text-base font-medium transition-all duration-300 cursor-default border border-sky-100 hover:border-sky-500 hover:shadow-xl hover:shadow-sky-200 hover:-translate-y-1">
                  <span className="text-lg">📍</span>
                  {destination}
                </span>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto"
            >
              <h2 className="text-3xl font-heading font-bold text-primary mb-4">
                {language === "en" ? "Join Our Growing Network" : "เข้าร่วมเครือข่ายที่เติบโตของเรา"}
              </h2>
              <p className="text-muted-foreground mb-8">
                {language === "en" 
                  ? "Ready to elevate your guest experience with premium amenities? Contact us today."
                  : "พร้อมยกระดับประสบการณ์แขกของคุณด้วยอุปกรณ์พรีเมียม? ติดต่อเราวันนี้"}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/contact" className="bg-primary text-white px-8 py-4 rounded-full font-medium hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5" data-testid="btn-contact-us">
                  {language === "en" ? "Contact Us" : "ติดต่อเรา"}
                </a>
                <a href="/collections" className="bg-white text-primary px-8 py-4 rounded-full font-medium hover:bg-gray-50 transition-colors shadow border border-gray-200 hover:-translate-y-0.5" data-testid="btn-view-products">
                  {language === "en" ? "View Products" : "ดูสินค้า"}
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
