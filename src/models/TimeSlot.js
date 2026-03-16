const mongoose = require('mongoose')

const SlotSchema = new mongoose.Schema({
    startTime: { type: String, required: true },
    endTime: { type: String, required: true }
}, 
{ timestamps: true } // to help in debugging and tracking when slots are created or modified
)

const Slot = mongoose.model('Slot', SlotSchema)

module.exports = Slot