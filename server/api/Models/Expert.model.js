import mongoose from 'mongoose';

const expertSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    unique: false
  },
  username: {
    type: String,
    required: true,
    unique: false
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
  },
  role: {
    type: String,
    default: 'expert' // No enum restriction
  },
  specialty: {
    type: String,
    required: true
  },
  yearsOfExperience: {
    type: Number,
    required: true,
    min: 0
  },
  profilePicture: {
    type: String,
    default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
  },
  
  bio: {
    type: String,
    maxlength: 1000,
    required: false
  },
  address: {
    type: String,
    required: true
  },
  contactPerson: {
    name: { type: String, required: false },
    position: { type: String, required: false },
    phone: { type: String, required: false },
    email: {
      type: String,
      validate: {
        validator: function (v) {
          if (!v) return true;
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: props => `${props.value} is not a valid email!`
      },
      required: false
    }
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
  registrationStatus: {
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
expertSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  const requiredFieldsComplete = this.specialty && this.yearsOfExperience && this.userId;
  this.registrationStatus = requiredFieldsComplete ? 'complete' : 'pending';
  next();
});

// ✅ Fix OverwriteModelError
const Expert = mongoose.models.Expert || mongoose.model('Expert', expertSchema);

export default Expert;
