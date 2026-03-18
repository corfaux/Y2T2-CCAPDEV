const mongoose = require('mongoose')

const ReservationSchema = new mongoose.Schema({
  labID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lab',
    required: true
  },

  studentID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },

  //replace slot_ID with actual time range
  startTime: {
    type: String, // "07:30"
    required: true
  },

  endTime: {
    type: String, // "08:00"
    required: true
  },

  date: {
    type: String, // "2026-03-18" (use string for consistency)
    required: true
  },

  seats: {
    type: Number,
    required: true
  },

  status: {
    type: String,
    enum: ['pending', 'done', 'cancelled'],
    default: 'pending'
  },

  primaryStudent: {
    type: Object,
    default: {}
  },

  additionalStudents: {
    type: Array,
    default: []
  }
});

const Reservation = mongoose.model('Reservation', ReservationSchema)

module.exports = Reservation
