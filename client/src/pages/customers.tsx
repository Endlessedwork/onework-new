import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n";
import { Building2, Hotel, Heart } from "lucide-react";

const hotelCustomers = [
  { name: "Centara Hotels & Resorts", category: "chain" },
  { name: "Dusit Thani", category: "luxury" },
  { name: "Marriott International", category: "chain" },
  { name: "Hilton Hotels", category: "chain" },
  { name: "Anantara Hotels", category: "luxury" },
  { name: "Sheraton Hotels", category: "chain" },
  { name: "Hyatt Regency", category: "luxury" },
  { name: "Shangri-La Hotels", category: "luxury" },
  { name: "Le Meridien", category: "luxury" },
  { name: "Novotel", category: "chain" },
  { name: "Ibis Hotels", category: "budget" },
  { name: "Holiday Inn", category: "chain" },
  { name: "Mandarin Oriental", category: "luxury" },
  { name: "Four Seasons", category: "luxury" },
  { name: "The Peninsula", category: "luxury" },
  { name: "Banyan Tree", category: "luxury" },
  { name: "Amari Hotels", category: "chain" },
  { name: "Mövenpick Hotels", category: "chain" },
  { name: "Renaissance Hotels", category: "luxury" },
  { name: "JW Marriott", category: "luxury" },
];

const hospitalCustomers = [
  { name: "Bumrungrad International Hospital", category: "international" },
  { name: "Bangkok Hospital", category: "network" },
  { name: "Samitivej Hospital", category: "network" },
  { name: "Vejthani Hospital", category: "international" },
  { name: "BNH Hospital", category: "international" },
  { name: "Piyavate Hospital", category: "private" },
  { name: "Phyathai Hospital", category: "network" },
  { name: "Paolo Hospital", category: "network" },
];

const resortCustomers = [
  { name: "Phuket Resorts", category: "beach" },
  { name: "Koh Samui Villas", category: "beach" },
  { name: "Chiang Mai Retreats", category: "mountain" },
  { name: "Krabi Beach Resorts", category: "beach" },
  { name: "Hua Hin Hotels", category: "beach" },
  { name: "Pattaya Hotels", category: "city" },
];

export default function Customers() {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />
      <main className="pt-24">
        <section className="bg-gradient-to-b from-primary/10 to-background py-20">
          <div className="container mx-auto px-4 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-heading font-bold text-primary mb-6"
            >
              {language === "en" ? "Our Valued Customers" : "ลูกค้าที่ไว้วางใจเรา"}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground max-w-3xl mx-auto"
            >
              {language === "en" 
                ? "Trusted by leading hotels, resorts, and hospitals across Thailand and Southeast Asia. We're proud to serve over 500+ establishments with premium amenities."
                : "ได้รับความไว้วางใจจากโรงแรม รีสอร์ท และโรงพยาบาลชั้นนำทั่วประเทศไทยและเอเชียตะวันออกเฉียงใต้ เราภูมิใจที่ได้ให้บริการสถานประกอบการมากกว่า 500+ แห่ง"}
            </motion.p>
          </div>
        </section>

        <section className="py-20 container mx-auto px-4">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Hotel className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-heading font-bold text-primary">
                {language === "en" ? "Hotels & Resorts" : "โรงแรมและรีสอร์ท"}
              </h2>
              <p className="text-muted-foreground">
                {language === "en" ? "Premium hotels trusting our amenities" : "โรงแรมพรีเมียมที่ไว้วางใจสินค้าของเรา"}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {hotelCustomers.map((customer, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.03 }}
                className="flex flex-col items-center justify-center h-36 bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-lg hover:border-primary/30 transition-all group"
                data-testid={`customer-hotel-${index}`}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center mb-3 group-hover:from-primary/30 group-hover:to-primary/10 transition-colors">
                  <span className="text-2xl font-bold text-primary">{customer.name.charAt(0)}</span>
                </div>
                <h3 className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors text-center leading-tight">
                  {customer.name}
                </h3>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="py-20 bg-red-50/50">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h2 className="text-3xl font-heading font-bold text-primary">
                  {language === "en" ? "Hospitals & Healthcare" : "โรงพยาบาลและสถานพยาบาล"}
                </h2>
                <p className="text-muted-foreground">
                  {language === "en" ? "Healthcare facilities using our hygienic products" : "สถานพยาบาลที่ใช้ผลิตภัณฑ์ที่ถูกสุขลักษณะของเรา"}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {hospitalCustomers.map((customer, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex flex-col items-center justify-center h-36 bg-white rounded-xl shadow-sm border border-red-100 p-4 hover:shadow-lg hover:border-red-300 transition-all group"
                  data-testid={`customer-hospital-${index}`}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-50 rounded-full flex items-center justify-center mb-3 group-hover:from-red-200 group-hover:to-red-100 transition-colors">
                    <Heart className="w-8 h-8 text-red-400" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-700 group-hover:text-red-600 transition-colors text-center leading-tight">
                    {customer.name}
                  </h3>
                </motion.div>
              ))}
            </div>
            <div className="mt-12 bg-white rounded-2xl p-8 border border-red-100">
              <h3 className="text-xl font-heading font-bold text-primary mb-4">
                {language === "en" ? "Why Hospitals Choose Us" : "ทำไมโรงพยาบาลถึงเลือกเรา"}
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-500 mb-2">100%</div>
                  <p className="text-sm text-muted-foreground">
                    {language === "en" ? "Hypoallergenic Products" : "ผลิตภัณฑ์ไม่ก่อให้เกิดการแพ้"}
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-500 mb-2">FDA</div>
                  <p className="text-sm text-muted-foreground">
                    {language === "en" ? "Approved & Certified" : "ได้รับการรับรองจาก อย."}
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-500 mb-2">24/7</div>
                  <p className="text-sm text-muted-foreground">
                    {language === "en" ? "Supply Availability" : "พร้อมจัดส่งตลอดเวลา"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 container mx-auto px-4">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h2 className="text-3xl font-heading font-bold text-primary">
                {language === "en" ? "Resorts & Destinations" : "รีสอร์ทและสถานที่ท่องเที่ยว"}
              </h2>
              <p className="text-muted-foreground">
                {language === "en" ? "Beach resorts and vacation destinations" : "รีสอร์ทชายหาดและสถานที่พักผ่อน"}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {resortCustomers.map((customer, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex flex-col items-center justify-center h-32 bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-sm border border-blue-100 p-4 hover:shadow-lg hover:border-blue-300 transition-all group"
                data-testid={`customer-resort-${index}`}
              >
                <Building2 className="w-8 h-8 text-blue-400 mb-2 group-hover:text-blue-500 transition-colors" />
                <h3 className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors text-center leading-tight">
                  {customer.name}
                </h3>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="py-20 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-heading font-bold text-primary mb-6">
              {language === "en" ? "Join Our Growing Network" : "เข้าร่วมเครือข่ายที่เติบโตของเรา"}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              {language === "en" 
                ? "Ready to elevate your guest experience with premium amenities? Contact us today for a personalized consultation and quote."
                : "พร้อมยกระดับประสบการณ์แขกของคุณด้วยอุปกรณ์พรีเมียม? ติดต่อเราวันนี้เพื่อรับคำปรึกษาและใบเสนอราคา"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="bg-primary text-white px-8 py-4 rounded-full font-medium hover:bg-primary/90 transition-colors shadow-lg" data-testid="btn-contact-us">
                {language === "en" ? "Contact Us" : "ติดต่อเรา"}
              </a>
              <a href="/collections" className="bg-white text-primary px-8 py-4 rounded-full font-medium hover:bg-gray-50 transition-colors shadow border border-gray-200" data-testid="btn-view-products">
                {language === "en" ? "View Products" : "ดูสินค้า"}
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
