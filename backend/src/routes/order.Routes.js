const express = require("express");
const router = express.Router();
const { Order, Product, getDeliveryPrice } = require("../models");
const { protect, admin } = require("../middleware/authMiddleware");
const QRCode = require("qrcode");
const mongoose = require("mongoose");

// Helper function to reduce product stock
const reduceProductStock = async (products) => {
  const stockUpdates = [];
  
  for (const item of products) {
    const product = await Product.findById(item.product);
    if (!product) {
      throw new Error(`Product with ID ${item.product} not found`);
    }

    // Check main stock
    if (product.stock < item.quantity) {
      throw new Error(`Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`);
    }

    // Prepare stock update operations
    const stockUpdate = {
      productId: item.product,
      quantity: item.quantity,
      mainStockReduction: item.quantity,
      colorStockReduction: null,
      sizeStockReduction: null
    };

    // Check color stock if color is selected
    if (item.selectedColor) {
      const colorVariant = product.colors.find(color => color.name === item.selectedColor);
      if (colorVariant) {
        if (colorVariant.stock < item.quantity) {
          throw new Error(`Insufficient stock for color ${item.selectedColor} of product ${product.name}. Available: ${colorVariant.stock}, Requested: ${item.quantity}`);
        }
        stockUpdate.colorStockReduction = {
          colorName: item.selectedColor,
          quantity: item.quantity
        };
      }
    }

    // Check size stock if size is selected
    if (item.selectedSize) {
      const sizeVariant = product.sizes.find(size => size.name === item.selectedSize);
      if (sizeVariant) {
        if (sizeVariant.stock < item.quantity) {
          throw new Error(`Insufficient stock for size ${item.selectedSize} of product ${product.name}. Available: ${sizeVariant.stock}, Requested: ${item.quantity}`);
        }
        stockUpdate.sizeStockReduction = {
          sizeName: item.selectedSize,
          quantity: item.quantity
        };
      }
    }

    stockUpdates.push(stockUpdate);
  }

  // Apply all stock reductions
  for (const update of stockUpdates) {
    // Build the update operation
    const updateOperation = {
      $inc: { stock: -update.mainStockReduction }
    };

    const arrayFilters = [];

    // Add color stock reduction if needed
    if (update.colorStockReduction) {
      updateOperation.$inc[`colors.$[color].stock`] = -update.colorStockReduction.quantity;
      arrayFilters.push({ "color.name": update.colorStockReduction.colorName });
    }

    // Add size stock reduction if needed
    if (update.sizeStockReduction) {
      updateOperation.$inc[`sizes.$[size].stock`] = -update.sizeStockReduction.quantity;
      arrayFilters.push({ "size.name": update.sizeStockReduction.sizeName });
    }

    // Apply the update
    const updateOptions = {};
    if (arrayFilters.length > 0) {
      updateOptions.arrayFilters = arrayFilters;
    }

    console.log(`🔧 Reducing stock for product ${update.productId}:`, {
      mainStock: -update.mainStockReduction,
      color: update.colorStockReduction?.colorName,
      colorReduction: update.colorStockReduction?.quantity,
      size: update.sizeStockReduction?.sizeName,
      sizeReduction: update.sizeStockReduction?.quantity
    });

    await Product.findByIdAndUpdate(
      update.productId,
      updateOperation,
      updateOptions
    );
  }

  return stockUpdates;
};

// Helper function to restore product stock
const restoreProductStock = async (products) => {
  for (const item of products) {
    // Base update for main stock
    const updateOperation = {
      $inc: { stock: item.quantity }
    };

    const arrayFilters = [];

    // Handle color stock restoration
    if (item.selectedColor) {
      updateOperation.$inc[`colors.$[color].stock`] = item.quantity;
      arrayFilters.push({ "color.name": item.selectedColor });
    }

    // Handle size stock restoration
    if (item.selectedSize) {
      updateOperation.$inc[`sizes.$[size].stock`] = item.quantity;
      arrayFilters.push({ "size.name": item.selectedSize });
    }

    // Apply the update
    const updateOptions = {};
    if (arrayFilters.length > 0) {
      updateOptions.arrayFilters = arrayFilters;
    }

    console.log(`🔧 Restoring stock for product ${item.product}:`, {
      mainStock: item.quantity,
      color: item.selectedColor,
      size: item.selectedSize
    });

    await Product.findByIdAndUpdate(
      item.product,
      updateOperation,
      updateOptions
    );
  }
};

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

    // Check and reduce stock for all products
    console.log("🔍 Checking product stock availability...");
    await reduceProductStock(orderProducts);
    console.log("✅ Stock reduced successfully for all products");

    // Identify the admin associated with these products
    let adminId = null;
    if (orderProducts.length > 0) {
      const firstProduct = await Product.findById(orderProducts[0].product);
      if (firstProduct && firstProduct.adminId) {
        adminId = firstProduct.adminId;
      }
    }

    // Calculate delivery price based on wilaya and delivery type
    const wilaya = customerInfo.wilaya.trim();
    const deliveryType = customerInfo.deliveryType || "bureau";
    const deliveryPrice = getDeliveryPrice(wilaya, deliveryType);

    console.log(`📦 Delivery: ${deliveryType} in ${wilaya} = ${deliveryPrice} DZD`);

    // Create order with customer info (userId can be null for guest orders)
    const order = new Order({
      user: userId, // Can be null for guest orders
      adminId: adminId, // Tag the order with the admin who owns the products
      products: orderProducts,
      totalPrice,
      deliveryPrice: deliveryPrice, // Calculate based on wilaya and delivery type
      finalTotal: totalPrice + deliveryPrice, // Total including delivery
      customerInfo: {
        fullName: customerInfo.fullName.trim(),
        email: customerInfo.email.trim().toLowerCase(),
        phone: customerInfo.phone.trim(),
        wilaya: wilaya,
        deliveryType: deliveryType,
        deliveryPrice: deliveryPrice,
        address: customerInfo.address.trim()
      }
    });

    // Generate QR code for the order
    const qrCodeData = JSON.stringify({
      orderId: order._id,
      totalPrice,
      deliveryPrice: deliveryPrice,
      deliveryType: deliveryType,
      wilaya: wilaya,
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

    console.log(`📦 Order ${createdOrder._id} created successfully with stock reduction`);
    res.status(201).json(populatedOrder);
  } catch (error) {
    console.error("Error creating order:", error);
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
    const query = {};
    
    // If user is admin (not super_admin), filter orders by their tagged adminId
    if (req.user && req.user.role === 'admin') {
      query.adminId = req.user._id;
    }

    const orders = await Order.find(query)
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

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
router.put("/:id/status", protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Security check: Only allow if requester is the assigned admin or super_admin
    if (req.user.role !== 'super_admin' && order.adminId?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this order" });
    }

    const oldStatus = order.status;
    const newStatus = req.body.status;

    // Update order status
    order.status = newStatus || order.status;
    const updatedOrder = await order.save();

    // Handle stock restoration when order is cancelled
    if (newStatus === "cancelled" && oldStatus !== "cancelled") {
      console.log(`🔄 Order ${order._id} status changed to cancelled - restoring stock...`);
      try {
        await restoreProductStock(order.products);
        console.log(`✅ Stock restored successfully for cancelled order ${order._id}`);
      } catch (stockError) {
        console.error(`❌ Error restoring stock for order ${order._id}:`, stockError);
        // Note: We don't revert the status change if stock restoration fails
        // as the cancellation is more important than the stock discrepancy
      }
    }

    // Handle stock reduction when order is reactivated (moved from cancelled to another status)
    if (oldStatus === "cancelled" && newStatus !== "cancelled") {
      console.log(`🔄 Order ${order._id} status changed from cancelled to ${newStatus} - reducing stock...`);
      try {
        await reduceProductStock(order.products);
        console.log(`✅ Stock reduced successfully for reactivated order ${order._id}`);
      } catch (stockError) {
        console.error(`❌ Error reducing stock for reactivated order ${order._id}:`, stockError);
        // Revert the status change if stock reduction fails
        order.status = oldStatus;
        await order.save();
        return res.status(400).json({ 
          message: `Cannot reactivate order: ${stockError.message}` 
        });
      }
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error(`Error updating order status:`, error);
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    console.log(`🗑️  DELETE route hit - Attempting to delete order with ID: ${req.params.id}`);
    
    const order = await Order.findById(req.params.id);

    if (order) {
      // Security check: Only allow if requester is the assigned admin or super_admin
      if (req.user.role !== 'super_admin' && order.adminId?.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not authorized to delete this order" });
      }

      // Restore stock if order is not already cancelled
      if (order.status !== "cancelled") {
        console.log(`🔄 Restoring stock for deleted order ${order._id}...`);
        try {
          await restoreProductStock(order.products);
          console.log(`✅ Stock restored successfully for deleted order ${order._id}`);
        } catch (stockError) {
          console.error(`❌ Error restoring stock for deleted order ${order._id}:`, stockError);
          // Continue with deletion even if stock restoration fails
        }
      }

      await Order.findByIdAndDelete(req.params.id);
      console.log(`✅ Order ${req.params.id} deleted successfully`);
      res.json({ message: "Order deleted successfully" });
    } else {
      console.log(`❌ Order ${req.params.id} not found`);
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    console.error(`💥 Error deleting order ${req.params.id}:`, error);
    res.status(500).json({ message: error.message });
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
        (order.user && order.user._id.toString() === req.user._id.toString())
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

console.log('Order routes loaded - DELETE /api/orders/:id should be available');

module.exports = router;