const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
    _id: { type: String, minLength: 8, maxLength: 8 },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    contactNumber: { type: String },
    college: { 
        type: String,
        enum: ["none", "CCS", "GCOE", "COS", "CLA", 
               "RVRCOB", "CLTSOE", "BAGCED", "TDSOL"]
    },
    description: { type: String },
    photo: { type: String },
    role: { 
        type: String,
        enum: ['student', 'admin'],
        default: 'student',
        required: true
    }
});

const Account = mongoose.model('Account', AccountSchema);

module.exports = Account;