import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n";
import { Star, Award, Clock, Shield } from "lucide-react";

import imgHotel1 from "@assets/stock_images_webp/luxury_hotel_lobby_i_171ab5c8.webp";
import imgHotel2 from "@assets/stock_images_webp/luxury_hotel_lobby_i_e045d3f4.webp";
import imgHotel3 from "@assets/stock_images_webp/luxury_hotel_lobby_i_088571db.webp";
import imgHospital1 from "@assets/stock_images_webp/modern_hospital_buil_eeff8dc6.webp";
import imgHospital2 from "@assets/stock_images_webp/modern_hospital_buil_a1bbe0a8.webp";
import imgResort1 from "@assets/stock_images_webp/tropical_beach_resor_89b63aa5.webp";
import imgResort2 from "@assets/stock_images_webp/tropical_beach_resor_d45875e8.webp";

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
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 grid grid-cols-3 gap-1 opacity-20">
            <img src={imgHotel1} alt="" className="w-full h-full object-cover" loading="lazy" />
            <img src={imgHotel2} alt="" className="w-full h-full object-cover" loading="lazy" />
            <img src={imgHotel3} alt="" className="w-full h-full object-cover" loading="lazy" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/95 to-white" />
          <div className="relative py-24">
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
          </div>
        </section>

        <section className="py-20 container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">
                {language === "en" ? "Hotels & Resorts" : "โรงแรมและรีสอร์ท"}
              </h2>
              <p className="text-muted-foreground mb-6">
                {language === "en" ? "World-class hospitality brands trust our amenities to deliver exceptional guest experiences." : "แบรนด์โรงแรมระดับโลกไว้วางใจสินค้าของเราเพื่อมอบประสบการณ์ที่ยอดเยี่ยมให้แขก"}
              </p>
              <div className="flex flex-wrap gap-2">
                {hotelCustomers.slice(0, 10).map((customer, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.03 }}
                    className="inline-block px-4 py-2 bg-gradient-to-r from-primary/5 to-primary/10 hover:from-primary hover:to-primary/90 text-primary hover:text-white rounded-full text-sm font-medium transition-all duration-300 cursor-default border border-primary/10 hover:border-primary"
                    data-testid={`customer-hotel-${index}`}
                  >
                    {customer}
                  </motion.span>
                ))}
              </div>
            </div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              <img src={imgHotel1} alt="Luxury Hotel" className="w-full h-48 object-cover rounded-2xl shadow-lg" loading="lazy" />
              <img src={imgHotel2} alt="Hotel Lobby" className="w-full h-48 object-cover rounded-2xl shadow-lg mt-8" loading="lazy" />
            </motion.div>
          </div>

          <div className="flex flex-wrap justify-center gap-2 max-w-5xl mx-auto">
            {hotelCustomers.slice(10).map((customer, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.03 }}
                className="inline-block px-4 py-2 bg-gray-50 hover:bg-primary text-gray-600 hover:text-white rounded-full text-sm font-medium transition-all duration-300 cursor-default border border-gray-100 hover:border-primary"
                data-testid={`customer-hotel-${index + 10}`}
              >
                {customer}
              </motion.span>
            ))}
          </div>
        </section>

        <section className="py-20 bg-gradient-to-b from-rose-50/80 to-white">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="order-2 lg:order-1"
              >
                <div className="relative">
                  <img src={imgHospital1} alt="Modern Hospital" className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-xl" loading="lazy" />
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 md:w-40 md:h-40">
                    <img src={imgHospital2} alt="Healthcare" className="w-full h-full object-cover rounded-xl shadow-lg border-4 border-white" loading="lazy" />
                  </div>
                </div>
              </motion.div>

              <div className="order-1 lg:order-2">
                <div className="inline-flex items-center gap-2 bg-rose-100 px-4 py-2 rounded-full mb-4">
                  <Shield className="w-4 h-4 text-rose-600" />
                  <span className="text-sm font-medium text-rose-600">
                    {language === "en" ? "Healthcare Partners" : "พันธมิตรสถานพยาบาล"}
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">
                  {language === "en" ? "Hospitals & Healthcare" : "โรงพยาบาลและสถานพยาบาล"}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {language === "en" ? "Leading healthcare facilities trust our hygienic, FDA-approved products." : "สถานพยาบาลชั้นนำไว้วางใจผลิตภัณฑ์ที่ถูกสุขลักษณะและได้รับการรับรองจาก อย."}
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {hospitalCustomers.map((customer, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className="inline-block px-4 py-2 bg-white hover:bg-rose-500 text-gray-700 hover:text-white rounded-full text-sm font-medium transition-all duration-300 cursor-default border border-rose-200 hover:border-rose-500 shadow-sm"
                      data-testid={`customer-hospital-${index}`}
                    >
                      {customer}
                    </motion.span>
                  ))}
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Shield className="w-6 h-6 text-rose-500" />
                    </div>
                    <div className="text-lg font-bold text-rose-500">100%</div>
                    <p className="text-xs text-muted-foreground">{language === "en" ? "Safe" : "ปลอดภัย"}</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Award className="w-6 h-6 text-rose-500" />
                    </div>
                    <div className="text-lg font-bold text-rose-500">FDA</div>
                    <p className="text-xs text-muted-foreground">{language === "en" ? "Certified" : "รับรอง"}</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Clock className="w-6 h-6 text-rose-500" />
                    </div>
                    <div className="text-lg font-bold text-rose-500">24/7</div>
                    <p className="text-xs text-muted-foreground">{language === "en" ? "Ready" : "พร้อม"}</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Star className="w-6 h-6 text-rose-500" />
                    </div>
                    <div className="text-lg font-bold text-rose-500">15+</div>
                    <p className="text-xs text-muted-foreground">{language === "en" ? "Years" : "ปี"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">
                {language === "en" ? "Destinations We Serve" : "จุดหมายปลายทางที่เราให้บริการ"}
              </h2>
              <p className="text-muted-foreground mb-6">
                {language === "en" ? "Premium resorts across Thailand's most beautiful destinations trust our products." : "รีสอร์ทพรีเมียมทั่วจุดหมายปลายทางที่สวยงามที่สุดของประเทศไทยไว้วางใจสินค้าของเรา"}
              </p>
              
              <div className="flex flex-wrap gap-3">
                {resortDestinations.map((destination, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-br from-sky-50 to-blue-50 hover:from-sky-500 hover:to-blue-600 text-sky-700 hover:text-white rounded-xl text-base font-medium transition-all duration-300 cursor-default border border-sky-100 hover:border-sky-500 hover:shadow-lg"
                    data-testid={`customer-resort-${index}`}
                  >
                    <span className="text-lg">📍</span>
                    {destination}
                  </motion.span>
                ))}
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              <img src={imgResort1} alt="Beach Resort" className="w-full h-48 object-cover rounded-2xl shadow-lg" loading="lazy" />
              <img src={imgResort2} alt="Tropical Resort" className="w-full h-48 object-cover rounded-2xl shadow-lg mt-8" loading="lazy" />
            </motion.div>
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
                <a href="/contact" className="bg-primary text-white px-8 py-4 rounded-full font-medium hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5" data-testid="btn-contact-us">
                  {language === "en" ? "Contact Us" : "ติดต่อเรา"}
                </a>
                <a href="/collections" className="bg-white text-primary px-8 py-4 rounded-full font-medium hover:bg-gray-50 transition-all shadow border border-gray-200 hover:-translate-y-0.5" data-testid="btn-view-products">
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
