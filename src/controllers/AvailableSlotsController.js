const Lab = require('../models/Lab');
const Reservation = require('../models/Reservation');
const classSchedule = require('../models/ClassSchedule');

function toMinutes(time) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function toTimeString(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

function isSlotFree(slotStart, slotEnd, blockedSlots) {
  for (const b of blockedSlots || []) {
    const bStart = toMinutes(b.start);
    const bEnd = toMinutes(b.end);

    if (!(slotEnd <= bStart || slotStart >= bEnd)) {
      return false; // overlap with class
    }
  }
  return true;
}

exports.getAvailability = async (req, res) => {
  try {
    const { building, date } = req.query;

    if (!building || !date) {
      return res.status(400).json({ message: "Missing building or date" });
    }

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    await Reservation.deleteMany({
      $or: [
        { date: { $lt: todayStart } }, // past days
        {
          date: todayStart, // today but already finished
          endTime: {
            $lt: toTimeString(currentMinutes)
          }
        }
      ]
    });

    const labs = await Lab.find({ building });
    const labIds = labs.map(l => l._id);

    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    const reservations = await Reservation.find({
      date: selectedDate,
      labID: { $in: labIds }
    });

    const dayName = selectedDate.toLocaleDateString("en-US", {
      weekday: "long"
    });

    const result = [];

    for (const lab of labs) {
      const labReservations = reservations.filter(r =>
        r.labID.toString() === lab._id.toString()
      );

      const blockedByClass = classSchedule[dayName]?.[lab.room] || [];

      const slots = [];

      for (let mins = 450; mins + 30 <= 1260; mins += 30) {
        const start = toTimeString(mins);
        const end = toTimeString(mins + 30);

        const freeByClass = isSlotFree(mins, mins + 30, blockedByClass);

        const reserved = labReservations.some(r => {
          const rStart = toMinutes(r.startTime);
          const rEnd = toMinutes(r.endTime);

          return !(mins + 30 <= rStart || mins >= rEnd);
        });

        slots.push({
          startTime: start,
          endTime: end,
          available: freeByClass && !reserved
        });
      }

      result.push({
        room: lab.room,
        labID: lab._id,
        slots
      });
    }

    res.json(result);

  } catch (err) {
    console.error("Availability error:", err);
    res.status(500).json({ error: err.message });
  }
};


exports.bookSlot = async (req, res) => {
  try {
    const {
      labID,
      studentID,
      startTime,
      endTime,
      date,
      seats,
      primaryStudent,
      additionalStudents
    } = req.body;

    if (!labID || !studentID || !startTime || !endTime || !date || !seats) {
      return res.status(400).json({ message: "Missing required field(s)" });
    }

    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    const conflict = await Reservation.findOne({
      labID,
      date: selectedDate,
      startTime: { $lt: endTime },
      endTime: { $gt: startTime }
    });

    if (conflict) {
      return res.status(400).json({
        message: "Time slot overlaps with existing reservation"
      });
    }

    const reservation = new Reservation({
      labID,
      studentID,
      startTime,
      endTime,
      date: selectedDate,
      seats,
      primaryStudent: primaryStudent || {},
      additionalStudents: additionalStudents || []
    });

    await reservation.save();

    res.status(201).json({
      message: "Reservation successful",
      reservation
    });

  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getReservations = async (req, res) => {
  const { labID, date } = req.query;
  const filter = {};
  if (labID) filter.labID = labID;
  if (date) {
    const d = new Date(date);
    d.setHours(0,0,0,0);
    filter.date = d;
  }
  const reservations = await Reservation.find(filter);
  res.json(reservations);
};