import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: false,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    // validate: {
    //   validator: function (value) {
    //     return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
    //       value
    //     );
    //   },
    //   message:
    //     "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.",
    // },
  },
  profilePicture: {
    type: String,
    default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
  },
  role: {
    type: String,
    enum: ['supplier', 'buyer', 'admin', 'expert'],
    default: 'buyer'
  },
  // Supplier-specific fields
  businessName: {
    type: String,
    required: function() { return this.role === 'supplier'; }
  },
  businessType: {
    type: String,
    enum: ['wholesaler', 'manufacturer', 'distributor', 'retailer', 'service-provider'],
    required: function() { return this.role === 'supplier'; }
  },
  businessDescription: String,
  toolCategories: [{
    type: String,
    required: function() { return this.role === 'supplier'; }
  }],
  businessLicense: {
    url: String,
    verified: { 
      type: Boolean, 
      default: false 
    }
  },
  address: {
    type: String,
    required: function() { return this.role === 'supplier'; }
  },
  documents: [{
    name: String,
    url: String,
    isVerified: {
      type: Boolean,
      default: false
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Expert-specific fields
  specialty: String,
  experience: Number,
  ratePerHour: Number,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password;
      return ret;
    }
  }
});

const User = mongoose.model('User', userSchema);

export default User;