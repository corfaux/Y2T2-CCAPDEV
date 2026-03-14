const mongoose = require('mongoose')

const AccountSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    contactNumber: { type: String },
    role: { 
        type: String,
        enum: ['student', 'admin'],
        default: 'student'
    }
})

const Account = mongoose.model('Account', AccountSchema)

module.exports = Account