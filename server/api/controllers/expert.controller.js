import Expert from '../Models/expert.model.js';
import { errorHandler } from '../utils/error.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const testExpert = (req, res) => {
  res.json({ message: "Expert route is working" });
};

// Get the current expert profile
export const getExpertProfile = async (req, res, next) => {
  try {
    const expert = await Expert.findById(req.user.id);
    if (!expert) return next(errorHandler(404, 'Expert not found.'));
    res.status(200).json(expert);
  } catch (err) {
    next(errorHandler(500, 'Failed to fetch expert profile.'));
  }
};

// Update expert profile
// export const updateExpertProfile = async (req, res, next) => {
//   try {
//     if (req.body.email) {
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (!emailRegex.test(req.body.email)) {
//         return next(errorHandler(400, 'Invalid email format.'));
//       }
//     }
//     const updatedExpert = await Expert.findByIdAndUpdate(
//       req.user.id,
//       { $set: req.body },
//       { new: true }
//     );
//     if (!updatedExpert) return next(errorHandler(404, 'Expert not found.'));
//     res.status(200).json(updatedExpert);
//   } catch (err) {
//     next(errorHandler(500, 'Failed to update profile: ' + err.message));
//   }
// };
export const updateExpertProfile = async (req, res, next) => {
  try {
    const updatedExpert = await Expert.findByIdAndUpdate(
      req.user.id,
      { $set: req.body },
      { new: true }
    );
    if (!updatedExpert) return next(errorHandler(404, 'Expert not found.'));
    res.status(200).json(updatedExpert);
  } catch (err) {
    next(errorHandler(500, 'Failed to update profile: ' + err.message));
  }
};
export const getApprovedExperts = async (req, res, next) => {
  try {
    const experts = await Expert.find({ registrationStatus: 'pending' }); // Only approved
    res.status(200).json(experts);
  } catch (err) {
    next(errorHandler(500, 'Failed to fetch approved experts.'));
  }
};
// Upload profile picture
export const uploadProfileImage = async (req, res, next) => {
  try {
    if (!req.file) return next(errorHandler(400, 'No image file provided.'));

    const expert = await Expert.findById(req.user.id);
    if (!expert) return next(errorHandler(404, 'Expert not found.'));

    // Delete old image if exists
    if (expert.profilePicture && expert.profilePicture !== '/default-profile.png') {
      const oldPath = path.join(__dirname, '../public', expert.profilePicture);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    expert.profilePicture = imageUrl;
    await expert.save();

    res.status(200).json({
      success: true,
      message: 'Profile image uploaded successfully',
      imageUrl,
    });
  } catch (err) {
    next(errorHandler(500, 'Failed to upload profile image: ' + err.message));
  }
};
// 📂 controllers/expert.controller.js

export const getExpertById = async (req, res, next) => {
  try {
    const expert = await Expert.findById(req.params.id).select('-password -refreshToken');
    if (!expert) return next(errorHandler(404, 'Expert not found.'));
    res.status(200).json(expert);
  } catch (err) {
    next(errorHandler(500, 'Failed to fetch expert.'));
  }
};


// Upload business document
// In your backend API (for example, using Express)
export const uploadDocument = async (req, res, next) => {
  try {
    const { documentType, documentUrl, originalName, fileSize, fileType } = req.body;

    // Validate required fields
    if (!documentType || !documentUrl || !originalName) {
      return next(errorHandler(400, 'Missing required fields'));
    }

    // Get authenticated user
    const expert = await Expert.findById(req.user.id);
    if (!expert) {
      return next(errorHandler(404, 'Expert not found'));
    }

    // Create new document
    const newDocument = {
      name: originalName,
      type: documentType,
      url: documentUrl,
      size: fileSize,
      fileType: fileType,
      uploadedAt: new Date(),
      status: 'pending'
    };

    // Add to expert's documents
    expert.documents.push(newDocument);
    await expert.save();

    res.status(200).json({
      success: true,
      message: 'Document uploaded successfully',
      document: newDocument
    });
  } catch (err) {
    next(errorHandler(500, 'Failed to upload document: ' + err.message));
  }
};
// // Admin: get expert by ID
// export const getExpertById = async (req, res, next) => {
//   try {
//     const expert = await Expert.findById(req.params.id).select('-password -refreshToken');
//     if (!expert) return next(errorHandler(404, 'Expert not found.'));
//     res.status(200).json(expert);
//   } catch (err) {
//     next(errorHandler(500, 'Failed to fetch expert.'));
//   }
// };

// Admin: change registration status
export const changeRegistrationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return next(errorHandler(400, 'Invalid status.'));
    }

    const expert = await Expert.findByIdAndUpdate(
      req.params.id,
      { $set: { registrationStatus: status } },
      { new: true }
    );

    if (!expert) return next(errorHandler(404, 'Expert not found.'));

    res.status(200).json({
      success: true,
      message: `Expert status changed to ${status}`,
      expert,
    });
  } catch (err) {
    next(errorHandler(500, 'Failed to change registration status.'));
  }
};

// Admin: get experts by status
export const getExpertsByStatus = async (req, res, next) => {
  try {
    const { status } = req.params;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return next(errorHandler(400, 'Invalid status.'));
    }

    const experts = await Expert.find({ registrationStatus: status });
    res.status(200).json(experts);
  } catch (err) {
    next(errorHandler(500, 'Failed to fetch experts by status.'));
  }
};

export const signoutExpert = (req, res, next) => {
  try {
    res.clearCookie('access_token')
      .status(200)
      .json({ message: 'Expert has been signed out' });
  } catch (err) {
    next(err);
  }
};


// Admin or Expert: delete expert account
export const deleteExpert = async (req, res, next) => {
  try {
    const expert = await Expert.findById(req.params.id);
    if (!expert) return next(errorHandler(404, 'Expert not found.'));

    // Only allow self-delete or admin
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return next(errorHandler(403, 'Unauthorized to delete this expert.'));
    }

    // Delete profile picture
    if (expert.profilePicture && expert.profilePicture !== '/default-profile.png') {
      const imagePath = path.join(__dirname, '../public', expert.profilePicture);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    // Delete documents
    if (expert.documents.length > 0) {
      expert.documents.forEach(doc => {
        const docPath = path.join(__dirname, '../public', doc.url);
        if (fs.existsSync(docPath)) fs.unlinkSync(docPath);
      });
    }

    await Expert.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Expert deleted successfully',
    });
  } catch (err) {
    next(errorHandler(500, 'Failed to delete expert: ' + err.message));
  }
};
