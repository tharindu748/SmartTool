import bcryptjs from "bcryptjs";
import User from "../Models/user.model.js";
import { errorHandler } from "../utils/error.js";

// Simple test route
export const test = (req, res) => {
  res.json({ message: "User route is working" });
};

// Sign out controller
export const signout = (req, res, next) => {
  try {
    res.clearCookie('access_token')
      .status(200)
      .json({ message: 'User has been signed out' });
  } catch (err) {
    next(err);
  }
};

// Update user controller
export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this account"));
  }

  try {
    const updateFields = {};

    // 🔐 Handle password
    if (req.body.password) {
      if (req.body.password.length < 6) {
        return next(errorHandler(400, "Password must be at least 6 characters"));
      }
      updateFields.password = bcryptjs.hashSync(req.body.password, 10);
    }

    // 🧾 Username validation
    if (req.body.username) {
      if (req.body.username.length < 4 || req.body.username.length > 20) {
        return next(errorHandler(400, "Username must be between 7 and 20 characters"));
      }

      if (req.body.username.includes(' ')) {
        return next(errorHandler(400, "Username must not contain spaces"));
      }

      if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
        return next(errorHandler(400, "Username must contain only letters and numbers"));
      }

      // Check for duplicate only if username is changing
      if (req.body.username !== req.user.username) {
        const existingUser = await User.findOne({ username: req.body.username });
        if (existingUser) {
          return next(errorHandler(400, "Username already exists"));
        }
      }

      updateFields.username = req.body.username;
    }

    // 📨 Email, Address, ProfilePicture
    if (req.body.email) updateFields.email = req.body.email;
    if (req.body.Address) updateFields.Address = req.body.Address;
    if (req.body.profilePicture) updateFields.profilePicture = req.body.profilePicture;

    // 🛠 Debug log
    console.log("🛠 Updating user with fields:", updateFields);
    console.log("🆔 Updating user ID:", req.params.userId);

    // 🔄 Update user in DB
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedUser) {
      return next(errorHandler(404, "User not found"));
    }

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);

  } catch (err) {
    console.error('🔥 Update error:', err);
    next(err);
  }
};
