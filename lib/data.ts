import type {
  Product, Category, Testimonial, HeroSlide, NavMenu, Review
} from "./types";

// ─── PRODUCTS: POS Systems & IT Hardware ──────────────────────────────────────
export const PRODUCTS: Product[] = [
  {
    id: 33,
    discountPct: 18,
    slug: "honeywell-pc42t-label-printer",
    name: "Honeywell PC42t Desktop Label Printer",
    brand: "Honeywell",
    price: 899,
    originalPrice: 1099,
    isNew: true,
    isBestSeller: true,
    rating: 4.8,
    reviews: 542,
    colors: [{ name: "Gray", hex: "#D1D5DB" }],
    sizes: ["4 Inch"],
    badge: "WAREHOUSE",
    badgeColor: "#0F766E",
    images: [
      "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=1200&q=90",
      "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?w=1200&q=90",
      "https://images.unsplash.com/photo-1516321165247-4aa89a48be28?w=1200&q=90",
      "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?w=1200&q=90"
    ],
    tags: ["Label Printing", "USB", "Barcode", "203 DPI"],
    description: "Compact desktop barcode and label printer designed for warehouses and retail inventory management.",
    category: "Label Printers",
    stock: 22,
    sku: "HW-PC42T",
    brand_logo: "Honeywell",
  },

  {
    id: 34,
    discountPct: 12,
    slug: "zebra-tc22-mobile-computer",
    name: "Zebra TC22 Mobile Computer",
    brand: "Zebra",
    price: 2499,
    originalPrice: 2799,
    isNew: true,
    isBestSeller: true,
    rating: 4.9,
    reviews: 218,
    colors: [{ name: "Black", hex: "#111827" }],
    sizes: ["6 Inch"],
    badge: "MOBILE POS",
    badgeColor: "#7C3AED",
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=90",
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&q=90",
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=1200&q=90",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=90"
    ],
    tags: ["Android", "Inventory", "Barcode", "WiFi 6"],
    description: "Enterprise-grade handheld mobile computer for inventory, warehousing, and field sales.",
    category: "Mobile Computers",
    stock: 14,
    sku: "ZEB-TC22",
    brand_logo: "Zebra",
  },

  {
    id: 35,
    discountPct: 15,
    slug: "datalogic-magellan-3450vsi",
    name: "Datalogic Magellan 3450VSi",
    brand: "Datalogic",
    price: 1699,
    originalPrice: 1999,
    isNew: false,
    isBestSeller: true,
    rating: 4.8,
    reviews: 187,
    colors: [{ name: "Black", hex: "#111827" }],
    sizes: ["Counter Scanner"],
    badge: "RETAIL",
    badgeColor: "#0891B2",
    images: [
      "https://images.unsplash.com/photo-1607522370275-f6fd21f7a10f?w=1200&q=90",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=90",
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=90",
      "https://images.unsplash.com/photo-1581091215367-59ab6dcef10f?w=1200&q=90"
    ],
    tags: ["1D", "2D", "QR", "Retail Checkout"],
    description: "High-performance presentation scanner for supermarket and retail checkout counters.",
    category: "Scanners",
    stock: 19,
    sku: "DAT-3450",
    brand_logo: "Datalogic",
  },

  {
    id: 36,
    discountPct: 10,
    slug: "zkteco-f18-attendance",
    name: "ZKTeco F18 Access Control Terminal",
    brand: "ZKTeco",
    price: 699,
    originalPrice: 799,
    isNew: false,
    isBestSeller: true,
    rating: 4.7,
    reviews: 395,
    colors: [{ name: "Black", hex: "#111827" }],
    sizes: ["Fingerprint"],
    badge: "SECURITY",
    badgeColor: "#DC2626",
    images: [
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=90",
      "https://images.unsplash.com/photo-1581091215367-59ab6dcef10f?w=1200&q=90",
      "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?w=1200&q=90",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=90"
    ],
    tags: ["Fingerprint", "RFID", "Access Control"],
    description: "Professional biometric access control and employee attendance system.",
    category: "Security",
    stock: 38,
    sku: "ZKT-F18",
    brand_logo: "ZKTeco",
  },

  {
    id: 37,
    discountPct: 20,
    slug: "ups-1500va-online",
    name: "PowerGuard 1500VA Online UPS",
    brand: "PowerGuard",
    price: 899,
    originalPrice: 1129,
    isNew: true,
    isBestSeller: false,
    rating: 4.6,
    reviews: 154,
    colors: [{ name: "Black", hex: "#111827" }],
    sizes: ["1500VA"],
    badge: "POWER",
    badgeColor: "#EA580C",
    images: [
      "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?w=1200&q=90",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=90",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=90",
      "https://images.unsplash.com/photo-1516321165247-4aa89a48be28?w=1200&q=90"
    ],
    tags: ["UPS", "Backup", "Pure Sine Wave"],
    description: "Online UPS system designed for POS counters, servers, and networking equipment.",
    category: "Power Solutions",
    stock: 17,
    sku: "PG-UPS1500",
    brand_logo: "PowerGuard",
  },

  {
    id: 38,
    discountPct: 22,
    slug: "atacc-restaurant-pos",
    name: "atACC Restaurant POS Professional",
    brand: "atACC",
    price: 1499,
    originalPrice: 1899,
    isNew: true,
    isBestSeller: true,
    rating: 5.0,
    reviews: 847,
    colors: [{ name: "Digital", hex: "#A16207" }],
    sizes: ["Unlimited Terminals"],
    badge: "SOFTWARE",
    badgeColor: "#0891B2",
    images: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=90",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=90",
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=90",
      "https://images.unsplash.com/photo-1556155092-490a1ba16284?w=1200&q=90"
    ],
    tags: ["Restaurant", "Kitchen Display", "Delivery"],
    description: "Complete restaurant POS solution with table management and kitchen display integration.",
    category: "Software",
    stock: 999,
    sku: "ATACC-REST",
    brand_logo: "atACC",
  },

  {
    id: 39,
    discountPct: 14,
    slug: "cctv-kit-8-channel",
    name: "SecureVision 8 Channel CCTV Kit",
    brand: "SecureVision",
    price: 1299,
    originalPrice: 1499,
    isNew: false,
    isBestSeller: true,
    rating: 4.7,
    reviews: 261,
    colors: [{ name: "White", hex: "#F8FAFC" }],
    sizes: ["8 Camera Kit"],
    badge: "SURVEILLANCE",
    badgeColor: "#DC2626",
    images: [
      "https://images.unsplash.com/photo-1558002038-1055907df827?w=1200&q=90",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=90",
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=90",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=90"
    ],
    tags: ["1080P", "Night Vision", "NVR"],
    description: "Commercial CCTV surveillance kit for retail stores and warehouses.",
    category: "Security",
    stock: 11,
    sku: "SV-CCTV8",
    brand_logo: "SecureVision",
  },

  {
    id: 40,
    discountPct: 16,
    slug: "synology-ds223-nas",
    name: "Synology DS223 NAS Storage",
    brand: "Synology",
    price: 1199,
    originalPrice: 1429,
    isNew: true,
    isBestSeller: false,
    rating: 4.9,
    reviews: 173,
    colors: [{ name: "Black", hex: "#111827" }],
    sizes: ["2 Bay"],
    badge: "STORAGE",
    badgeColor: "#1E40AF",
    images: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=90",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=90",
      "https://images.unsplash.com/photo-1516321165247-4aa89a48be28?w=1200&q=90",
      "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?w=1200&q=90"
    ],
    tags: ["Backup", "Cloud", "RAID"],
    description: "Network-attached storage solution for ERP backups and business data protection.",
    category: "Storage",
    stock: 16,
    sku: "SYN-DS223",
    brand_logo: "Synology",
  },

  {
    id: 41,
    discountPct: 11,
    slug: "partnertech-cd7220-display",
    name: "PartnerTech CD7220 Customer Display",
    brand: "PartnerTech",
    price: 329,
    originalPrice: 369,
    isNew: false,
    isBestSeller: false,
    rating: 4.6,
    reviews: 119,
    colors: [{ name: "Black", hex: "#111827" }],
    sizes: ["2x20 VFD"],
    badge: "DISPLAY",
    badgeColor: "#0891B2",
    images: [
      "https://images.unsplash.com/photo-1516321165247-4aa89a48be28?w=1200&q=90",
      "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=1200&q=90",
      "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?w=1200&q=90",
      "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=1200&q=90"
    ],
    tags: ["USB", "VFD", "Arabic"],
    description: "Professional customer-facing display for retail billing counters.",
    category: "Displays",
    stock: 29,
    sku: "PT-CD7220",
    brand_logo: "PartnerTech",
  },

  {
    id: 42,
    discountPct: 13,
    slug: "star-micronics-mc-print3",
    name: "Star Micronics mC-Print3",
    brand: "Star",
    price: 799,
    originalPrice: 919,
    isNew: true,
    isBestSeller: true,
    rating: 4.8,
    reviews: 344,
    colors: [{ name: "White", hex: "#F8FAFC" }],
    sizes: ["80mm"],
    badge: "PREMIUM",
    badgeColor: "#A16207",
    images: [
      "https://images.unsplash.com/photo-1612298498547-b4e9975a83be?w=1200&q=90",
      "https://images.unsplash.com/photo-1516321165247-4aa89a48be28?w=1200&q=90",
      "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=1200&q=90",
      "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?w=1200&q=90"
    ],
    tags: ["Cloud Printing", "Bluetooth", "USB-C"],
    description: "Modern cloud-ready receipt printer supporting retail and hospitality businesses.",
    category: "Printers",
    stock: 31,
    sku: "STAR-MCP3",
    brand_logo: "Star",
  }
];

// ─── CATEGORIES ──────────────────────────────────────────────────────────────
export const CATEGORIES: Category[] = [
  { name: "POS Systems", count: 45, img: "photo-1556742502-ec7c0e9f34b1", color: "#A16207" },
  { name: "Printers", count: 32, img: "photo-1612298498547-b4e9975a83be", color: "#1C1917" },
  { name: "Scanners", count: 28, img: "photo-1558618666-fcd25c85cd64", color: "#059669" },
  { name: "Displays", count: 19, img: "photo-1526374965328-7f61d4dc18c5", color: "#0891B2" },
  { name: "Software", count: 12, img: "photo-1551288049-bebda4e38f71", color: "#7C3AED" },
  { name: "Cash Management", count: 23, img: "photo-1563013544-824ae1b704d3", color: "#B85C38" },
];

// ─── HERO SLIDES ─────────────────────────────────────────────────────────────
export const HERO_SLIDES: HeroSlide[] = [
  // {
  //   id: 1,
  //   eyebrow: "QATAR'S #1 POS SOLUTIONS",
  //   title: "Smarter POS.\nBetter Business.",
  //   accent: "Built for Qatar.",
  //   desc: "From single-store retail to enterprise chains — complete POS hardware, software, and ERP integration. All Qatar VAT compliant.",
  //   cta: "Shop POS Systems",
  //   cta2: "View All Products",
  //   img: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=1400&q=90",
  //   // accent2: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&q=85",
  // },
  {
    id: 1,
    eyebrow: "QATAR'S #1 INVENTORY SOLUTIONS",
    title: "Smarter Inventory.\nBetter Business.",
    accent: "Built for Qatar.",
    desc: "Manage stock with confidence using intelligent inventory solutions for retail, wholesale, warehouses, and enterprise businesses. Real-time tracking, barcode support, and Qatar VAT compliant.",
    cta: "Shop Inventory Solutions",
    cta2: "Explore Inventory Products",
    // img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1400&q=90",
    img: "https://www.logicerp.com/blog/wp-content/uploads/2026/01/Blog-Banner-95.jpg",
    // accent2: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=600&q=85",
  },
  {
    id: 2,
    eyebrow: "atACC ERP SOFTWARE",
    title: "Complete Retail\nERP Solution.",
    accent: "VAT Ready.",
    desc: "Qatar VAT-compliant accounting, inventory, POS & CRM in one platform. Trusted by 1,300+ businesses in Doha.",
    cta: "Explore atACC ERP",
    cta2: "Book Free Demo",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&q=90",
    // accent2: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=85",
  },
  {
    id: 3,
    eyebrow: "RESTAURANT & HOSPITALITY",
    title: "POS Built for\nRestaurants.",
    accent: "Zero Downtime.",
    desc: "Kitchen display, table management, and multi-branch sync. Tested in 200+ Doha restaurants.",
    cta: "Shop Restaurant POS",
    cta2: "See Features",
    img: "https://images.unsplash.com/photo-1586864030223-a918b07d357d?q=80&w=1625&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    // accent2: "https://images.unsplash.com/photo-1612298498547-b4e9975a83be?w=600&q=85",
  },
];

// ─── NAV MENUS ───────────────────────────────────────────────────────────────
export const NAV_MENUS: Record<string, NavMenu> = {
  Products: {
    featured: ["New Arrivals", "Bestsellers", "POS Bundles", "Software Deals"],
    shoes: ["POS Systems", "Printers", "Scanners", "Cash Drawers", "Displays", "Software", "Networking"],
    favorites: ["atACC POS Pro 15\"", "ThermalJet Printer", "atACC Software", "KDS Display"],
    apparel: ["Training Services", "Installation", "Annual Maintenance"],
    imgs: [
      { url: "photo-1556742502-ec7c0e9f34b1", label: "POS Pro 15\"", price: "QAR 2,899" },
      { url: "photo-1551288049-bebda4e38f71", label: "atACC ERP", price: "QAR 799" },
    ],
  },
  Solutions: {
    featured: ["Retail POS", "Restaurant POS", "Pharmacy POS", "Supermarket POS"],
    shoes: ["Healthcare", "Education", "Hospitality", "Logistics", "Service Centers"],
    favorites: ["atACC ERP", "atACC HR", "atACC CRM", "Cloud ERP"],
    apparel: ["Consulting", "Implementation", "Support"],
    imgs: [
      { url: "photo-1589492477829-5e65395b66cc", label: "Restaurant POS", price: "QAR 1,799" },
      { url: "photo-1526374965328-7f61d4dc18c5", label: "KDS Display", price: "QAR 1,299" },
    ],
  },
  Deals: {
    featured: ["Clearance Sale", "Bundle Deals"],
    shoes: ["POS Bundles", "Software + Hardware"],
    favorites: [],
    apparel: ["Service Contracts"],
    imgs: [
      { url: "photo-1563013544-824ae1b704d3", label: "POS Bundle", price: "From QAR 999" },
      { url: "photo-1612298498547-b4e9975a83be", label: "Printer Deals", price: "Up to 20% off" },
    ],
  },
};

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1, name: "Ahmed Al-Mansoori", role: "Owner, Tamim Supermarket", rating: 5,
    text: "Skynet installed the full POS system with atACC ERP across all 3 of our branches in Doha. Zero downtime, perfect VAT reporting. Their support team is available 24/7.",
    product: "atACC POS Pro 15\"",
  },
  {
    id: 2, name: "Priya Nair", role: "Finance Manager, Al Rawabi Group", rating: 5,
    text: "The atACC ERP handles our entire accounting workflow — from invoicing to VAT filing to inventory. We processed QAR 2.4M in sales last month with zero issues.",
    product: "atACC ERP Software",
  },
  {
    id: 3, name: "Mohammed Al-Thani", role: "Operations Head, Lusail Mall Branch", rating: 5,
    text: "The restaurant POS with KDS integration transformed our kitchen workflow. Orders go from POS to kitchen in real-time. Wait times dropped by 30%.",
    product: "KitchenView KDS 15\"",
  },
];

// ─── REVIEWS ─────────────────────────────────────────────────────────────────
export const REVIEWS: Review[] = [
  {
    id: 1, productId: 1, name: "Ahmed Al-Mansoori", location: "Doha, Qatar", rating: 5,
    title: "Best POS system we've used", date: "Jan 15, 2025", variant: "Space Black · 15\"",
    text: "Installed across 3 locations. The 15\" touch screen is super responsive, and atACC integration was plug-and-play. VAT reports are automatic.",
    helpful: 84, verified: true,
  },
  {
    id: 2, productId: 1, name: "Kaveh S.", location: "West Bay, Qatar", rating: 5,
    title: "Fanless and silent — perfect for quiet cafes", date: "Dec 28, 2024", variant: "Silver · 15\"",
    text: "The fanless design is a game-changer for our upscale cafe. No noise, no overheating after 12-hour days, and the display looks premium on our counter.",
    helpful: 62, verified: true,
  },
  {
    id: 3, productId: 1, name: "Layla M.", location: "Al Wakra, Qatar", rating: 4,
    title: "Great hardware, setup took time", date: "Nov 30, 2024", variant: "Space Black · 15\"",
    text: "The hardware is excellent quality. Initial atACC configuration took a day with Skynet's tech team, but since then it has been flawless.",
    helpful: 41, verified: true,
  },
  {
    id: 4, productId: 3, name: "Sarah K.", location: "The Pearl, Qatar", rating: 5,
    title: "300mm/s is blazing fast", date: "Jan 2, 2025", variant: "White · 80mm",
    text: "We print 400+ receipts daily. Zero jams in 3 months. Auto-cut is smooth and the Wi-Fi connection has been rock solid throughout.",
    helpful: 98, verified: true,
  },
  {
    id: 5, productId: 11, name: "Rajesh P.", location: "Lusail, Qatar", rating: 5,
    title: "Best ERP for Qatar SMEs", date: "Jan 10, 2025", variant: "1 Store License",
    text: "We switched from a manual system to atACC ERP 6 months ago. VAT filing takes 10 minutes instead of 2 days. Cloud backup is automatic. Worth every riyal.",
    helpful: 234, verified: true,
  },
  {
    id: 6, productId: 11, name: "Fatima H.", location: "Doha, Qatar", rating: 5,
    title: "Arabic interface is perfect", date: "Dec 15, 2024", variant: "3 Stores License",
    text: "Full Arabic interface support made adoption seamless for our staff. The POS, inventory, and accounting are all in one. Skynet support answered every question quickly.",
    helpful: 187, verified: true,
  },
];

// ─── SHOP HELPERS ────────────────────────────────────────────────────────────
export const PRICE_MAX = 3500;

export const SHOP_CATEGORIES = [
  ...CATEGORIES.map(c => c.name),
  ...Array.from(new Set(PRODUCTS.map(p => p.category).filter(Boolean) as string[])).filter(
    n => !CATEGORIES.some(c => c.name === n)
  ),
];

export const getCategoryCount = (name: string): number =>
  PRODUCTS.filter(p => p.category === name).length;

// ─── FORMAT CURRENCY ─────────────────────────────────────────────────────────
export const fmt = (n: number): string =>
  `QAR ${n.toLocaleString("en-QA", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
