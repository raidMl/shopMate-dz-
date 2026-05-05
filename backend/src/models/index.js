const mongoose = require("mongoose");

/* ==============================
   ALGERIAN WILAYAS (ALL 58)
================================*/
const WILAYAS = [
  "01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
  "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
  "21", "22", "23", "24", "25", "26", "27", "28", "29", "30",
  "31", "32", "33", "34", "35", "36", "37", "38", "39", "40",
  "41", "42", "43", "44", "45", "46", "47", "48", "49", "50",
  "51", "52", "53", "54", "55", "56", "57", "58"
];

/* ==============================
   DELIVERY PRICE SCHEMA (Dynamic)
================================*/
const deliveryPriceSchema = new mongoose.Schema({
  wilaya: { 
    type: String, 
    enum: WILAYAS,
    required: true,
    unique: true
  },
  domicile: { 
    type: Number, 
    required: true,
    description: "Price for home delivery"
  },
  bureau: { 
    type: Number, 
    required: true,
    description: "Price for office/desk delivery"
  },
  updatedAt: { type: Date, default: Date.now },
});

const DeliveryPrice = mongoose.model("DeliveryPrice", deliveryPriceSchema);

/* ==============================
   DEFAULT DELIVERY PRICES FOR ALL WILAYAS
================================*/
const DEFAULT_DELIVERY_PRICES = {
  "01": { "domicile": 70, "bureau": 50 },      // الجزائر البيضاء
  "02": { "domicile": 150, "bureau": 100 },    // الشلف
  "03": { "domicile": 180, "bureau": 120 },    // الأغواط
  "04": { "domicile": 200, "bureau": 130 },    // أم البواقي
  "05": { "domicile": 190, "bureau": 120 },    // باتنة
  "06": { "domicile": 170, "bureau": 110 },    // بجاية
  "07": { "domicile": 220, "bureau": 140 },    // بسكرة
  "08": { "domicile": 250, "bureau": 160 },    // بشار
  "09": { "domicile": 80, "bureau": 55 },      // البليدة
  "10": { "domicile": 90, "bureau": 60 },      // البويرة
  "11": { "domicile": 300, "bureau": 200 },    // تمنراست
  "12": { "domicile": 200, "bureau": 130 },    // تبسة
  "13": { "domicile": 160, "bureau": 105 },    // تلمسان
  "14": { "domicile": 170, "bureau": 110 },    // تيارت
  "15": { "domicile": 100, "bureau": 65 },     // تيزي وزو
  "16": { "domicile": 70, "bureau": 50 },      // الجزائر
  "17": { "domicile": 180, "bureau": 120 },    // الجلفة
  "18": { "domicile": 140, "bureau": 90 },     // جيجل
  "19": { "domicile": 160, "bureau": 105 },    // سطيف
  "20": { "domicile": 200, "bureau": 130 },    // السعيدة
  "21": { "domicile": 130, "bureau": 85 },     // سكيكدة
  "22": { "domicile": 150, "bureau": 100 },    // سيدي بلعباس
  "23": { "domicile": 110, "bureau": 70 },     // عنابة
  "24": { "domicile": 180, "bureau": 120 },    // قالمة
  "25": { "domicile": 120, "bureau": 80 },     // قسنطينة
  "26": { "domicile": 100, "bureau": 65 },     // المدية
  "27": { "domicile": 140, "bureau": 90 },     // مستغانم
  "28": { "domicile": 170, "bureau": 110 },    // المسيلة
  "29": { "domicile": 160, "bureau": 105 },    // معسكر
  "30": { "domicile": 240, "bureau": 150 },    // ورقلة
  "31": { "domicile": 100, "bureau": 70 },     // وهران
  "32": { "domicile": 270, "bureau": 170 },    // البيض
  "33": { "domicile": 280, "bureau": 180 },    // إليزي
  "34": { "domicile": 120, "bureau": 80 },     // برج بوعريريج
  "35": { "domicile": 80, "bureau": 55 },      // بومرداس
  "36": { "domicile": 150, "bureau": 100 },    // الطارف
  "37": { "domicile": 290, "bureau": 190 },    // تندوف
  "38": { "domicile": 160, "bureau": 105 },    // تسيمسيلت
  "39": { "domicile": 200, "bureau": 130 },    // الوادي
  "40": { "domicile": 210, "bureau": 140 },    // خنشلة
  "41": { "domicile": 190, "bureau": 120 },    // سوق أهراس
  "42": { "domicile": 100, "bureau": 65 },     // تيبازة
  "43": { "domicile": 180, "bureau": 120 },    // ميلة
  "44": { "domicile": 110, "bureau": 70 },     // عين الدفلى
  "45": { "domicile": 210, "bureau": 140 },    // النعامة
  "46": { "domicile": 140, "bureau": 90 },     // عين تموشنت
  "47": { "domicile": 120, "bureau": 80 },     // غرادية
  "48": { "domicile": 130, "bureau": 85 },     // غليزان
  "49": { "domicile": 260, "bureau": 170 },    // تيميمون
  "50": { "domicile": 270, "bureau": 180 },    // برج باجي مختار
  "51": { "domicile": 280, "bureau": 190 },    // أولاد جلال
  "52": { "domicile": 300, "bureau": 200 },    // بني عباس
  "53": { "domicile": 320, "bureau": 210 },    // عين صالح
  "54": { "domicile": 330, "bureau": 220 },    // عين قزام
  "55": { "domicile": 230, "bureau": 150 },    // توقرت
  "56": { "domicile": 350, "bureau": 230 },    // جانت
  "57": { "domicile": 310, "bureau": 210 },    // المغير
  "58": { "domicile": 300, "bureau": 200 }     // المنيعة
};

// Helper function to get delivery price from database (async)
const getDeliveryPrice = async (wilaya, deliveryType) => {
  try {
    const priceDoc = await DeliveryPrice.findOne({ wilaya });
    
    if (!priceDoc) {
      console.warn(`⚠️  Wilaya "${wilaya}" not found in database, using default price`);
      const defaultPrice = DEFAULT_DELIVERY_PRICES[wilaya]?.[deliveryType];
      if (!defaultPrice) {
        throw new Error(`Wilaya "${wilaya}" not found in default pricing`);
      }
      return defaultPrice;
    }

    const price = priceDoc[deliveryType];
    if (price === undefined) {
      throw new Error(`Delivery type "${deliveryType}" not available for wilaya "${wilaya}"`);
    }
    return price;
  } catch (error) {
    console.error(`Error fetching delivery price:`, error);
    throw error;
  }
};

// Synchronous version for backwards compatibility
const getDeliveryPriceSync = (wilaya, deliveryType) => {
  const wilayaPrices = DEFAULT_DELIVERY_PRICES[wilaya];
  if (!wilayaPrices) {
    throw new Error(`Wilaya "${wilaya}" not found in delivery pricing`);
  }
  const price = wilayaPrices[deliveryType];
  if (price === undefined) {
    throw new Error(`Delivery type "${deliveryType}" not available for wilaya "${wilaya}"`);
  }
  return price;
};

/* ==============================
   USER & ADMIN SCHEMA
================================*/
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin", "super_admin"], default: "user" },
  status: { type: String, enum: ["active", "inactive", "suspended"], default: "active" },
  site: { type: String, default: null }, // Site name/domain assigned to this admin
  permissions: {
    manageAdmins: { type: Boolean, default: false }, // Can create/delete/manage admins
    manageTheme: { type: Boolean, default: false },  // Can manage theme & settings
    viewStats: { type: Boolean, default: false },    // Can view statistics
    manageSite: { type: Boolean, default: false },   // Can manage site content
  },
  createdAt: { type: Date, default: Date.now },
  endAccessDate: { type: Date, default: Date.now+30*24*60*60*1000 }, // For temporary access control (30 days)
  lastLogin: { type: Date, default: null },
});

const User = mongoose.model("User", userSchema);

/* ==============================
   CATEGORY SCHEMA
================================*/
const categorySchema = new mongoose.Schema({
  // _id: { type: String, required: true, unique: true }, // e.g. "audio"
  name: { type: String, required: true },             // e.g. "Audio"
  description: { type: String },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }, // Store who created this category
});

const Category = mongoose.model("Category", categorySchema);

/* ==============================
   PRODUCT SCHEMA
================================*/
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  discount: { type: Number, default: 0 },

  // 👇 change from String → ObjectId reference
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }, // Store who created this product

  rating: { type: Number, min: 0, max: 5 },
  stock: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  hue: { type: Number },
  colors: [
    {
      name: String,
      hex: String,
      stock: { type: Number, default: 0 },
    },
  ],
  sizes: [
    {
      name: String,
      stock: { type: Number, default: 0 },
    },
  ],
  specifications: { type: mongoose.Schema.Types.Mixed },
});


const Product = mongoose.model("Product", productSchema);

/* ==============================
   ORDER SCHEMA
================================*/
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }, // Made optional for guest orders
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, required: true, default: 1 },
      selectedColor: { type: String },
      selectedSize: { type: String },
    },
  ],
  // Total price in Algerian Dinar (products only)
  totalPrice: { type: Number, required: true },
  // Delivery price 
  deliveryPrice: { type: Number, required: true, default: 500 },
  // Final total (products + delivery)
  finalTotal: { type: Number, required: true },
  customerInfo: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    wilaya: { type: String, enum: WILAYAS, required: true },
    deliveryType: { type: String, enum: ["domicile", "bureau"], default: "bureau" },
    deliveryPrice: { type: Number, required: true }, // Price based on wilaya and delivery type
    comune: { type: String, required: false },
    address: { type: String, required: false },
  },
  status: {
    type: String,
    enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  qrCode: { type: String }, // stores QR code as base64 image string
  isGuestOrder: { type: Boolean, default: false }, // Flag to identify guest orders
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }, // Track which admin "owns" this order's visibility
  createdAt: { type: Date, default: Date.now },
});

// Add a pre-save hook to set isGuestOrder flag
orderSchema.pre('save', function(next) {
  if (!this.user) {
    this.isGuestOrder = true;
  }
  next();
});


const Order = mongoose.model("Order", orderSchema);

/* ==============================
   ADMIN SITE CONFIGURATION SCHEMA
================================*/
const siteConfigSchema = new mongoose.Schema({
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  
  // Basic Info
  siteName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  logo: { type: String },
  domain: { type: String },
  description: { type: String },
  
  // Address & Location
  address: { type: String },
  city: { type: String },
  wilaya: { type: String, enum: WILAYAS },
  postalCode: { type: String },
  
  // Social Media
  socialMedia: {
    facebook: { type: String },
    instagram: { type: String },
    tikTok: { type: String },
    twitter: { type: String },
    whatsapp: { type: String },
    youtube: { type: String }
  },
  
  // Shipping Configuration
  shipping: {
    enableDomicile: { type: Boolean, default: true },
    enableBureau: { type: Boolean, default: true },
    freeShippingThreshold: { type: Number, default: 0 },  // Amount for free delivery
    defaultDeliveryDays: { type: Number, default: 3 }
  },
  
  // Payment Methods
  paymentMethods: {
    cashOnDelivery: { type: Boolean, default: true },
    bankTransfer: { type: Boolean, default: false },
    edahabMobile: { type: Boolean, default: false }
  },
  
  // Store Policies
  policies: {
    returnDays: { type: Number, default: 7 },
    warranty: { type: String },
    termsAndConditions: { type: String }
  },
  
  // Status & Timestamps
  isSetupComplete: { type: Boolean, default: false },
  setupProgress: { type: Number, default: 0, min: 0, max: 100 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const SiteConfig = mongoose.model("SiteConfig", siteConfigSchema);

/* ==============================
   EXPORT MODELS
================================*/
module.exports = {
  User,
  Category,
  Product,
  Order,
  DeliveryPrice,
  SiteConfig,
  WILAYAS,
  DEFAULT_DELIVERY_PRICES,
  getDeliveryPrice,
  getDeliveryPriceSync,
};
