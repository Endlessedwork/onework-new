import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@assets/generated_images/luxury_hotel_amenities_hero_shot.png";

export function Hero() {
  return (
    <section className="relative h-screen min-h-[600px] w-full overflow-hidden flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Luxury Hotel Amenities"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" /> {/* Subtle overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <span className="inline-block py-1 px-3 rounded-full bg-white/30 backdrop-blur-sm border border-white/40 text-white text-xs font-semibold tracking-wider uppercase mb-6">
            Premium Hotel Supplies
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-6 drop-shadow-sm leading-tight">
            Elevate Your <br />
            <span className="italic font-light">Guest Experience</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
            Curated collections of premium amenities designed to bring the soothing
            essence of nature to your hotel, resort, or spa.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="rounded-full px-8 py-6 text-lg bg-white text-primary hover:bg-gray-100 border-none shadow-lg transition-transform hover:scale-105"
            >
              Explore Collections
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-8 py-6 text-lg border-white text-white hover:bg-white/20 backdrop-blur-sm transition-transform hover:scale-105"
            >
              Contact Sales <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
