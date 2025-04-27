
import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { 
  testExpert,
  signoutExpert,
  getExpertProfile,
  updateExpertProfile,
  uploadProfileImage,
  uploadDocument,
  getApprovedExperts,
  getExpertById,
} from '../controllers/expert.controller.js';

const router = express.Router();

// Test route
router.get('/test', testExpert);
router.get('/', getApprovedExperts);
// Signout route
router.post('/signout', verifyToken, signoutExpert);

// Expert profile routes
router.get('/me', verifyToken, getExpertProfile);
router.put('/me', verifyToken, updateExpertProfile);

// Profile Image upload
router.post('/upload-profile-image', verifyToken, uploadProfileImage);

// Document upload
router.post('/upload-document', verifyToken, uploadDocument);

router.get('/:id', getExpertById);
export default router;
