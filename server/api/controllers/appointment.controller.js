// 📂 controllers/appointment.controller.js

import Appointment from '../Models/appointment.model.js';
import { errorHandler } from '../utils/error.js';

// Create a new appointment (Customer request)
export const createAppointment = async (req, res, next) => {
  try {
    const { expertId, date, time, description } = req.body;

    if (!expertId || !date || !time || !description) {
      return next(errorHandler(400, 'All fields are required'));
    }

    const newAppointment = new Appointment({
      customerId: req.user.id, // logged in user
      expertId,
      date,
      time,
      description,
    });

    await newAppointment.save();

    res.status(201).json({
      success: true,
      message: 'Appointment request created successfully',
      appointment: newAppointment,
    });
  } catch (err) {
    next(errorHandler(500, 'Failed to create appointment'));
  }
};

// Get all appointments for an Expert
export const getExpertAppointments = async (req, res, next) => {
  try {
    const expertId = req.params.expertId;

    const appointments = await Appointment.find({ expertId }).populate('customerId', 'username email');

    res.status(200).json(appointments);
  } catch (err) {
    next(errorHandler(500, 'Failed to fetch expert appointments'));
  }
};

export const acceptAppointment = async (req, res, next) => {
  try {
    const appointmentId = req.params.id;

    const appointment = await Appointment.findByIdAndUpdate(
        appointmentId,
        { $set: { status: 'approved' } }, // <-- ✅ Ehema bracket close karanna
        { new: true }
      );

    if (!appointment) return next(errorHandler(404, 'Appointment not found'));

    res.status(200).json({
      success: true,
      message: 'Appointment accepted successfully',
      appointment,
    });
  } catch (err) {
    next(errorHandler(500, 'Failed to accept appointment'));
  }
};

// Expert suggests new date/time
export const suggestAppointment = async (req, res, next) => {
  try {
    const appointmentId = req.params.id;
    const { suggestedDate, suggestedTime } = req.body;

    if (!suggestedDate || !suggestedTime) {
      return next(errorHandler(400, 'Suggested date and time are required'));
    }

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { $set: { status: 'suggested', suggestedDate, suggestedTime } },
      { new: true }
    );

    if (!appointment) return next(errorHandler(404, 'Appointment not found'));

    res.status(200).json({
      success: true,
      message: 'Suggested new time successfully',
      appointment,
    });
  } catch (err) {
    next(errorHandler(500, 'Failed to suggest appointment time'));
  }
};

// Customer declines suggested time
export const declineSuggestedTime = async (req, res, next) => {
    try {
      const appointmentId = req.params.id;
  
      const appointment = await Appointment.findByIdAndUpdate(
        appointmentId,
        {
          $set: {
            status: 'pending', // back to pending
            suggestedDate: undefined,
            suggestedTime: undefined,
          }
        },
        { new: true }
      );
  
      if (!appointment) return next(errorHandler(404, 'Appointment not found'));
  
      res.status(200).json({
        success: true,
        message: 'Declined suggested time. Please propose new time.',
        appointment,
      });
    } catch (err) {
      next(errorHandler(500, 'Failed to decline suggested time'));
    }
  };
// 📄 Get all appointments for a Customer (New Controller)
export const getCustomerAppointments = async (req, res, next) => {
    try {
      const customerId = req.params.customerId;
  
      const appointments = await Appointment.find({ customerId })
        .populate('expertId', 'username email');
  
      res.status(200).json(appointments);
    } catch (err) {
      next(errorHandler(500, 'Failed to fetch customer appointments'));
    }
  };
  
// Customer confirms suggested time
export const confirmAppointment = async (req, res, next) => {
  try {
    const appointmentId = req.params.id;

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) return next(errorHandler(404, 'Appointment not found'));

    appointment.date = appointment.suggestedDate || appointment.date;
    appointment.time = appointment.suggestedTime || appointment.time;
    appointment.status = 'confirmed';
    appointment.suggestedDate = undefined;
    appointment.suggestedTime = undefined;

    await appointment.save();

    res.status(200).json({
      success: true,
      message: 'Appointment confirmed successfully',
      appointment,
    });
  } catch (err) {
    next(errorHandler(500, 'Failed to confirm appointment'));
  }
};

// Mark appointment as paid
export const payAppointment = async (req, res, next) => {
  try {
    const appointmentId = req.params.id;

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { $set: { paymentStatus: 'paid' } },
      { new: true }
    );

    if (!appointment) return next(errorHandler(404, 'Appointment not found'));

    res.status(200).json({
      success: true,
      message: 'Payment marked as complete',
      appointment,
    });
  } catch (err) {
    next(errorHandler(500, 'Failed to mark appointment as paid'));
  }
};
