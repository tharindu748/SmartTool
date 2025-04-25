import Expert from "../Models/expert.model.js"; 
import bcryptjs from "bcryptjs"; 
import { errorHandler } from "../utils/error.js"; 
import jwt from "jsonwebtoken";

export const expertRegister = async (req, res, next) => {
  try {
    const {
      username,
      email,
      password,
      specialty,
      yearsOfExperience,
      address,
    } = req.body;

    // Check if the expert already exists
    const existingExpert = await Expert.findOne({ email });
    if (existingExpert) return res.status(400).json({ message: 'Expert already exists' });

    // Hash the password
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // Create a new expert user
    const newExpert = new Expert({
      username,
      email,
      password: hashedPassword,
      role: 'expert', // Setting the role as expert
      specialty,
      yearsOfExperience,
      address,
      registrationStatus: 'pending',  // Initially, registration is pending
    });

    // Save the expert data
    await newExpert.save();

    // Respond with success message
    res.status(201).json({ 
      success: true,
      message: 'Expert registration successful'
    });

  } catch (error) {
    next(error);
  }
};
