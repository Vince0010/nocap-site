
const express = require('express');
const router = express.Router();
const { getProducts, getProductById } = require('../controllers/product');

router.get('/:category', (req, res) => {
  try {
    const { category } = req.params;
    const items = getProducts(category, req.query);
    res.json(items);
  } catch (error) {
    if (error.message === 'Category not found') {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:category/:id', (req, res) => {
  try {
    const { category, id } = req.params;
    const product = getProductById(category, id);
    res.json(product);
  } catch (error) {
    if (error.message === 'Category not found' || error.message === 'Product not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;