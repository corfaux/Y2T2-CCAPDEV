const mongoose = require('mongoose')

const SlotSchema = new mongoose.Schema({
    startTime: { type: String, required: true },
    endTime: { type: String, required: true }
})

const Slot = mongoose.model('Slot', SlotSchema)

module.exports = Slot