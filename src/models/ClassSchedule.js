const mongoose = require('mongoose')

const ClassScheduleSchema = new mongoose.Schema({
    labID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lab',
        required: true
    },
    slot_ID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Slot',
        required: true
    },
    courseCode: { type: String, required: true },
    section: { type: String, required: true },
    instructor: { type: String, required: true },
    dayOfWeek: {
        type: String,
        enum: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
        required: true
    }
})

const ClassSchedule = mongoose.model('ClassSchedule', ClassScheduleSchema)

module.exports = ClassSchedule