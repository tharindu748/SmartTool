// Admin verification update (this will be in your admin controller)
export const updateSupplierVerification = async (req, res, next) => {
    const { supplierId, verificationStatus } = req.body;
    try {
      const supplier = await User.findByIdAndUpdate(supplierId, { verificationStatus }, { new: true });
      res.status(200).json({ message: 'Supplier verification status updated', supplier });
    } catch (err) {
      next(err);
    }
  };
  