import express from 'express';
import { getSupplierProfile, updateSupplierProfile } from '../controllers/supplier.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/me', verifyToken, getSupplierProfile);
router.put('/me', verifyToken, updateSupplierProfile);

export default router;
