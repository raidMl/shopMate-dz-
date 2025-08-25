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
  id: { type: String, required: true, unique: true }, // e.g. "audio"
  name: { type: String, required: true },             // e.g. "Audio"
  description: { type: String },
});

const Category = mongoose.model("Category", categorySchema);

/* ==============================
   PRODUCT SCHEMA
================================*/
const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // e.g. "p1"
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  discount: { type: Number, default: 0 },
  category: { type: String, ref: "Category", required: true },
  rating: { type: Number, min: 0, max: 5 },
  stock: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  hue: { type: Number },

  // Available colors
  colors: [
    {
      name: String,
      hex: String,
      stock: { type: Number, default: 0 },
    },
  ],

  // Optional sizes (for wearables, bags, etc.)
  sizes: [
    {
      name: String,
      stock: { type: Number, default: 0 },
    },
  ],

  // Flexible specifications object
  specifications: { type: mongoose.Schema.Types.Mixed },
});

const Product = mongoose.model("Product", productSchema);

/* ==============================
   ORDER SCHEMA
================================*/
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, required: true, default: 1 },
      selectedColor: { type: String },
      selectedSize: { type: String },
    },
  ],
  totalPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  qrCode: { type: String }, // stores QR code as base64 image string
  createdAt: { type: Date, default: Date.now },
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
