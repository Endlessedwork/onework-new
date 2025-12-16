import { Link } from "wouter";
import { useLanguage } from "@/lib/i18n";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-primary text-white pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link href="/">
              <a className="text-3xl font-serif font-bold tracking-tight text-white">
                onework<span className="text-accent">.</span>
              </a>
            </Link>
            <p className="text-white/70 leading-relaxed">
              {t('footer.desc')}
            </p>
          </div>

          <div>
            <h4 className="text-lg font-serif font-semibold mb-6 text-accent">Collections</h4>
            <ul className="space-y-4">
              <li><Link href="/collections"><a className="text-white/70 hover:text-white transition-colors">Sea Breeze</a></Link></li>
              <li><Link href="/collections"><a className="text-white/70 hover:text-white transition-colors">Flower Blossom</a></Link></li>
              <li><Link href="/collections"><a className="text-white/70 hover:text-white transition-colors">Lavender Dreams</a></Link></li>
              <li><Link href="/collections"><a className="text-white/70 hover:text-white transition-colors">Pure Natural</a></Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-serif font-semibold mb-6 text-accent">{t('footer.company')}</h4>
            <ul className="space-y-4">
              <li><Link href="/about"><a className="text-white/70 hover:text-white transition-colors">{t('nav.about')}</a></Link></li>
              <li><Link href="/"><a className="text-white/70 hover:text-white transition-colors">{t('nav.home')}</a></Link></li>
              <li><Link href="/contact"><a className="text-white/70 hover:text-white transition-colors">{t('nav.contact')}</a></Link></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">{t('footer.privacy')}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-serif font-semibold mb-6 text-accent">{t('nav.contact')}</h4>
            <address className="not-italic text-white/70 space-y-4">
              <p>123 Sukhumvit Road,<br />Bangkok, Thailand 10110</p>
              <p>+66 2 123 4567</p>
              <p>hello@onework.co.th</p>
            </address>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-white/40 text-sm">
          <p>&copy; {new Date().getFullYear()} Onework Co., Ltd. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
}
