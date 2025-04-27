// 📂 models/appointment.model.js

import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the Customer
    required: true,
  },
  expertId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expert', // Reference to the Expert
    required: true,
  },
  date: {
    type: String, // Could be "2024-06-10"
    required: true,
  },
  time: {
    type: String, // Could be "14:30"
    required: true,
  },
  description: {
    type: String, // Customer's problem description
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'suggested', 'declined', 'confirmed'],
    default: 'pending',
  },
  suggestedDate: {
    type: String, // If expert suggests a new date
  },
  suggestedTime: {
    type: String, // If expert suggests a new time
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending',
  }
}, { timestamps: true }); // timestamps => createdAt, updatedAt automatic

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
