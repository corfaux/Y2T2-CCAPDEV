const mongoose = require('mongoose')

const LabSchema = new mongoose.Schema({
    buildingID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Building',
        required: true
    },
    room: { type: String, required: true },
    capacity: { type: Number, required: true },
    availability: { type: Boolean, default: true },
});

const Lab = mongoose.model('Lab', LabSchema)

module.exports = Lab