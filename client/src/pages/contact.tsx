import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import imgOffice from "@assets/generated_images/modern_office_building_exterior.png";

export default function Contact() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />
      <main className="pt-24">
        <section className="bg-primary text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
              Get in Touch
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              We'd love to hear from you. Whether you have a question about our collections, pricing, or custom projects, our team is ready to help.
            </p>
          </div>
        </section>

        <section className="py-20 container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-10"
            >
              <div>
                <h2 className="text-3xl font-serif font-bold text-primary mb-6">Contact Information</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shrink-0 text-primary">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Head Office</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        123 Sukhumvit Road, Watthana,<br />
                        Bangkok 10110, Thailand
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shrink-0 text-primary">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Phone</h3>
                      <p className="text-muted-foreground">
                        +66 2 123 4567<br />
                        +66 81 987 6543
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shrink-0 text-primary">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Email</h3>
                      <p className="text-muted-foreground">
                        hello@onework.co.th<br />
                        sales@onework.co.th
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shrink-0 text-primary">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Business Hours</h3>
                      <p className="text-muted-foreground">
                        Monday - Friday: 9:00 AM - 6:00 PM<br />
                        Saturday - Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden shadow-lg h-[300px]">
                <img src={imgOffice} alt="Office Building" className="w-full h-full object-cover" />
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100"
            >
              <h2 className="text-3xl font-serif font-bold text-primary mb-2">Send us a Message</h2>
              <p className="text-muted-foreground mb-8">Fill out the form below and we'll get back to you shortly.</p>
              
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/80">First Name</label>
                    <Input placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/80">Last Name</label>
                    <Input placeholder="Doe" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80">Email Address</label>
                  <Input type="email" placeholder="john@company.com" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80">Subject</label>
                  <Input placeholder="Product Inquiry" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80">Message</label>
                  <Textarea placeholder="Tell us about your requirements..." className="min-h-[150px]" />
                </div>

                <Button className="w-full rounded-full h-12 text-lg" size="lg">
                  Send Message
                </Button>
              </form>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
