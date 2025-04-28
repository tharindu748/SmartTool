import express from 'express';
import { test, signout, updateUser, updatePassword } from '../controllers/user.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/test', test);
router.post('/signout', signout);
router.put('/update/:userId', verifyToken, updateUser);
router.put('/update-password/:userId', verifyToken, updatePassword);

export default router;