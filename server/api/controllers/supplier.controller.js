import Supplier from '../Models/supplier.model.js';
import { errorHandler } from '../utils/error.js';

// Get Supplier Profile (only logged-in supplier)
export const getSupplierProfile = async (req, res, next) => {
  try {
    const supplier = await Supplier.findById(req.user.id);
    if (!supplier) {
      return next(errorHandler(404, 'Supplier not found.'));
    }
    res.status(200).json(supplier);
  } catch (err) {
    next(err);
  }
};

// Update Supplier Profile
export const updateSupplierProfile = async (req, res, next) => {
  try {
    const updatedSupplier = await Supplier.findByIdAndUpdate(
      req.user.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedSupplier);
  } catch (err) {
    next(err);
  }
};
