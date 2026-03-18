const mongoose = require('mongoose');
const Lab = require('../models/Lab');
const Slot = require('../models/AvailableSlots');

mongoose.connect('mongodb://127.0.0.1:27017/lab-reservation')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

// 
const classSchedule = {
  Monday: {
    AG1904: [
      { start: "07:30", end: "17:45" }
    ],
    C314: [
      { start: "07:30", end: "10:45" },
      { start: "12:45", end: "16:00" },
      { start: "18:00", end: "21:00" } 
    ],
    GK210: [
      { start: "09:15", end: "10:45" },
      { start: "12:45", end: "16:00" }
    ],
    GK211: [
      { start: "07:30", end: "09:00" },
      { start: "10:45", end: "12:15" }
    ],
    GK302A: [
      { start: "09:15", end: "12:30" }
    ],
    GK304B: [
      { start: "07:30", end: "17:45" }
    ],
    GK306A: [
      { start: "09:15", end: "10:45" },
      { start: "14:30", end: "16:00" }
    ],
    GK306B: [
      { start: "09:15", end: "10:45" },
      { start: "14:30", end: "16:00" }
    ],
    GK404A: [
      { start: "14:30", end: "17:45" }
    ],
    GK404B: [
      { start: "07:30", end: "17:45" }
    ],
    LS229: [
      { start: "09:15", end: "12:30" },
      { start: "14:30", end: "21:00" }
    ],
    LS320: [
      { start: "09:15", end: "12:30" },
      { start: "14:30", end: "21:00" }
    ],
    LS335: [
      { start: "07:30", end: "21:00" }
    ],
    VL103: [
      { start: "07:30", end: "17:45" }
    ],
    VL205: [
      { start: "07:30", end: "17:45" }
    ],
    VL206: [
      { start: "07:30", end: "21:00" }
    ],
    VL208A: [
      { start: "07:30", end: "17:45" }
    ],
    VL208B: [
      { start: "07:30", end: "17:45" }
    ],
    VL301: [
      { start: "07:30", end: "17:45" }
    ],
    VL310: [
      { start: "07:30", end: "17:45" }
    ],
    Y602: [
      { start: "11:00", end: "14:15" }
    ] 
  },

  Tuesday: {
    AG1904: [
      { start: "07:30", end: "14:15" }
    ],
    C314: [
      { start: "07:30", end: "19:30" }
    ],
    GK210: [
      { start: "09:15", end: "10:45" },
      { start: "12:45", end: "16:00" }
    ],
    GK211: [
      { start: "09:15", end: "16:00" }
    ],
    GK302A: [
      { start: "12:45", end: "14:15" }
    ],
    GK302B: [
      { start: "12:45", end: "14:15" }
    ],
    GK304A: [
      { start: "12:45", end: "16:00" }
    ],
    GK304B: [
      { start: "07:30", end: "19:30" }
    ],
    GK306A: [
      { start: "07:30", end: "10:45" }
    ],
    GK306B: [
      { start: "07:30", end: "10:45" }
    ],
    GK404A: [
      { start: "12:45", end: "16:00" }
    ],
    GK404B: [
      { start: "07:30", end: "17:45" }
    ],
    SJ212: [
      { start: "09:15", end: "14:15" },
      { start: "18:00", end: "19:30" }
    ],
    LS212: [
      { start: "11:00", end: "12:30" },
      { start: "14:30", end: "16:00" },
      { start: "18:00", end: "19:30" }
    ],
    LS229: [
      { start: "09:15", end: "21:00" }
    ],
    LS320: [
      { start: "09:15", end: "10:45" },
      { start: "12:45", end: "16:00" },
      { start: "18:00", end: "19:30" }
    ],
    LS335: [
      { start: "07:30", end: "19:30" }
    ],
    VL103: [
      { start: "11:00", end: "17:45" }
    ],
    VL205: [
      { start: "11:00", end: "17:45" }
    ],
    VL206: [
      { start: "07:30", end: "10:45" },
      { start: "14:30", end: "17:45" }
    ],
    VL208A: [
      { start: "07:30", end: "17:45" }
    ],
    VL208B: [
      { start: "14:30", end: "17:45" }
    ],
    VL301: [
      { start: "07:30", end: "17:45" }
    ],
    VL310: [
      { start: "11:00", end: "14:15" }
    ],
    Y602: [
      { start: "07:30", end: "16:00" }
    ] 
  },

  Wednesday: {
    AG1904: [
      { start: "07:30", end: "14:15" }
    ],
    GK210: [
      { start: "09:15", end: "10:45" },
      { start: "12:45", end: "16:00" }
    ],
    GK304B: [
      { start: "07:30", end: "10:45" }
    ],
    GK404B: [
      { start: "07:30", end: "10:45" }
    ],
    SJ212: [
      { start: "09:15", end: "12:30" }
    ],
    LS320: [
      { start: "09:15", end: "10:45" },
      { start: "19:45", end: "21:00" }
    ],
    VL103: [
      { start: "07:30", end: "17:45" }
    ],
    VL205: [
      { start: "11:00", end: "14:15" }
    ],
    VL206: [
      { start: "07:30", end: "14:15" }
    ],
    VL208A: [
      { start: "07:30", end: "14:15" }
    ],
    VL208B: [
      { start: "07:30", end: "14:15" }
    ],
    VL301: [
      { start: "07:30", end: "14:15" }
    ],
    VL310: [
      { start: "07:30", end: "14:15" }
    ]
  },

  Thursday: {
    AG1904: [
      { start: "07:30", end: "14:15" }
    ],
    C314: [
      { start: "09:15", end: "10:45" },
      { start: "12:45", end: "14:15" },
      { start: "16:15", end: "17:45" }
    ],
    GK210: [
      { start: "09:15", end: "10:45" },
      { start: "14:30", end: "17:45" }
    ],
    GK211: [
      { start: "09:15", end: "12:30" }
    ],
    GK302A: [
      { start: "07:30", end: "12:30" },
      { start: "14:30", end: "17:45" }
    ],
    GK302B: [
      { start: "09:15", end: "16:00" }
    ],
    GK304A: [
      { start: "07:30", end: "10:45" },
      { start: "14:30", end: "16:00" }
    ],
    GK304B: [
      { start: "07:30", end: "14:15" }
    ],
    GK306A: [
      { start: "07:30", end: "09:00" },
      { start: "12:45", end: "16:00" }
    ],
    GK306B: [
      { start: "09:15", end: "16:00" }
    ],
    GK404A: [
      { start: "09:15", end: "16:00" },
      { start: "18:00", end: "19:30" }
    ],
    GK404B: [
      { start: "11:00", end: "12:30" }
    ],
    SJ212: [
      { start: "09:15", end: "12:30" }
    ],
    LS229: [
      { start: "09:15", end: "16:00" }
    ],
    LS320: [
      { start: "11:00", end: "12:30" }
    ],
    LS335: [
      { start: "07:30", end: "14:15" }
    ],
    VL103: [
      { start: "07:30", end: "17:45" }
    ],
    VL205: [
      { start: "07:30", end: "10:45" },
      { start: "14:30", end: "17:45" }
    ],
    VL206: [
      { start: "07:30", end: "17:45" }
    ],
    VL208A: [
      { start: "11:00", end: "17:45" }
    ],
    VL208B: [
      { start: "07:30", end: "17:45" }
    ],
    VL301: [
      { start: "07:30", end: "17:45" }
    ],
    VL310: [
      { start: "07:30", end: "17:45" }
    ],
    Y602: [
      { start: "11:00", end: "14:15" }
    ] 
  },

  Friday: {
    AG1904: [
      { start: "07:30", end: "14:15" }
    ],
    C314: [
      { start: "07:30", end: "16:00" }
    ],
    GK210: [
      { start: "09:15", end: "12:30" },
      { start: "14:30", end: "16:00" },
      { start: "18:00", end: "19:30" }
    ],
    GK211: [
      { start: "09:15", end: "16:00" }
    ],
    GK302A: [
      { start: "09:15", end: "14:15" },
      { start: "16:15", end: "17:45" }
    ],
    GK302B: [
      { start: "07:30", end: "10:45" },
      { start: "12:45", end: "16:00" }
    ],
    GK304B: [
      { start: "07:30", end: "10:45" },
      { start: "12:45", end: "14:15" }
    ],
    GK306A: [
      { start: "09:15", end: "10:45" }
    ],
    GK306B: [
      { start: "09:15", end: "10:45" }
    ],
    GK404A: [
      { start: "07:30", end: "16:00" }
    ],
    GK404B: [
      { start: "09:15", end: "10:45" }
    ],
    SJ212: [
      { start: "11:00", end: "12:30" },
      { start: "14:30", end: "16:00" }
    ],
    LS212: [
      { start: "09:15", end: "12:30" }
    ],
    LS229: [
      { start: "09:15", end: "17:45" }
    ],
    LS335: [
      { start: "07:30", end: "10:45" },
      { start: "12:45", end: "14:15" }
    ],
    VL103: [
      { start: "07:30", end: "17:45" }
    ],
    VL206: [
      { start: "07:30", end: "17:45" }
    ],
    VL208A: [
      { start: "07:30", end: "17:45" }
    ],
    VL208B: [
      { start: "14:30", end: "17:45" }
    ],
    VL301: [
      { start: "07:30", end: "17:45" }
    ],
    Y602: [
      { start: "14:30", end: "16:00" }
    ] 
  },

  Saturday: {
    GK210: [
      { start: "09:15", end: "12:30" }
    ],
    GK211: [
      { start: "11:00", end: "14:30" }
    ],
    GK304B: [
      { start: "09:15", end: "12:30" }
    ],
    GK404A: [
      { start: "09:15", end: "12:30" }
    ],
    LS335: [
      { start: "12:45", end: "16:00" }
    ]
  }
};

function toMinutes(time) {
  const [h,m] = time.split(':').map(Number);
  return h*60 + m;
}

function toTimeString(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h.toString().padStart(2,"0")}:${m.toString().padStart(2,"0")}`;
}

// check if a 30-min slot overlaps with blocked slots
function isSlotFree(slotStart, slotEnd, blockedSlots) {
  for (const b of blockedSlots || []) {
    const bStart = toMinutes(b.start);
    const bEnd = toMinutes(b.end);
    if (!(slotEnd <= bStart || slotStart >= bEnd)) return false; // overlap
  }
  return true;
}

async function seedSlots() {
  try {
    const deletedCount = await Slot.deleteMany({});
    console.log(`Deleted ${deletedCount.deletedCount} old slots.`);

    // Optional check:
    const remaining = await Slot.countDocuments({});
    console.log(`Remaining slots in DB: ${remaining}`);

    const labs = await Lab.find();
    for (const lab of labs) {
      for (const day of days) {
        const blocked = classSchedule[day]?.[lab.room] || [];

        // Generate 30-min slots from 07:30 (450) to 21:00 (1260)
        for (let mins = 450; mins + 30 <= 1260; mins += 30) {
          const slotStart = mins;
          const slotEnd = mins + 30;
          const free = isSlotFree(slotStart, slotEnd, blocked);

          console.log(`Lab: ${lab.room}, Day: ${day}, Slot: ${toTimeString(slotStart)}-${toTimeString(slotEnd)}, Free: ${free}`);

          // always create the slot, mark availability
          const exists = await Slot.findOne({ labID: lab._id, day, startTime: toTimeString(slotStart) });
          if (!exists) {
              const slot = new Slot({
                  labID: lab._id,
                  day,
                  startTime: toTimeString(slotStart),
                  endTime: toTimeString(slotEnd),
                  availability: free // true if free, false if blocked
              });
              await slot.save();
              console.log(`Created slot: ${lab.room} ${day} ${toTimeString(slotStart)}-${toTimeString(slotEnd)}, Availability: ${free}`);
          }
       }
      }
    }

    console.log("Seeding of lab slots completed!");
    mongoose.connection.close();
  } catch (err) {
    console.error("Error seeding slots:", err);
  }
}


seedSlots();