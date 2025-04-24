import express from 'express';
import {supplierRegister } from '../controllers/authSupplier.controller.js';


 const router = express.Router();

 router.post('/supplierRegister', supplierRegister);



 export default router;