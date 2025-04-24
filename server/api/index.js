import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoute from './routes/user.route.js';
import authRoute from './routes/auth.route.js';
import authsupplierrouts from './routes/authSupplier.routes.js'
import cookieParser  from 'cookie-parser';
  
dotenv.config();

mongoose.connect(process.env.MONGO).then(
  () => {
    console.log('MongoDB connected successfully');
  }
).catch((err) => {
  console.error('MongoDB connection error:', err);
});

const app = express();
app.use(express.json());
app.use(cookieParser())

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});


app.use('/api/user', userRoute);
app.use('/api/auth', authRoute); // This should be replaced with the actual auth route when implemented
app.use('/api', authsupplierrouts);


app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  
  });

});