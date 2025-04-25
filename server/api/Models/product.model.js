import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['Tools', 'Machinery', 'Electronics', 'Parts', 'Other'],
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    maxlength: 1000,
  },
  imageUrl: {
    type: String,
    default: '',
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Product = mongoose.model('Product', productSchema);
export default Product;
