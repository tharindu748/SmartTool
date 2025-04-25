import User from "../Models/user.model.js";
import Supplier from "../Models/supplier.model.js";
import Expert from "../Models/expert.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

// Helper to find user by email
const findUserByEmail = async (email) => {
  const collections = [User, Supplier, Expert];
  for (const model of collections) {
    const user = await model.findOne({ email });
    if (user) return user;
  }
  return null;
};

// Signup Controller (User only)
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return next(errorHandler(400, "All fields are required"));
  }

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return next(errorHandler(400, "User already exists"));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  try {
    const newUser = new User({
      username,
      email,
      password: hashedPassword
      
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    const { password: _, ...userWithoutPassword } = newUser._doc;

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000
    }).status(201).json({
      success: true,
      user: userWithoutPassword
    });

  } catch (error) {
    next(errorHandler(500, error.message || 'Registration failed'));
  }
};


// Signin Controller
export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    const user = await findUserByEmail(email);
    if (!user) return next(errorHandler(404, "User not found"));

    if (!bcryptjs.compareSync(password, user.password)) {
      return next(errorHandler(401, "Invalid credentials"));
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    const { password: _, ...userWithoutPassword } = user._doc;

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000
    }).status(200).json({
      success: true,
      user: userWithoutPassword
    });

  } catch (error) {
    next(errorHandler(500, 'Login failed'));
  }
};

// Logout Controller
export const logout = (req, res) => {
  res.clearCookie('access_token', {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production'
  }).status(200).json({ success: true, message: 'Logged out successfully' });
};
