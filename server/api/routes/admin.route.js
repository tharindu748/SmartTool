// In your admin routes (admin.route.js)
import express from 'express';
import { updateSupplierVerification } from '../controllers/admin.controller.js';

const router = express.Router();

router.put('/supplier/:supplierId/verify', updateSupplierVerification);

export default router;
