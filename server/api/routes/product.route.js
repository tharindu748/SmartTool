import express from 'express';
import { addProduct, getAllProducts, getProductById } from '../controllers/product.controllers.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

// Add product (Supplier Only)
router.post('/add', verifyToken, addProduct);

// Get all products (Marketplace)
router.get('/', getAllProducts);

// Get single product by ID - CORRECTED this line
router.get('/:id', getProductById);

export default router;