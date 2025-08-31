const express = require("express");
const router = express.Router();
const { Order } = require("../models");
const { protect, admin } = require("../middleware/authMiddleware");
const QRCode = require("qrcode");
const mongoose = require("mongoose");

// @desc    Create new order
// @route   POST /api/orders
// @access  Public (guest orders allowed)
router.post("/", async (req, res) => {
  try {
    const { customerInfo, products, totalPrice } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    if (!customerInfo) {
      return res.status(400).json({ message: "Customer information is required" });
    }

    // Validate required customer info fields
    const requiredFields = ['fullName', 'email', 'phone', 'wilaya', 'address'];
    for (const field of requiredFields) {
      if (!customerInfo[field] || !customerInfo[field].trim()) {
        return res.status(400).json({ message: `${field} is required` });
      }
    }

    // For guest orders, create a temporary/guest user or use null
    let userId = null;
    if (req.user) {
      // If user is authenticated, use their ID
      userId = req.user._id;
    } else {
      // For guest orders, we can either:
      // 1. Set userId to null (current approach)
      // 2. Create a temporary guest user
      // 3. Use a special "guest" user ID
      
      // Option: Create a guest user entry (optional)
      // You could create a guest user here if needed for tracking
    }

    // Validate and transform products data
    const orderProducts = products.map((item, index) => {
      // Validate product ID is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(item.product)) {
        throw new Error(`Invalid product ID at index ${index}: ${item.product}`);
      }
      
      return {
        product: item.product,
        quantity: item.quantity || 1,
        selectedColor: item.selectedColor || null,
        selectedSize: item.selectedSize || null
      };
    });

    // Create order with customer info (userId can be null for guest orders)
    const order = new Order({
      user: userId, // Can be null for guest orders
      products: orderProducts,
      totalPrice,
      customerInfo: {
        fullName: customerInfo.fullName.trim(),
        email: customerInfo.email.trim().toLowerCase(),
        phone: customerInfo.phone.trim(),
        wilaya: customerInfo.wilaya.trim(),
        address: customerInfo.address.trim()
      }
    });

    // Generate QR code for the order
    const qrCodeData = JSON.stringify({
      orderId: order._id,
      totalPrice,
      customerName: customerInfo.fullName,
      email: customerInfo.email,
      phone: customerInfo.phone,
      date: new Date().toISOString(),
    });

    const qrCode = await QRCode.toDataURL(qrCodeData);
    order.qrCode = qrCode;

    const createdOrder = await order.save();
    
    // Populate the order with product and category details
    const populatedOrder = await Order.findById(createdOrder._id)
      .populate({
        path: "products.product",
        populate: {
          path: "category",
          select: "name description"
        }
      })
      .populate("user", "name email");

    res.status(201).json(populatedOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(400).json({ message: error.message });
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate({
        path: "products.product",
        populate: {
          path: "category",
          select: "name description",
        },
      });

    if (order) {
      // Check if user is admin or order belongs to user
      if (
        req.user.role === "admin" ||
        order.user._id.toString() === req.user._id.toString()
      ) {
        res.json(order);
      } else {
        res.status(401).json({ message: "Not authorized to view this order" });
      }
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
router.put("/:id/status", protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = req.body.status || order.status;

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
router.get("/my/orders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate({
        path: "products.product",
        populate: {
          path: "category",
          select: "name description",
        },
      });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
router.get("/", protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "id name")
      .populate({
        path: "products.product",
        populate: {
          path: "category",
          select: "name description",
        },
      });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;