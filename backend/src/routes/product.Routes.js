const express = require("express");
const router = express.Router();
const { Product } = require("../models");
const { protect, admin } = require("../middleware/authMiddleware");

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
router.get("/", async (req, res) => {
  try {
    // Add CORS headers explicitly
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
    
    // Check for adminId query parameter
    const query = {};
    if (req.query.adminId) {
      // If adminId is provided, filter by it (used by Admin UI)
      query.adminId = req.query.adminId;
    }

    const products = await Product.find(query)
          .populate("category", "name _id"); // only return category name + id
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
router.post(
  "/",
  protect,
  admin,
  async (req, res) => {
    try {
      // Set adminId from the authenticated user
      const productData = {
        ...req.body,
        adminId: req.user._id
      };
      
      const product = new Product(productData);
      const createdProduct = await product.save();
      res.status(201).json(createdProduct);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put(
  "/:id",
  protect,
  admin,
  async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);

      if (product) {
        // Only allow if requester is the creator or super_admin
        if (req.user.role !== 'super_admin' && product.adminId?.toString() !== req.user._id.toString()) {
          return res.status(403).json({ message: "Not authorized to update this product" });
        }

        Object.keys(req.body).forEach((key) => {
          product[key] = req.body[key];
        });

        const updatedProduct = await product.save();
        res.json(updatedProduct);
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete(
  "/:id",
  protect,
  admin,
  async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);

      if (product) {
        // Only allow if requester is the creator or super_admin
        if (req.user.role !== 'super_admin' && product.adminId?.toString() !== req.user._id.toString()) {
          return res.status(403).json({ message: "Not authorized to delete this product" });
        }

        await product.deleteOne();
        res.json({ message: "Product removed" });
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
