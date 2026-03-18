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
    slot_ID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Slot',
        required: true
    },
    date: { type: Date, required: true },
    seats: { type: Number, required: true },
    status: {
        type: String,
        enum: ['pending','done','cancelled'],
        default: 'pending'
    },
    primaryStudent: { type: Object, default: {} },
    additionalStudents: { type: Array, default: [] }
});

const Reservation = mongoose.model('Reservation', ReservationSchema)

module.exports = Reservation
