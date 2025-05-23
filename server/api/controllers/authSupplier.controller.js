import Supplier from "../Models/supplier.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const supplierRegister = async (req, res, next) => {
  try {
    const {
      username,
      email,
      password,
      role,
      address,
      businessName,
      businessType,
      businessDescription
    } = req.body;

    const existingUser = await Supplier.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new Supplier({
      username,
      email,
      password: hashedPassword,
      role,
      ...(req.user?.id && { userId: req.user.id }),
      ...(role === 'supplier' && {
        businessName,
        businessType,
        businessDescription,
        address,
      }),
    });

    await newUser.save();
    res.status(201).json({ 
      success: true,
      message: 'Registration successful' 
    });

  } catch (error) {
    next(error); // Pass to centralized error handler
  }
};
