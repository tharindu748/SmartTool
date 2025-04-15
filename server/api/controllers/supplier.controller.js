export const getSupplierDetails = async (req, res, next) => {
    try {
      const supplier = await User.findById(req.params.id);
      if (!supplier || supplier.role !== 'supplier') {
        return res.status(404).json({ message: 'Supplier not found' });
      }
      res.status(200).json(supplier);
    } catch (err) {
      next(err);
    }
  };
  