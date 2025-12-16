import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'th';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navbar
    'nav.home': 'Home',
    'nav.collections': 'Collections',
    'nav.customers': 'Customers',
    'nav.qa': 'Q&A',
    'nav.about': 'About Us',
    'nav.contact': 'Contact',
    'nav.quote': 'Get a Quote',

    // Hero
    'hero.badge': 'Premium Hotel Supplies',
    'hero.title': 'Elevate Your Guest Experience',
    'hero.subtitle': 'Curated collections of premium amenities designed to bring the soothing essence of nature to your hotel, resort, or spa.',
    'hero.explore': 'Explore Collections',
    'hero.contact': 'Contact Sales',

    // Trust
    'trust.title': 'Trusted by Leading Hospitality Brands',

    // Collections Home
    'col.curated': 'Curated Selection',
    'col.title': 'Standard Collections',
    'col.desc': 'Explore our ready-to-ship collections, thoughtfully designed to suit various hotel themes and atmospheres.',
    'col.view': 'View Collection',

    // Services
    'serv.title': 'Our Services',
    'serv.hotel': 'Hotel Amenities',
    'serv.hotel.desc': 'Complete amenity solutions for luxury hotels and resorts, customized to your brand identity.',
    'serv.hospital': 'Hospital Supplies',
    'serv.hospital.desc': 'Hygienic and comforting care packages designed specifically for healthcare environments.',
    'serv.oem': 'OEM Manufacturing',
    'serv.oem.desc': 'Full-service OEM production with flexible minimums and premium quality control.',

    // CTA
    'cta.title': 'Ready to upgrade your amenities?',
    'cta.desc': 'Contact us today to request a catalog or schedule a consultation with our design team.',
    'cta.btn': 'Get in Touch',

    // Footer
    'footer.desc': 'Elevating hospitality experiences through premium amenities and thoughtful design since 2010.',
    'footer.company': 'Company',
    'footer.privacy': 'Privacy Policy',
    'footer.rights': 'All rights reserved.',

    // About
    'about.title': 'Our Story',
    'about.desc': 'Dedicated to elevating the hospitality experience through exceptional quality and sustainable design since 2010.',
    'about.vision': 'Vision & Mission',
    'about.vision.desc1': 'At Onework, we believe that every detail counts. Our mission is to provide hotels and resorts with amenities that not only meet the highest standards of hygiene and quality but also create memorable experiences for guests.',
    'about.vision.desc2': 'We are committed to sustainability, innovation, and design excellence. We work closely with our partners to create bespoke solutions that reflect their unique brand identity.',
    'about.manufacture': 'Manufacturing Excellence',
    'about.manufacture.desc': 'Our state-of-the-art manufacturing facilities adhere to strict GMP (Good Manufacturing Practice) standards. We control every step of the process to ensure consistency and safety.',
    'about.list.1': 'GMP Certified Facilities',
    'about.list.2': 'Eco-friendly Production Processes',
    'about.list.3': 'Strict Quality Control (QC)',
    'about.list.4': 'Sustainable Material Sourcing',

    // Collections Page
    'col.page.title': 'Our Collections',
    'col.page.desc': 'Explore our wide range of premium hotel amenities, categorized by theme and mood.',
    'col.filter.all': 'All',
    
    // Customers Page
    'cust.title': 'Our Valued Customers',
    'cust.desc': 'We are proud to serve some of the most prestigious names in the hospitality industry.',

    // FAQ
    'faq.title': 'Frequently Asked Questions',
    'faq.desc': 'Find answers to common questions about our products, ordering process, and customization options.',
    'faq.still': 'Still have questions?',
    'faq.support': 'Contact Support',
    'faq.q1': 'Do you offer custom branding (OEM)?',
    'faq.a1': 'Yes, we specialize in OEM services. We can customize packaging, scents, formulations, and logos to match your hotel\'s brand identity. Minimum order quantities (MOQ) apply.',
    'faq.q2': 'What is your minimum order quantity?',
    'faq.a2': 'For standard collections, the MOQ is 1 case per item. For custom OEM projects, MOQ typically starts at 5,000 pieces per item, but this can vary depending on the product type.',
    'faq.q3': 'Are your products eco-friendly?',
    'faq.a3': 'We offer several eco-friendly lines, including our \'Pure Natural\' collection. We use biodegradable plastics, wheat straw, bamboo, and recycled paper packaging. We are constantly innovating to reduce our environmental footprint.',
    'faq.q4': 'How long does shipping take?',
    'faq.a4': 'For in-stock items, delivery within Thailand takes 3-5 business days. For international orders or custom production, lead times will be provided in your quotation.',
    'faq.q5': 'Can I request samples?',
    'faq.a5': 'Absolutely. We are happy to provide samples for quality verification. Please contact our sales team to arrange a sample kit.',

    // Contact
    'contact.title': 'Get in Touch',
    'contact.desc': 'We\'d love to hear from you. Whether you have a question about our collections, pricing, or custom projects, our team is ready to help.',
    'contact.info': 'Contact Information',
    'contact.head': 'Head Office',
    'contact.phone': 'Phone',
    'contact.email': 'Email',
    'contact.hours': 'Business Hours',
    'contact.hours.desc': 'Monday - Friday: 9:00 AM - 6:00 PM',
    'contact.hours.closed': 'Saturday - Sunday: Closed',
    'contact.form.title': 'Send us a Message',
    'contact.form.desc': 'Fill out the form below and we\'ll get back to you shortly.',
    'contact.form.fname': 'First Name',
    'contact.form.lname': 'Last Name',
    'contact.form.email': 'Email Address',
    'contact.form.subject': 'Subject',
    'contact.form.message': 'Message',
    'contact.form.send': 'Send Message',
  },
  th: {
    // Navbar
    'nav.home': 'หน้าหลัก',
    'nav.collections': 'สินค้า',
    'nav.customers': 'ลูกค้าของเรา',
    'nav.qa': 'คำถามที่พบบ่อย',
    'nav.about': 'เกี่ยวกับเรา',
    'nav.contact': 'ติดต่อเรา',
    'nav.quote': 'ขอใบเสนอราคา',

    // Hero
    'hero.badge': 'ของใช้ในโรงแรมระดับพรีเมียม',
    'hero.title': 'ยกระดับประสบการณ์\nผู้เข้าพักของคุณ',
    'hero.subtitle': 'คอลเลกชันของใช้ในโรงแรมที่คัดสรรมาอย่างดี ออกแบบมาเพื่อนำความผ่อนคลายจากธรรมชาติสู่โรงแรม รีสอร์ท หรือสปาของคุณ',
    'hero.explore': 'ดูสินค้าทั้งหมด',
    'hero.contact': 'ติดต่อฝ่ายขาย',

    // Trust
    'trust.title': 'ได้รับความไว้วางใจจากแบรนด์ชั้นนำ',

    // Collections Home
    'col.curated': 'สินค้าคัดสรรพิเศษ',
    'col.title': 'คอลเลกชันมาตรฐาน',
    'col.desc': 'สำรวจคอลเลกชันพร้อมส่งของเรา ที่ออกแบบมาอย่างพิถีพิถันเพื่อให้เข้ากับธีมและบรรยากาศของโรงแรมที่หลากหลาย',
    'col.view': 'ดูรายละเอียด',

    // Services
    'serv.title': 'บริการของเรา',
    'serv.hotel': 'ของใช้ในโรงแรม',
    'serv.hotel.desc': 'โซลูชันสิ่งอำนวยความสะดวกครบวงจรสำหรับโรงแรมและรีสอร์ทหรู ปรับแต่งให้เข้ากับแบรนด์ของคุณ',
    'serv.hospital': 'เวชภัณฑ์โรงพยาบาล',
    'serv.hospital.desc': 'ชุดดูแลสุขอนามัยที่ออกแบบมาเพื่อความสะอาดและสะดวกสบายสำหรับโรงพยาบาลโดยเฉพาะ',
    'serv.oem': 'รับผลิต OEM',
    'serv.oem.desc': 'บริการผลิตสินค้าตามแบรนด์ของคุณ (OEM) ครบวงจร ด้วยมาตรฐานคุณภาพสูงและจำนวนขั้นต่ำที่ยืดหยุ่น',

    // CTA
    'cta.title': 'พร้อมยกระดับของใช้ในโรงแรมหรือยัง?',
    'cta.desc': 'ติดต่อเราวันนี้เพื่อขอแคตตาล็อกหรือนัดหมายปรึกษากับทีมออกแบบของเรา',
    'cta.btn': 'ติดต่อเราทันที',

    // Footer
    'footer.desc': 'ยกระดับประสบการณ์การบริการผ่านสิ่งอำนวยความสะดวกระดับพรีเมียมและการออกแบบที่ใส่ใจ ตั้งแต่ปี 2010',
    'footer.company': 'บริษัท',
    'footer.privacy': 'นโยบายความเป็นส่วนตัว',
    'footer.rights': 'สงวนลิขสิทธิ์',

    // About
    'about.title': 'เรื่องราวของเรา',
    'about.desc': 'มุ่งมั่นยกระดับประสบการณ์การบริการด้วยคุณภาพที่ยอดเยี่ยมและการออกแบบที่ยั่งยืนมาตั้งแต่ปี 2010',
    'about.vision': 'วิสัยทัศน์และพันธกิจ',
    'about.vision.desc1': 'ที่ Onework เราเชื่อว่าทุกรายละเอียดมีความสำคัญ พันธกิจของเราคือการส่งมอบของใช้ในโรงแรมที่ไม่เพียงแต่ได้มาตรฐานความสะอาดและคุณภาพสูงสุด แต่ยังสร้างความประทับใจให้แก่ผู้เข้าพัก',
    'about.vision.desc2': 'เรามุ่งมั่นในความยั่งยืน นวัตกรรม และความเป็นเลิศในการออกแบบ เราทำงานร่วมกับพันธมิตรอย่างใกล้ชิดเพื่อสร้างสรรค์สินค้าที่สะท้อนเอกลักษณ์ของแบรนด์',
    'about.manufacture': 'ความเป็นเลิศในการผลิต',
    'about.manufacture.desc': 'โรงงานผลิตที่ทันสมัยของเราได้รับการรับรองมาตรฐาน GMP (Good Manufacturing Practice) เราควบคุมทุกขั้นตอนการผลิตเพื่อให้มั่นใจในความสม่ำเสมอและความปลอดภัย',
    'about.list.1': 'โรงงานได้รับรองมาตรฐาน GMP',
    'about.list.2': 'กระบวนการผลิตที่เป็นมิตรต่อสิ่งแวดล้อม',
    'about.list.3': 'การควบคุมคุณภาพ (QC) ที่เข้มงวด',
    'about.list.4': 'การจัดหาวัสดุที่ยั่งยืน',

    // Collections Page
    'col.page.title': 'สินค้าของเรา',
    'col.page.desc': 'เลือกชมของใช้ในโรงแรมระดับพรีเมียมหลากหลายรายการ แบ่งตามธีมและบรรยากาศ',
    'col.filter.all': 'ทั้งหมด',

    // Customers Page
    'cust.title': 'ลูกค้าคนสำคัญของเรา',
    'cust.desc': 'เราภูมิใจที่ได้ให้บริการแก่ชื่อเสียงที่ได้รับการยอมรับมากที่สุดในอุตสาหกรรมการบริการ',

    // FAQ
    'faq.title': 'คำถามที่พบบ่อย',
    'faq.desc': 'ค้นหาคำตอบสำหรับคำถามทั่วไปเกี่ยวกับสินค้า ขั้นตอนการสั่งซื้อ และตัวเลือกการปรับแต่ง',
    'faq.still': 'ยังมีคำถามเพิ่มเติม?',
    'faq.support': 'ติดต่อฝ่ายบริการลูกค้า',
    'faq.q1': 'รับทำแบรนด์สินค้า (OEM) หรือไม่?',
    'faq.a1': 'ใช่ เราเชี่ยวชาญด้านบริการ OEM เราสามารถปรับแต่งบรรจุภัณฑ์ กลิ่น สูตร และโลโก้ให้ตรงกับแบรนด์โรงแรมของคุณ โดยมีจำนวนสั่งผลิตขั้นต่ำ (MOQ)',
    'faq.q2': 'จำนวนสั่งซื้อขั้นต่ำคือเท่าไหร่?',
    'faq.a2': 'สำหรับสินค้ามาตรฐาน ขั้นต่ำคือ 1 ลังต่อรายการ สำหรับงานสั่งผลิต OEM ขั้นต่ำมักจะเริ่มต้นที่ 5,000 ชิ้นต่อรายการ แต่ขึ้นอยู่กับประเภทของสินค้า',
    'faq.q3': 'สินค้าเป็นมิตรต่อสิ่งแวดล้อมหรือไม่?',
    'faq.a3': 'เรามีสินค้ากลุ่มรักษ์โลกหลายรายการ เช่น คอลเลกชัน \'Pure Natural\' เราใช้พลาสติกย่อยสลายได้ ฟางข้าวสาลี ไม้ไผ่ และบรรจุภัณฑ์กระดาษรีไซเคิล เราพัฒนานวัตกรรมอย่างต่อเนื่องเพื่อลดผลกระทบต่อสิ่งแวดล้อม',
    'faq.q4': 'ใช้เวลาจัดส่งนานเท่าไหร่?',
    'faq.a4': 'สำหรับสินค้าที่มีในสต็อก การจัดส่งภายในประเทศไทยใช้เวลา 3-5 วันทำการ สำหรับคำสั่งซื้อต่างประเทศหรืองานสั่งผลิต ระยะเวลาจะแจ้งให้ทราบในใบเสนอราคา',
    'faq.q5': 'ขอตัวอย่างสินค้าได้หรือไม่?',
    'faq.a5': 'ได้แน่นอน เรายินดีส่งตัวอย่างเพื่อตรวจสอบคุณภาพ โปรดติดต่อทีมขายของเราเพื่อขอชุดตัวอย่าง',

    // Contact
    'contact.title': 'ติดต่อเรา',
    'contact.desc': 'เรายินดีรับฟังจากคุณ ไม่ว่าคุณจะมีคำถามเกี่ยวกับสินค้า ราคา หรือโปรเจกต์สั่งทำ ทีมงานของเราพร้อมให้ความช่วยเหลือ',
    'contact.info': 'ข้อมูลการติดต่อ',
    'contact.head': 'สำนักงานใหญ่',
    'contact.phone': 'เบอร์โทรศัพท์',
    'contact.email': 'อีเมล',
    'contact.hours': 'เวลาทำการ',
    'contact.hours.desc': 'จันทร์ - ศุกร์: 9:00 - 18:00 น.',
    'contact.hours.closed': 'เสาร์ - อาทิตย์: ปิดทำการ',
    'contact.form.title': 'ส่งข้อความหาเรา',
    'contact.form.desc': 'กรอกแบบฟอร์มด้านล่าง แล้วเราจะติดต่อกลับโดยเร็วที่สุด',
    'contact.form.fname': 'ชื่อจริง',
    'contact.form.lname': 'นามสกุล',
    'contact.form.email': 'อีเมล',
    'contact.form.subject': 'หัวข้อ',
    'contact.form.message': 'ข้อความ',
    'contact.form.send': 'ส่งข้อความ',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
