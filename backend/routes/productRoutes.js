// routes/productRoutes.js
import express from 'express';
import { getProducts, getProductById } from '../controllers/product.js';

const router = express.Router();

router.get('/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const items = await getProducts(category, req.query); 
    res.json(items);
  } catch (error) {
    if (error.message === 'Category not found') {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:category/:id', async (req, res) => {
  try {
    const { category, id } = req.params;
    const product = await getProductById(category, id); 
    res.json(product);
  } catch (error) {
    if (
      error.message === 'Category not found' ||
      error.message === 'Product not found'
    ) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
