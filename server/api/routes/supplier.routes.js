import express from 'express';
import { getSupplierDetails } from '../controllers/supplier.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/:id', verifyToken, getSupplierDetails);

export default router;
