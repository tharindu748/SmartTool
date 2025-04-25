import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

// Routes imports
import userRoute from './routes/user.route.js';
import authRoute from './routes/auth.route.js';
import authSupplierRoutes from './routes/authSupplier.routes.js';
import authExpertRoutes from './routes/authExperts.routes.js';
import supplierRoutes from './routes/supplier.routes.js';
import productRoutes from './routes/product.route.js';


dotenv.config();

mongoose.connect(process.env.MONGO)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

const app = express();

app.use(express.json());
app.use(cookieParser());

// ✅ Correct CORS setup
app.use(cors({
  origin: 'http://localhost:5173', // React frontend port
  credentials: true,
}));

// Route setup
app.use('/api/user', userRoute);
app.use('/api/auth', authRoute);
app.use('/api', authSupplierRoutes);
app.use('/api', authExpertRoutes);
app.use('/api/supplier', supplierRoutes); // ✅
app.use('/api/products', productRoutes);




// Global error handling
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
