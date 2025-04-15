// Example controller (expert.controller.js)

export const uploadExpertDocument = async (req, res) => {
    try {
      // Assume Firebase upload already done and URL is in req.body.documentUrl
      const expertId = req.user.id;
      const { documentUrl } = req.body;
  
      const expert = await User.findById(expertId);
      if (!expert) return res.status(404).json({ message: 'Expert not found' });
  
      expert.documents = expert.documents || [];
      expert.documents.push(documentUrl);
      await expert.save();
  
      res.status(200).json({ message: 'Document uploaded', documents: expert.documents });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };