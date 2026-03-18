const mongoose = require('mongoose');

const SlotSchema = new mongoose.Schema({
    labID: { type: mongoose.Schema.Types.ObjectId, ref: 'Lab', required: true },
    day: { type: String, required: true },          
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    availability: { type: Boolean, default: true } // by default, slots are available
});

const Slot = mongoose.model('AvailableSlot', SlotSchema, 'availableslots');

module.exports = Slot;