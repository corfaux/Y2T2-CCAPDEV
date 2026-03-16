const mongoose = require('mongoose')

const BuildingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true }
})

const Building = mongoose.model('Building', BuildingSchema)

module.exports = Building