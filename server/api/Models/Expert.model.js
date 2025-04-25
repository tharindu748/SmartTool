import mongoose from 'mongoose';

const expertSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,  // Made optional for initial registration
    unique: false
  },
  username: {  // Add username field
    type: String,
    required: true,
    unique: true
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
  role: {
    type: String,
    default: 'expert',
    enum: ['expert']
  },
  specialty: {
    type: String,
    required: true
  },
  yearsOfExperience: {
    type: Number,
    required: [true, 'Years of experience is required'],
    min: [0, 'Years of experience cannot be negative']
  },
  
  bio: {
    type: String,
    maxlength: 1000,
    required: false  // Made optional for expert introduction
  },
  address: {
    type: String,
    required: true,
    example: "No.383 Koulea South Sewanagala"
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
  documents: [{
    name: String,
    type: {
      type: String,
      enum: ['certification', 'degree', 'other']
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
  registrationStatus: {  // Track registration status
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

// Middleware to update registration status
expertSchema.pre('save', function(next) {
  this.updatedAt = Date.now();

  // Check if required fields are complete for expert role
  const requiredFieldsComplete = this.specialty && this.yearsOfExperience && this.userId;
  this.registrationStatus = requiredFieldsComplete ? 'complete' : 'pending';

  next();
});

const Expert = mongoose.model('Expert', expertSchema);

export default Expert;
