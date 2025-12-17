import { db } from "./db";
import { users, products, settings } from "@shared/schema";
import { hashPassword } from "./auth";

async function seed() {
  console.log("🌱 Starting database seed...");

  // 1. Create admin user
  console.log("Creating admin user...");
  const hashedPassword = await hashPassword("admin123");
  
  const existingUsers = await db.select().from(users);
  if (existingUsers.length === 0) {
    await db.insert(users).values({
      username: "admin",
      password: hashedPassword,
    });
    console.log("✅ Admin user created (username: admin, password: admin123)");
  } else {
    console.log("⏭️  Admin user already exists");
  }

  // 2. Create sample products
  console.log("Creating sample products...");
  const existingProducts = await db.select().from(products);
  
  if (existingProducts.length === 0) {
    await db.insert(products).values([
      {
        name: "Sea Breeze Shampoo",
        nameEn: "Sea Breeze Shampoo",
        nameTh: "แชมพูทะเลสดชื่น",
        collection: "Sea Breeze",
        collectionEn: "Sea Breeze",
        collectionTh: "ทะเลสดชื่น",
        description: "Revitalizing shampoo with marine extracts for fresh, clean hair.",
        descriptionEn: "Revitalizing shampoo with marine extracts for fresh, clean hair.",
        descriptionTh: "แชมพูฟื้นฟูพลังผมด้วยสารสกัดจากทะเล เพื่อเส้นผมสะอาดสดชื่น",
        category: "Hair Care",
        imageUrl: "",
        isActive: true,
        sortOrder: 1,
      },
      {
        name: "Sea Breeze Shower Gel",
        nameEn: "Sea Breeze Shower Gel",
        nameTh: "เจลอาบน้ำทะเลสดชื่น",
        collection: "Sea Breeze",
        collectionEn: "Sea Breeze",
        collectionTh: "ทะเลสดชื่น",
        description: "Refreshing body wash for a morning wake-up.",
        descriptionEn: "Refreshing body wash for a morning wake-up.",
        descriptionTh: "ครีมอาบน้ำสดชื่นเพื่อการตื่นนอนที่สดใส",
        category: "Body Care",
        imageUrl: "",
        isActive: true,
        sortOrder: 2,
      },
      {
        name: "Flower Blossom Body Lotion",
        nameEn: "Flower Blossom Body Lotion",
        nameTh: "โลชั่นบอดี้กลิ่นดอกไม้",
        collection: "Flower Blossom",
        collectionEn: "Flower Blossom",
        collectionTh: "ดอกไม้บาน",
        description: "Hydrating lotion with sweet floral scent.",
        descriptionEn: "Hydrating lotion with sweet floral scent.",
        descriptionTh: "โลชั่นบำรุงผิวให้ชุ่มชื้นพร้อมกลิ่นดอกไม้หวานละมุน",
        category: "Body Care",
        imageUrl: "",
        isActive: true,
        sortOrder: 3,
      },
      {
        name: "Flower Blossom Soap",
        nameEn: "Flower Blossom Soap",
        nameTh: "สบู่กลิ่นดอกไม้",
        collection: "Flower Blossom",
        collectionEn: "Flower Blossom",
        collectionTh: "ดอกไม้บาน",
        description: "Gentle cleansing bar with rose petals.",
        descriptionEn: "Gentle cleansing bar with rose petals.",
        descriptionTh: "สบู่ทำความสะอาดอ่อนโยนพร้อมกลีบกุหลาบ",
        category: "Body Care",
        imageUrl: "",
        isActive: true,
        sortOrder: 4,
      },
      {
        name: "Lavender Bath Salt",
        nameEn: "Lavender Bath Salt",
        nameTh: "เกลือผิวกลิ่นลาเวนเดอร์",
        collection: "Lavender Dreams",
        collectionEn: "Lavender Dreams",
        collectionTh: "ความฝันลาเวนเดอร์",
        description: "Relaxing bath salts for a spa-like experience.",
        descriptionEn: "Relaxing bath salts for a spa-like experience.",
        descriptionTh: "เกลืออาบน้ำผ่อนคลายเพื่อประสบการณ์เหมือนสปา",
        category: "Bath",
        imageUrl: "",
        isActive: true,
        sortOrder: 5,
      },
      {
        name: "Lavender Pillow Mist",
        nameEn: "Lavender Pillow Mist",
        nameTh: "สเปรย์หมอนกลิ่นลาเวนเดอร์",
        collection: "Lavender Dreams",
        collectionEn: "Lavender Dreams",
        collectionTh: "ความฝันลาเวนเดอร์",
        description: "Pillow mist to encourage deep sleep.",
        descriptionEn: "Pillow mist to encourage deep sleep.",
        descriptionTh: "สเปรย์หมอนเพื่อส่งเสริมการนอนหลับลึก",
        category: "Aromatherapy",
        imageUrl: "",
        isActive: true,
        sortOrder: 6,
      },
      {
        name: "Bamboo Toothbrush",
        nameEn: "Bamboo Toothbrush",
        nameTh: "แปรงสีฟันไม้ไผ่",
        collection: "Pure Natural",
        collectionEn: "Pure Natural",
        collectionTh: "ธรรมชาติบริสุทธิ์",
        description: "Eco-friendly toothbrush with charcoal bristles.",
        descriptionEn: "Eco-friendly toothbrush with charcoal bristles.",
        descriptionTh: "แปรงสีฟันเป็นมิตรกับสิ่งแวดล้อมพร้อมขนแปรงถ่าน",
        category: "Dental Care",
        imageUrl: "",
        isActive: true,
        sortOrder: 7,
      },
      {
        name: "Wheat Straw Comb",
        nameEn: "Wheat Straw Comb",
        nameTh: "หวีฟางข้าวสาลี",
        collection: "Pure Natural",
        collectionEn: "Pure Natural",
        collectionTh: "ธรรมชาติบริสุทธิ์",
        description: "Biodegradable comb for sustainable travel.",
        descriptionEn: "Biodegradable comb for sustainable travel.",
        descriptionTh: "หวีย่อยสลายได้ทางชีวภาพสำหรับการเดินทางอย่างยั่งยืน",
        category: "Hair Care",
        imageUrl: "",
        isActive: true,
        sortOrder: 8,
      },
    ]);
    console.log("✅ Sample products created");
  } else {
    console.log("⏭️  Products already exist");
  }

  // 3. Create default settings
  console.log("Creating default settings...");
  const existingSettings = await db.select().from(settings);
  
  if (existingSettings.length === 0) {
    await db.insert(settings).values([
      {
        key: "site_title_en",
        value: "onework - Premium Hotel Amenities",
        description: "Site title in English",
      },
      {
        key: "site_title_th",
        value: "onework - อุปกรณ์อำนวยความสะดวกโรงแรมพรีเมียม",
        description: "Site title in Thai",
      },
      {
        key: "contact_email",
        value: "info@onework.co.th",
        description: "Contact email address",
      },
      {
        key: "contact_phone",
        value: "+66 2 123 4567",
        description: "Contact phone number",
      },
      {
        key: "address",
        value: "Bangkok, Thailand",
        description: "Business address",
      },
      {
        key: "about_en",
        value: "We specialize in premium hotel amenities, bringing the soothing essence of nature to your hospitality business.",
        description: "About us text in English",
      },
      {
        key: "about_th",
        value: "เราเชี่ยวชาญด้านอุปกรณ์อำนวยความสะดวกสำหรับโรงแรมพรีเมียม นำเสนอความสงบจากธรรมชาติสู่ธุรกิจการต้อนรับของคุณ",
        description: "About us text in Thai",
      },
    ]);
    console.log("✅ Default settings created");
  } else {
    console.log("⏭️  Settings already exist");
  }

  console.log("\n🎉 Database seed completed!");
  console.log("\n📝 Login credentials:");
  console.log("   Username: admin");
  console.log("   Password: admin123");
  console.log("\n🔗 Admin panel: http://localhost:5000/admin/login");
}

seed()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
