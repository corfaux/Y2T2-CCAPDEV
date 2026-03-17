const mongoose = require('mongoose');
const Slot = require('../models/TimeSlot');

mongoose.connect('mongodb://127.0.0.1:27017/lab-reservation');

async function seedSlots() {

  try {

    // remove existing slots
    await Slot.deleteMany({});

    let hour = 7;
    let minute = 30;

    while (hour < 21 || (hour === 21 && minute === 0)) {

      const startTime =
        String(hour).padStart(2, "0") +
        ":" +
        String(minute).padStart(2, "0");

      const totalMinutes = hour * 60 + minute + 30;

      const endHour = Math.floor(totalMinutes / 60);
      const endMinute = totalMinutes % 60;

      const endTime =
        String(endHour).padStart(2, "0") +
        ":" +
        String(endMinute).padStart(2, "0");

      await Slot.create({
        startTime: startTime,
        endTime: endTime
      });

      minute += 30;

      if (minute === 60) {
        minute = 0;
        hour++;
      }

    }

    console.log("Time slots inserted successfully!");

    mongoose.disconnect();

  } catch (error) {

    console.error("Error seeding time slots:", error);

  }

}

seedSlots();