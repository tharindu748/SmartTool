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
  try {
    console.log('🔵 Received update request with data:', req.body);

    // Authorization check
    if (req.user.id !== req.params.userId) {
      return next(errorHandler(403, "You are not allowed to update this account"));
    }

    const updateFields = {};

    // Handle profile picture update
    if (req.body.profilePicture) {
      console.log('🖼 Updating profile picture to:', req.body.profilePicture);
      updateFields.profilePicture = req.body.profilePicture;
    }

    // Handle password update
    if (req.body.password) {
      if (req.body.password.length < 6) {
        return next(errorHandler(400, "Password must be at least 6 characters"));
      }
      const hashedPassword = bcryptjs.hashSync(req.body.password, 10);
      updateFields.password = hashedPassword;
    }

    // Handle username update
    if (req.body.username !== undefined) {
      const username = req.body.username.trim();

      if (username.length < 7 || username.length > 20) {
        return next(errorHandler(400, "Username must be between 7 and 20 characters"));
      }

      if (username.includes(' ')) {
        return next(errorHandler(400, "Username must not contain spaces"));
      }

      if (!/^[a-zA-Z0-9]+$/.test(username)) {
        return next(errorHandler(400, "Username must contain only letters and numbers"));
      }

      if (username !== req.user.username) {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
          return next(errorHandler(400, "Username already exists"));
        }
      }

      updateFields.username = username;
    }

    // Handle email update
    if (req.body.email) {
      updateFields.email = req.body.email.toLowerCase().trim();
    }

    // Handle address update
    if (req.body.address) {
      updateFields.address = req.body.address.trim();
    }

    console.log('🛠 Fields prepared for update:', updateFields);

    // Update user in MongoDB
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: updateFields },
      { new: true }
    );

    console.log('✅ Updated user:', updatedUser);

    if (!updatedUser) {
      return next(errorHandler(404, "User not found"));
    }

    // Remove password from response
    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);

  } catch (err) {
    console.error('❌ Update error:', err);
    next(err);
  }
};
