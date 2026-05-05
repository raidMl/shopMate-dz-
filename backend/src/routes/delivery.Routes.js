const express = require("express");
const router = express.Router();
const { DeliveryPrice, DEFAULT_DELIVERY_PRICES, WILAYAS } = require("../models");
const { protect, admin } = require("../middleware/authMiddleware");

// @desc    Get all delivery prices
// @route   GET /api/delivery
// @access  Public
router.get("/", async (req, res) => {
  try {
    const prices = await DeliveryPrice.find({});
    
    if (prices.length === 0) {
      // Return default prices if database is empty
      return res.json({
        message: "No custom prices set, returning defaults",
        prices: DEFAULT_DELIVERY_PRICES,
        isDefault: true
      });
    }

    // Transform to expected format
    const formattedPrices = {};
    prices.forEach(price => {
      formattedPrices[price.wilaya] = {
        domicile: price.domicile,
        bureau: price.bureau
      };
    });

    res.json({
      prices: formattedPrices,
      isDefault: false
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get delivery price for specific wilaya
// @route   GET /api/delivery/:wilaya
// @access  Public
router.get("/:wilaya", async (req, res) => {
  try {
    const { wilaya } = req.params;

    const price = await DeliveryPrice.findOne({ wilaya });

    if (!price) {
      const defaultPrice = DEFAULT_DELIVERY_PRICES[wilaya];
      if (!defaultPrice) {
        return res.status(404).json({ message: `Wilaya "${wilaya}" not found` });
      }
      return res.json({
        wilaya,
        ...defaultPrice,
        isDefault: true
      });
    }

    res.json({
      wilaya: price.wilaya,
      domicile: price.domicile,
      bureau: price.bureau,
      isDefault: false,
      updatedAt: price.updatedAt
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create or update delivery price
// @route   POST /api/delivery
// @access  Private/Admin
router.post("/", protect, admin, async (req, res) => {
  try {
    const { wilaya, domicile, bureau } = req.body;

    // Validate required fields
    if (!wilaya || domicile === undefined || bureau === undefined) {
      return res.status(400).json({
        message: "Please provide wilaya, domicile price, and bureau price"
      });
    }

    // Validate wilaya
    if (!WILAYAS.includes(wilaya)) {
      return res.status(400).json({
        message: `Invalid wilaya. Must be one of: ${WILAYAS.join(", ")}`
      });
    }

    // Validate prices are positive numbers
    if (typeof domicile !== "number" || domicile < 0 || typeof bureau !== "number" || bureau < 0) {
      return res.status(400).json({
        message: "Prices must be positive numbers"
      });
    }

    // Find and update or create
    let price = await DeliveryPrice.findOneAndUpdate(
      { wilaya },
      {
        wilaya,
        domicile,
        bureau,
        updatedAt: new Date()
      },
      { new: true, upsert: true, runValidators: true }
    );

    console.log(`✅ Delivery price updated for ${wilaya}: domicile=${domicile} DZD, bureau=${bureau} DZD`);

    res.status(201).json({
      message: `Delivery price for ${wilaya} updated successfully`,
      price
    });
  } catch (error) {
    console.error("Error updating delivery price:", error);
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update delivery price for specific wilaya
// @route   PUT /api/delivery/:wilaya
// @access  Private/Admin
router.put("/:wilaya", protect, admin, async (req, res) => {
  try {
    const { wilaya } = req.params;
    const { domicile, bureau } = req.body;

    // Validate wilaya
    if (!WILAYAS.includes(wilaya)) {
      return res.status(400).json({
        message: `Invalid wilaya. Must be one of: ${WILAYAS.join(", ")}`
      });
    }

    // Build update object
    const updateData = {};
    if (domicile !== undefined) {
      if (typeof domicile !== "number" || domicile < 0) {
        return res.status(400).json({ message: "Domicile price must be a positive number" });
      }
      updateData.domicile = domicile;
    }
    if (bureau !== undefined) {
      if (typeof bureau !== "number" || bureau < 0) {
        return res.status(400).json({ message: "Bureau price must be a positive number" });
      }
      updateData.bureau = bureau;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "Please provide domicile or bureau price to update" });
    }

    updateData.updatedAt = new Date();

    const price = await DeliveryPrice.findOneAndUpdate(
      { wilaya },
      updateData,
      { new: true, runValidators: true }
    );

    if (!price) {
      return res.status(404).json({ message: `Delivery price for ${wilaya} not found` });
    }

    console.log(`✅ Delivery price updated for ${wilaya}:`, updateData);

    res.json({
      message: `Delivery price for ${wilaya} updated successfully`,
      price
    });
  } catch (error) {
    console.error("Error updating delivery price:", error);
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete delivery price (reverts to default)
// @route   DELETE /api/delivery/:wilaya
// @access  Private/Admin
router.delete("/:wilaya", protect, admin, async (req, res) => {
  try {
    const { wilaya } = req.params;

    const price = await DeliveryPrice.findOneAndDelete({ wilaya });

    if (!price) {
      return res.status(404).json({ message: `Delivery price for ${wilaya} not found` });
    }

    console.log(`✅ Delivery price for ${wilaya} deleted (reverted to default)`);

    res.json({
      message: `Delivery price for ${wilaya} deleted. Will use default pricing.`,
      defaultPrices: DEFAULT_DELIVERY_PRICES[wilaya]
    });
  } catch (error) {
    console.error("Error deleting delivery price:", error);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Initialize delivery prices (create defaults if not exist)
// @route   POST /api/delivery/init/setup
// @access  Private/Admin
router.post("/init/setup", protect, admin, async (req, res) => {
  try {
    const existingCount = await DeliveryPrice.countDocuments({});

    if (existingCount > 0) {
      return res.status(400).json({
        message: "Delivery prices already initialized",
        count: existingCount
      });
    }

    const createdPrices = [];

    for (const wilaya of WILAYAS) {
      const defaults = DEFAULT_DELIVERY_PRICES[wilaya];
      const price = new DeliveryPrice({
        wilaya,
        domicile: defaults.domicile,
        bureau: defaults.bureau
      });
      createdPrices.push(await price.save());
    }

    console.log(`✅ Initialized ${createdPrices.length} delivery prices for all wilayas`);

    res.status(201).json({
      message: `Delivery prices initialized successfully for ${createdPrices.length} wilayas`,
      count: createdPrices.length,
      wilayas: WILAYAS
    });
  } catch (error) {
    console.error("Error initializing delivery prices:", error);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update multiple delivery prices at once (Bulk)
// @route   POST /api/delivery/bulk
// @access  Private/Admin
router.post("/bulk", protect, admin, async (req, res) => {
  try {
    const { prices } = req.body;

    if (!prices || typeof prices !== 'object') {
      return res.status(400).json({ message: "Prices object is required" });
    }

    const operations = Object.entries(prices).map(([wilaya, data]) => {
      return {
        updateOne: {
          filter: { wilaya },
          update: {
            $set: {
              wilaya,
              domicile: data.domicile,
              bureau: data.bureau,
              updatedAt: new Date()
            }
          },
          upsert: true
        }
      };
    });

    await DeliveryPrice.bulkWrite(operations);

    res.json({ message: "All delivery prices updated successfully" });
  } catch (error) {
    console.error("Error bulk updating delivery prices:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
