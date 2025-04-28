import Product from '../Models/product.model.js';
import { errorHandler } from '../utils/error.js';

// ✅ Add a product
export const addProduct = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return next(errorHandler(401, 'Unauthorized'));
    }
    if (!req.body.name || !req.body.category || req.body.price == null) {
      return next(errorHandler(400, 'Missing required fields'));
    }

    const newProduct = new Product({
      supplierId: req.user.id,
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      description: req.body.description || '',
      imageUrl: req.body.imageUrl || ''
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);

  } catch (err) {
    console.error('❌ Product creation error:', err);
    next(errorHandler(500, 'Product creation failed'));
  }
};



// Get all products
export const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find().populate('supplierId', 'username email');
    res.status(200).json(products);
  } catch (err) {
    console.error('❌ Failed to fetch products:', err);
    next(errorHandler(500, 'Failed to fetch products'));
  }
};

// Get product by ID
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('supplierId', 'username email');
    if (!product) {
      return next(errorHandler(404, 'Product not found'));
    }
    res.status(200).json(product);
  } catch (err) {
    console.error('❌ Failed to fetch product by ID:', err);
    next(errorHandler(500, 'Error fetching product by ID'));
  }
};
