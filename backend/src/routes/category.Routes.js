const express = require('express');
const router = express.Router();
const { Category } = require('../models');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Fetch all categories
// @route   GET /api/categories
// @access  Public
router.get('/', async (req, res) => {
  try {
    const query = {};
    if (req.query.adminId) {
      query.adminId = req.query.adminId;
    }
    const categories = await Category.find(query);
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Fetch single category
// @route   GET /api/categories/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    console.log('Creating category with data:', req.body);
    console.log('User making request:', req.user);
    
    const { name, description } = req.body;
    
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Category name is required' });
    }
    
    // Check if category with same name already exists for this specific admin
    const existingCategory = await Category.findOne({ 
      name: name.trim(),
      adminId: req.user._id 
    });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category with this name already exists' });
    }
    
    const category = new Category({
      name: name.trim(),
      description: description ? description.trim() : '',
      adminId: req.user._id // Store who created this category
    });
    
    const createdCategory = await category.save();
    console.log('Category created successfully:', createdCategory);
    res.status(201).json(createdCategory);
  } catch (error) {
    console.error('Category creation error:', error);
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (category) {
      // Only allow if requester is the creator or super_admin
      if (req.user.role !== 'super_admin' && category.adminId?.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not authorized to update this category" });
      }

      category.name = req.body.name || category.name;
      category.description = req.body.description || category.description;
      
      const updatedCategory = await category.save();
      res.json(updatedCategory);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (category) {
      // Only allow if requester is the creator or super_admin
      if (req.user.role !== 'super_admin' && category.adminId?.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not authorized to delete this category" });
      }

      await category.deleteOne();
      res.json({ message: 'Category removed' });
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Temporary route to clear categories collection (remove after use)
router.delete('/clear-all', protect, admin, async (req, res) => {
  try {
    await Category.deleteMany({});
    res.json({ message: 'All categories cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
