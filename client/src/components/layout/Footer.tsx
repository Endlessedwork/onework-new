import { Link } from "wouter";
import { useLanguage } from "@/lib/i18n";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

export function Footer() {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="space-y-4">
            <Link href="/">
              <span className="text-3xl font-heading font-bold tracking-tight text-white cursor-pointer">
                onework<span className="text-accent">.</span>
              </span>
            </Link>
            <p className="text-white/70 leading-relaxed text-sm">
              {language === 'en' 
                ? 'Premium hotel amenities supplier serving hotels, resorts, and hospitals across Thailand and Southeast Asia since 2010.'
                : 'ผู้จัดจำหน่ายอุปกรณ์โรงแรมพรีเมียม ให้บริการโรงแรม รีสอร์ท และโรงพยาบาลทั่วประเทศไทยและเอเชียตะวันออกเฉียงใต้ตั้งแต่ปี 2553'}
            </p>
          </div>

          <div>
            <h4 className="text-lg font-heading font-semibold mb-5 text-accent">
              {language === 'en' ? 'Product Series' : 'ซีรีส์สินค้า'}
            </h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/collections"><span className="text-white/70 hover:text-white transition-colors cursor-pointer">Budget Series</span></Link></li>
              <li><Link href="/collections"><span className="text-white/70 hover:text-white transition-colors cursor-pointer">Standard Series</span></Link></li>
              <li><Link href="/collections"><span className="text-white/70 hover:text-white transition-colors cursor-pointer">Premium Series</span></Link></li>
              <li><Link href="/collections"><span className="text-white/70 hover:text-white transition-colors cursor-pointer">Luxury Series</span></Link></li>
              <li><Link href="/collections"><span className="text-white/70 hover:text-white transition-colors cursor-pointer">Earth Series</span></Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-heading font-semibold mb-5 text-accent">
              {language === 'en' ? 'Quick Links' : 'ลิงก์ด่วน'}
            </h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/"><span className="text-white/70 hover:text-white transition-colors cursor-pointer">{language === 'en' ? 'Home' : 'หน้าหลัก'}</span></Link></li>
              <li><Link href="/collections"><span className="text-white/70 hover:text-white transition-colors cursor-pointer">{language === 'en' ? 'Products' : 'สินค้า'}</span></Link></li>
              <li><Link href="/customers"><span className="text-white/70 hover:text-white transition-colors cursor-pointer">{language === 'en' ? 'Our Customers' : 'ลูกค้าของเรา'}</span></Link></li>
              <li><Link href="/about"><span className="text-white/70 hover:text-white transition-colors cursor-pointer">{language === 'en' ? 'About Us' : 'เกี่ยวกับเรา'}</span></Link></li>
              <li><Link href="/contact"><span className="text-white/70 hover:text-white transition-colors cursor-pointer">{language === 'en' ? 'Contact' : 'ติดต่อเรา'}</span></Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-heading font-semibold mb-5 text-accent">
              {language === 'en' ? 'Contact Us' : 'ติดต่อเรา'}
            </h4>
            <address className="not-italic text-white/70 space-y-3 text-sm">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-accent" />
                <span>
                  {language === 'en' 
                    ? '75/5 Moo 6, Soi Tha Sai, Pu Chao Saming Phrai Road, Samrong, Phra Pradaeng, Samut Prakan 10130'
                    : '75/5 หมู่ 6 ซอยท่าทราย ถ.ปู่เจ้าสมิงพราย ต.สำโรง อ.พระประแดง จ.สมุทรปราการ 10130'}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0 text-accent" />
                <a href="tel:0628628877" className="hover:text-white transition-colors">062-862-8877</a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0 text-accent" />
                <a href="mailto:contact@oneworkproduct.com" className="hover:text-white transition-colors">contact@oneworkproduct.com</a>
              </p>
              <p className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 flex-shrink-0 text-accent" />
                <span>Line: @onework</span>
              </p>
            </address>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-white/40 text-sm">
          <p>&copy; {new Date().getFullYear()} Onework Co., Ltd. {language === 'en' ? 'All rights reserved.' : 'สงวนลิขสิทธิ์'}</p>
          <div className="flex gap-6">
            <Link href="/faq"><span className="hover:text-white transition-colors cursor-pointer">{language === 'en' ? 'FAQ' : 'คำถามที่พบบ่อย'}</span></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
