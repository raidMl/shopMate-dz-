const express = require("express");
const router = express.Router();
const { SiteConfig, User } = require("../models");
const { protect, admin } = require("../middleware/authMiddleware");

/* ==============================
   GET SITE CONFIG FOR CURRENT ADMIN
================================*/
router.get("/", protect, admin, async (req, res) => {
  try {
    const config = await SiteConfig.findOne({ admin: req.user.id });

    if (!config) {
      return res.status(404).json({ message: "Site configuration not found" });
    }

    res.json(config);
  } catch (error) {
    console.error("Error fetching site config:", error);
    res.status(500).json({ message: error.message });
  }
});

/* ==============================
   CREATE INITIAL SITE CONFIG
================================*/
router.post("/initialize", protect, admin, async (req, res) => {
  try {
    // Check if config already exists
    const existingConfig = await SiteConfig.findOne({ admin: req.user.id });
    if (existingConfig) {
      return res.status(400).json({ message: "Site configuration already exists" });
    }

    const { siteName, email, phone } = req.body;

    // Validate required fields
    if (!siteName || !email || !phone) {
      return res.status(400).json({
        message: "siteName, email, and phone are required"
      });
    }

    // Create new config
    const config = new SiteConfig({
      admin: req.user.id,
      siteName,
      email,
      phone,
      setupProgress: 20
    });

    await config.save();

    console.log(`✅ Site configuration initialized for admin: ${req.user.email}`);

    res.status(201).json({
      message: "Site configuration initialized successfully",
      config
    });
  } catch (error) {
    console.error("Error creating site config:", error);
    res.status(400).json({ message: error.message });
  }
});

/* ==============================
   UPDATE SITE CONFIG (FULL)
================================*/
router.put("/:id", protect, admin, async (req, res) => {
  try {
    // Check if config belongs to current admin
    const config = await SiteConfig.findById(req.params.id);
    if (!config) {
      return res.status(404).json({ message: "Site configuration not found" });
    }

    if (config.admin.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this configuration" });
    }

    const {
      siteName,
      email,
      phone,
      logo,
      domain,
      description,
      address,
      city,
      wilaya,
      postalCode,
      socialMedia,
      shipping,
      paymentMethods,
      policies,
      isSetupComplete,
      setupProgress
    } = req.body;

    // Update allowed fields
    if (siteName) config.siteName = siteName;
    if (email) config.email = email;
    if (phone) config.phone = phone;
    if (logo) config.logo = logo;
    if (domain) config.domain = domain;
    if (description !== undefined) config.description = description;
    if (address) config.address = address;
    if (city) config.city = city;
    if (wilaya) config.wilaya = wilaya;
    if (postalCode) config.postalCode = postalCode;

    if (socialMedia) {
      config.socialMedia = { ...config.socialMedia, ...socialMedia };
    }

    if (shipping) {
      config.shipping = { ...config.shipping, ...shipping };
    }

    if (paymentMethods) {
      config.paymentMethods = { ...config.paymentMethods, ...paymentMethods };
    }

    if (policies) {
      config.policies = { ...config.policies, ...policies };
    }

    if (isSetupComplete !== undefined) config.isSetupComplete = isSetupComplete;
    if (setupProgress !== undefined) config.setupProgress = Math.min(100, setupProgress);

    config.updatedAt = new Date();
    await config.save();

    console.log(`✅ Site configuration updated for admin: ${req.user.email}`);

    res.json({
      message: "Site configuration updated successfully",
      config
    });
  } catch (error) {
    console.error("Error updating site config:", error);
    res.status(400).json({ message: error.message });
  }
});

/* ==============================
   UPDATE SPECIFIC SECTION
================================*/
router.patch("/:id/:section", protect, admin, async (req, res) => {
  try {
    const { id, section } = req.params;

    // Check if config belongs to current admin
    const config = await SiteConfig.findById(id);
    if (!config) {
      return res.status(404).json({ message: "Site configuration not found" });
    }

    if (config.admin.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this configuration" });
    }

    // Handle different sections
    switch (section) {
      case "social":
        config.socialMedia = { ...config.socialMedia, ...req.body };
        config.setupProgress = Math.min(100, config.setupProgress + 15);
        break;

      case "shipping":
        config.shipping = { ...config.shipping, ...req.body };
        config.setupProgress = Math.min(100, config.setupProgress + 15);
        break;

      case "payment":
        config.paymentMethods = { ...config.paymentMethods, ...req.body };
        config.setupProgress = Math.min(100, config.setupProgress + 15);
        break;

      case "policies":
        config.policies = { ...config.policies, ...req.body };
        config.setupProgress = Math.min(100, config.setupProgress + 10);
        break;

      case "basic":
        const { siteName, email, phone, logo, domain, description } = req.body;
        if (siteName) config.siteName = siteName;
        if (email) config.email = email;
        if (phone) config.phone = phone;
        if (logo) config.logo = logo;
        if (domain) config.domain = domain;
        if (description !== undefined) config.description = description;
        config.setupProgress = Math.min(100, config.setupProgress + 20);
        break;

      case "address":
        const { address, city, wilaya, postalCode } = req.body;
        if (address) config.address = address;
        if (city) config.city = city;
        if (wilaya) config.wilaya = wilaya;
        if (postalCode) config.postalCode = postalCode;
        config.setupProgress = Math.min(100, config.setupProgress + 10);
        break;

      default:
        return res.status(400).json({ message: "Invalid section" });
    }

    // Mark as complete if progress reaches 100
    if (config.setupProgress >= 100) {
      config.isSetupComplete = true;
    }

    config.updatedAt = new Date();
    await config.save();

    console.log(`✅ Section '${section}' updated. Progress: ${config.setupProgress}%`);

    res.json({
      message: `${section} section updated successfully`,
      setupProgress: config.setupProgress,
      isSetupComplete: config.isSetupComplete,
      config
    });
  } catch (error) {
    console.error("Error updating site config section:", error);
    res.status(400).json({ message: error.message });
  }
});

/* ==============================
   DELETE SITE CONFIG
================================*/
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const config = await SiteConfig.findById(req.params.id);

    if (!config) {
      return res.status(404).json({ message: "Site configuration not found" });
    }

    if (config.admin.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this configuration" });
    }

    await SiteConfig.findByIdAndDelete(req.params.id);

    console.log(`✅ Site configuration deleted for admin: ${req.user.email}`);

    res.json({ message: "Site configuration deleted successfully" });
  } catch (error) {
    console.error("Error deleting site config:", error);
    res.status(500).json({ message: error.message });
  }
});

/* ==============================
   GET SETUP STATUS
================================*/
router.get("/status/:id", protect, admin, async (req, res) => {
  try {
    const config = await SiteConfig.findById(req.params.id);

    if (!config) {
      return res.status(404).json({ message: "Site configuration not found" });
    }

    if (config.admin.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json({
      setupProgress: config.setupProgress,
      isSetupComplete: config.isSetupComplete,
      missingSections: getMissingSections(config)
    });
  } catch (error) {
    console.error("Error fetching setup status:", error);
    res.status(500).json({ message: error.message });
  }
});

/* ==============================
   HELPER FUNCTION
================================*/
function getMissingSections(config) {
  const sections = [];

  if (!config.logo) sections.push("logo");
  if (!config.domain) sections.push("domain");
  if (!config.address) sections.push("address");
  if (Object.values(config.socialMedia).filter(v => v).length === 0) sections.push("socialMedia");
  if (!config.paymentMethods.cashOnDelivery && 
      !config.paymentMethods.bankTransfer && 
      !config.paymentMethods.edahabMobile) sections.push("paymentMethods");

  return sections;
}

module.exports = router;
