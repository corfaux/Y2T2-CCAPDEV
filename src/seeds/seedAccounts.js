// src/seeds/seedAccounts.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Account = require('../models/Account');
require("dotenv").config(); 

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lab-reservation';

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));


const testStudents = [
  {
    _id: "12312036",
    firstName: "Nico",
    lastName: "Yazawa",
    email: "nico_yazawa@dlsu.edu.ph",
    password: "niconiconii",
    contactNumber: "091234567",
    college: "CLA",
    description: "Communication Arts - The greatest idol in the world!",
    photo: "/uploads/nico-yazawa.png",
    role: "student"
  },
  {
    _id: "12511068",
    firstName: "Maki",
    lastName: "Nishikino",
    email: "maki_nishikino@dlsu.edu.ph",
    password: "password",
    contactNumber: "091234567",
    college: "RVRCOB",
    description: "BS Accounting.",
    photo: "",
    role: "student"
  },
  {
    _id: "12215555",
    firstName: "Char",
    lastName: "Aznable",
    email: "char_aznable@dlsu.edu.ph",
    password: "password",
    contactNumber: "091234567",
    college: "CCS",
    description: "BSMS Computer Science",
    photo: "",
    role: "student"
  }
];

async function seedAccounts() {
  try {
    for (const student of testStudents) {
      // check if account already exists
      let existing = await Account.findOne({ email: student.email });
      if (existing) {
        console.log(`Already exists: ${existing.email} -> _id: ${existing._id}`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(student.password, 10);

      const newStudent = new Account({
        _id: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        passwordHash: hashedPassword,
        contactNumber: student.contactNumber,
        college: student.college,
        description: student.description,
        photo: student.photo,
        role: student.role
      });

      await newStudent.save();
      console.log(`Created account: ${newStudent.email} -> _id: ${newStudent._id}`);
    }

    console.log("Seeding completed.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedAccounts();