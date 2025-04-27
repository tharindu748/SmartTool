// 📂 routes/appointment.routes.js

import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import {
  createAppointment,
  getExpertAppointments,
  acceptAppointment,
  suggestAppointment,
  confirmAppointment,
  payAppointment,
  declineSuggestedTime,
  getCustomerAppointments
} from '../controllers/appointment.controller.js';

const router = express.Router();

// Create appointment (Customer)
router.post('/', verifyToken, createAppointment);

// Get all appointments for expert
router.get('/expert/:expertId', verifyToken, getExpertAppointments);

// Accept appointment (Expert)
router.post('/accept/:id', verifyToken, acceptAppointment);

// Suggest another time (Expert)
router.post('/suggest/:id', verifyToken, suggestAppointment);

// Confirm appointment (Customer after suggestion)
router.post('/confirm/:id', verifyToken, confirmAppointment);

// Mark appointment as paid
router.post('/pay/:id', verifyToken, payAppointment);

router.post('/decline-suggestion/:id', verifyToken, declineSuggestedTime);

router.get('/customer/:customerId', verifyToken, getCustomerAppointments); // ✅ New Route


export default router;
