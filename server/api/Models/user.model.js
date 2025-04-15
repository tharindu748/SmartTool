import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  Address: {
    type: String,
    required: false,

  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
  },
  role:     { type: String, enum: ['customer', 'supplier', 'expert'], default: 'customer' },
  documents: String,

  
  // Supplier-specific
  businessName: String,
  address: String,
  toolCategories: String,

  // Expert-specific
  specialty: String,
  experience: String,
  ratePerHour: String,

},{timestamps: true,}


);
const User = mongoose.model("User", userSchema);
export default User;