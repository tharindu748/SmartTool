import express from 'express';
import { google, signup } from '../controllers/auth.controller.js';
import { signin } from '../controllers/auth.controller.js';
import { register } from '../controllers/auth.controller.js';

 const router = express.Router();

 router.post('/SignUp', signup);
 router.post('/SignIn', signin); 
 router.post('/google', google); // Add the Google authentication route
 router.post('/register', register);


 export default router;