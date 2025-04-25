import express from 'express';
import { expertRegister } from '../controllers/authExperts.controller.js';


 const router = express.Router();

 router.post('/expertRegister', expertRegister);



 export default router;