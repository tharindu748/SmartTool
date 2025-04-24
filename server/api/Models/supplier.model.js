import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,  // Made optional for initial registration
    unique: true
  },
  role: {
    type: String,
    default: 'supplier',
    enum: ['supplier', 'buyer', 'admin']
  },
  businessName: {
    type: String,
    required: function() { return this.role === 'supplier'; }
  },
  businessType: {
    type: String,
    enum: ['wholesaler', 'manufacturer', 'distributor', 'retailer', 'service-provider'],
    required: function() { return this.role === 'supplier'; }
  },
  businessDescription: {
    type: String,
    maxlength: 1000,
    required: false  // Made optional
  },
  toolCategories: [{
    type: String,
    required: false  // Made optional
  }],
  businessLicense: {
    url: {
      type: String,
      required: false,  // Made optional
      default: null
    },
    verified: { 
      type: Boolean, 
      default: false 
    },
    verifiedAt: {
      type: Date,
      default: null
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    uploadedAt: {
      type: Date,
      default: null
    }
  },
  taxIdentificationNumber: {
    type: String,
    required: false,  // Made optional
    default: null
  },
  yearsInBusiness: {
    type: Number,
    min: 0,
    required: false
  },
  website: {
    type: String,
    required: false,
    validate: {
      validator: function(v) {
        if (!v) return true;  // Allow empty
        return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(v);
      },
      message: props => `${props.value} is not a valid website URL!`
    }
  },
  contactPerson: {
    name: {
      type: String,
      required: false
    },
    position: {
      type: String,
      required: false
    },
    phone: {
      type: String,
      required: false
    },
    email: {
      type: String,
      validate: {
        validator: function(v) {
          if (!v) return true;  // Allow empty
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: props => `${props.value} is not a valid email!`
      }
    }
  },
  address: {
    type: String,
    required: true,
    example: "No.383 Koulea South Sewanagala"
  },
  documents: [{
    name: String,
    type: {
      type: String,
      enum: ['license', 'certificate', 'insurance', 'other']
    },
    url: String,
    isVerified: {
      type: Boolean,
      default: false
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    verifiedAt: Date,
    notes: String
  }],
  paymentMethods: [{
    type: String,
    enum: ['credit-card', 'bank-transfer', 'paypal', 'crypto', 'other']
  }],
  minimumOrderValue: {
    type: Number,
    min: 0,
    required: false
  },
  averageLeadTime: {
    type: Number,
    required: false
  },
  registrationStatus: {  // New field to track completion
    type: String,
    enum: ['pending', 'complete'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
supplierSchema.index({
  businessName: 'text',
  businessDescription: 'text',
  toolCategories: 'text'
});

// Middleware to update registration status
supplierSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Check if required fields are complete
  if (this.role === 'supplier') {
    const requiredFieldsComplete = this.businessLicense.url && 
                                 this.taxIdentificationNumber && 
                                 this.userId;
    this.registrationStatus = requiredFieldsComplete ? 'complete' : 'pending';
  }
  
  next();
});

const Supplier = mongoose.model('Supplier', supplierSchema);

export default Supplier;