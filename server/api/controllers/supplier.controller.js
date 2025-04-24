import Supplier from '../models/Supplier.js';

// Get supplier profile
export const getSupplierProfile = async (req, res) => {
  try {
    const supplier = await Supplier.findOne({ userId: req.params.id }).populate('userId', 'username email profilePicture');
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier profile not found' });
    }
    res.status(200).json(supplier);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update supplier profile
export const updateSupplierProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { address, documents, businessName, businessRegistrationNumber } = req.body;

    const updatedSupplier = await Supplier.findOneAndUpdate(
      { userId: id },
      {
        address,
        documents,
        businessName,
        businessRegistrationNumber,
        updatedAt: Date.now()
      },
      { new: true }
    ).populate('userId', 'username email profilePicture');

    if (!updatedSupplier) {
      return res.status(404).json({ message: 'Supplier profile not found' });
    }

    res.status(200).json({
      ...updatedSupplier.toObject(),
      username: updatedSupplier.userId.username,
      email: updatedSupplier.userId.email,
      profilePicture: updatedSupplier.userId.profilePicture
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload document
export const uploadDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, url } = req.body;

    const supplier = await Supplier.findOneAndUpdate(
      { userId: id },
      {
        $push: {
          documents: {
            name,
            url,
            isVerified: false
          }
        }
      },
      { new: true }
    );

    if (!supplier) {
      return res.status(404).json({ message: 'Supplier profile not found' });
    }

    res.status(201).json(supplier.documents[supplier.documents.length - 1]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};