// Usage in a route (example: expert only)
// routes/expert.routes.js

import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { verifyRole } from '../middleware/verifyRole.js';
import { uploadExpertDocument } from '../controllers/expert.controller.js';

const router = express.Router();

router.post('/upload-document', verifyToken, verifyRole(['expert']), uploadExpertDocument);

export default router;
