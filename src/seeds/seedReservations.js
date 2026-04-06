// src/seeds/seedReservations.js
const mongoose = require('mongoose');
const Reservation = require('../models/Reservation');
const Lab = require('../models/Lab');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lab-reservation';
mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

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

    mongoose.disconnect();
  } catch (err) {
    console.error(err);
    mongoose.disconnect();
  }
}

seedReservations();