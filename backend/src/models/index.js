const mongoose = require("mongoose");

/* ==============================
   USER & ADMIN SCHEMA
================================*/
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

/* ==============================
   CATEGORY SCHEMA
================================*/
const categorySchema = new mongoose.Schema({
  // _id: { type: String, required: true, unique: true }, // e.g. "audio"
  name: { type: String, required: true },             // e.g. "Audio"
  description: { type: String },
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
  totalPrice: { type: Number, required: true }, // Total price in Algerian Dinar
  customerInfo: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    wilaya: { type: String, required: true },
    address: { type: String, required: true }
  },
  status: {
    type: String,
    enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  qrCode: { type: String }, // stores QR code as base64 image string
  isGuestOrder: { type: Boolean, default: false }, // Flag to identify guest orders
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
   EXPORT MODELS
================================*/
module.exports = {
  User,
  Category,
  Product,
  Order,
};
