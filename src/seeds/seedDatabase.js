// src/seeds/seedAccounts.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Account = require('../models/Account');
const Building = require('../models/Building');
const Lab = require('../models/Lab');
const Reservation = require('../models/Reservation');

require("dotenv").config(); 

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lab-reservation';

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

//seed labs
async function seedBuildings() {
  try {

    await Building.deleteMany({});

    const buildings = [
      { name: "Gokongwei Building", code: "GK" },
      { name: "St. La Salle Hall", code: "LS" },
      { name: "St. Joseph Hall", code: "SJ" },
      { name: "Velasco", code: "VL" },
      { name: "Br. Andrew Gonzales Hall", code: "AG" },
      { name: "STRC Building", code: "C" },
      { name: "Yuchengco Building", code: "Y" }
    ];

    await Building.insertMany(buildings);

    console.log("Buildings inserted successfully");


  } catch (err) {
    console.error(err);
  }
}

//seed labs
async function seedLabs() {
  try {

    await Lab.deleteMany({});

    // Find buildings by CODE, not name
    const gk = await Building.findOne({ code: "GK" });
    const vl = await Building.findOne({ code: "VL" });
    const ls = await Building.findOne({ code: "LS" });
    const sj = await Building.findOne({ code: "SJ" });
    const ag = await Building.findOne({ code: "AG" });
    const c = await Building.findOne({ code: "C" });
    const y = await Building.findOne({ code: "Y" });

    if (!gk || !vl || !ls || !sj || !ag || !c || !y) {
      console.error("Some buildings were not found. Run seedBuildings.js first.");
      process.exit();
    }

    const labs = [

      { buildingID: gk._id, room: "GK210", capacity: 40 },
      { buildingID: gk._id, room: "GK211", capacity: 40 },
      { buildingID: gk._id, room: "GK302A", capacity: 40 },
      { buildingID: gk._id, room: "GK302B", capacity: 40 },
      { buildingID: gk._id, room: "GK304B", capacity: 40 },
      { buildingID: gk._id, room: "GK306A", capacity: 40 },
      { buildingID: gk._id, room: "GK306B", capacity: 40 },
      { buildingID: gk._id, room: "GK404A", capacity: 40 },
      { buildingID: gk._id, room: "GK404B", capacity: 40 },

      { buildingID: ls._id, room: "LS212", capacity: 40 },
      { buildingID: ls._id, room: "LS229", capacity: 40 },
      { buildingID: ls._id, room: "LS320", capacity: 40 },
      { buildingID: ls._id, room: "LS335", capacity: 40 },

      { buildingID: sj._id, room: "SJ212", capacity: 40 },
    
      { buildingID: vl._id, room: "VL103", capacity: 40 },
      { buildingID: vl._id, room: "VL205", capacity: 40 },
      { buildingID: vl._id, room: "VL206", capacity: 40 },
      { buildingID: vl._id, room: "VL208A", capacity: 40 },
      { buildingID: vl._id, room: "VL208B", capacity: 40 },
      { buildingID: vl._id, room: "VL301", capacity: 40 },
      { buildingID: vl._id, room: "VL310", capacity: 40 },


      { buildingID: ag._id, room: "AG1904", capacity: 40 },

      { buildingID: c._id, room: "C314", capacity: 40 },
      
      { buildingID: y._id, room: "Y602", capacity: 40 }

    ];

    await Lab.insertMany(labs);

    console.log("Labs inserted successfully");

    //mongoose.disconnect();

  } catch (err) {
    console.error(err);
  }
}

//users for seeding user accounts
const testUsers = [
  {
    _id: "12312036",
    firstName: "Nico",
    lastName: "Yazawa",
    email: "nico_yazawa@dlsu.edu.ph",
    password: "niconiconii",
    contactNumber: "09123456789",
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
    contactNumber: "09123456789",
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
    contactNumber: "09123456789",
    college: "CCS",
    description: "BSMS Computer Science",
    photo: "",
    role: "student"
  },
  {
    _id: "12367680",
    firstName: "Test",
    lastName: "Tester",
    email: "itservices@dlsu.edu.ph",
    password: "password",
    contactNumber: "",
    college: "none",
    description: "",
    photo: "",
    role: "admin"    
  }
];

//seed users
async function seedAccounts() {
  try {
    for (const student of testUsers) {
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

    console.log("Account Seeding completed.");
    //process.exit(0);
  } catch (err) {
    console.error(err);
    //process.exit(1);
  }
}

const adminID = "12367680"; // admin account

// time slots: 07:30 - 21:00 in 30-min increments
const slotTimes = [];
for (let mins = 450; mins + 30 <= 1260; mins += 30) { // 450 = 07:30, 1260 = 21:00
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  slotTimes.push(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`);
}

// fixed start time for full reservations (3 consecutive slots = 1.5 hrs)
const fixedStartTime = "07:30";
const fullSlotCount = 3; 

// number of days to seed (today + 6 more = 7 days)
const daysToSeed = 7;

async function seedReservations() {
  try {
    // clear existing reservations
    await Reservation.deleteMany({});
    console.log("Existing reservations cleared.");

    const labs = await Lab.find({});
    if (!labs.length) {
      console.error("No labs found. Run seedLabs.js first.");
      process.exit(1);
    }

    // group labs by building
    const buildings = [...new Set(labs.map(l => l.buildingID.toString()))];

    const reservations = [];

    // loop over each day
    for (let dayOffset = 0; dayOffset < daysToSeed; dayOffset++) {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + dayOffset);
      currentDate.setHours(0,0,0,0);

      for (const buildingID of buildings) {
        const buildingLabs = labs.filter(l => l.buildingID.toString() === buildingID);

        // pick first lab in building as full lab
        const fullLab = buildingLabs[0];

        // select 3 consecutive slots starting at fixedStartTime
        const startIdx = slotTimes.indexOf(fixedStartTime);
        const selectedSlots = slotTimes.slice(startIdx, startIdx + fullSlotCount);

        for (const startTime of selectedSlots) {
          const [h, m] = startTime.split(':').map(Number);
          const endMins = h * 60 + m + 30;
          const endTime = `${String(Math.floor(endMins / 60)).padStart(2,'0')}:${String(endMins % 60).padStart(2,'0')}`;

          reservations.push(new Reservation({
            labID: fullLab._id,
            studentID: adminID,
            startTime,
            endTime,
            date: currentDate,
            seats: fullLab.capacity,
            status: 'pending',
            primaryStudent: { name: 'Admin Full Slot' },
            additionalStudents: []
          }));
        }

        console.log(`Full-slot reservations created for lab ${fullLab.room} in building ${buildingID} on ${currentDate.toDateString()}`);
      }
    }

    await Reservation.insertMany(reservations);
    console.log(`Seeded ${reservations.length} full-slot reservations for 7 days.`);

  } catch (err) {
    console.error(err);
  }
}

async function seedDatabase() {
  try {
    await seedAccounts();
    await seedBuildings();
    await seedLabs();
    await seedReservations();

    console.log("Database Seeded.");
    mongoose.disconnect();

  } catch (err) {
    console.error(err);
    mongoose.disconnect();
    process.exit();
  }


};

seedDatabase();