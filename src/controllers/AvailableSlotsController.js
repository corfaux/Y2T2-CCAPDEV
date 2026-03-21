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
    const currentReservationID = req.query.reservationID;

    if (!building || !date) {
      return res.status(400).json({ message: "Missing building or date" });
    }

    const labs = await Lab.find({ building });
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    const reservations = await Reservation.find({
      date: selectedDate,
      labID: { $in: labs.map(l => l._id) }
    });

    const dayName = selectedDate.toLocaleDateString("en-US", { weekday: "long" });

    const result = [];

    for (const lab of labs) {
      const labReservations = reservations.filter(r => r.labID.toString() === lab._id.toString());
      const blockedByClass = classSchedule[dayName]?.[lab.room] || [];

      const slots = [];

      // fallback/default slots: 07:30 (450) to 21:00 (1260) in 30 min increments
      for (let mins = 450; mins + 30 <= 1260; mins += 30) {
        const start = toTimeString(mins);
        const end = toTimeString(mins + 30);

        // check class schedule
        const freeByClass = isSlotFree(mins, mins + 30, blockedByClass);

        // check reservations
        const reserved = labReservations.some(r => {
        // ignore the reservation being edited
        if (currentReservationID && r._id.toString() === currentReservationID) return false;

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

    // fetch lab info
    const lab = await Lab.findById(labID);
    if (!lab) return res.status(404).json({ message: "Lab not found" });

    // get all reservations for that lab on that date
    const labReservations = await Reservation.find({ labID, date: selectedDate });

    // get class schedule for that day
    const dayName = selectedDate.toLocaleDateString("en-US", { weekday: "long" });
    const blockedByClass = classSchedule[dayName]?.[lab.room] || [];

    const sStart = toMinutes(startTime);
    const sEnd = toMinutes(endTime);

    // check class schedule
    if (!isSlotFree(sStart, sEnd, blockedByClass)) {
      return res.status(400).json({ message: "Time slot overlaps with class schedule" });
    }

    // check reservations
    const conflict = labReservations.some(r => {
      const rStart = toMinutes(r.startTime);
      const rEnd = toMinutes(r.endTime);
      return !(sEnd <= rStart || sStart >= rEnd);
    });

    if (conflict) {
      return res.status(400).json({ message: "Time slot overlaps with existing reservation" });
    }

    // save reservation
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

    res.status(201).json({ message: "Reservation successful", reservation });

  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getReservations = async (req, res) => {
  try {
    const { studentID, date, labID } = req.query;
    const filter = {};
    if (studentID) filter.studentID = studentID;
    if (date) {
      const d = new Date(date);
      d.setHours(0,0,0,0);
      filter.date = d;
    }
    if (labID) filter.labID = labID;

    const reservations = await Reservation.find(filter)
      .populate({path: 'labID', model: 'Lab', populate: {path: 'buildingID', model: 'Building'}});

    res.json(reservations);
  } catch (err) {
    console.error("Get Reservations Error:", err);
    res.status(500).json({ error: err.message });
  }
};

/*
exports.deleteReservation = async (req, res) => {
  try {
    const { reservationID } = req.params;


    if (!reservationID) {
      return res.status(400).json({ message: "Reservation ID is required" });
    }


    const deleted = await Reservation.findByIdAndDelete(reservationID);


    if (!deleted) {
      return res.status(404).json({ message: "Reservation not found" });
    }


    res.json({ message: "Reservation deleted successfully" });
  } catch (err) {
    console.error("Delete reservation error:", err);
    res.status(500).json({ error: err.message });
  }
}; */

exports.updateReservation = async (req, res) => {
  try {
    const { reservationID } = req.params;
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

    if (!reservationID) {
      return res.status(400).json({ message: "Reservation ID required" });
    }

    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    // check conflict (same logic as booking)
    const conflict = await Reservation.findOne({
      labID,
      date: selectedDate,
      startTime: { $lt: endTime },
      endTime: { $gt: startTime },
      ...(reservationID ? { _id: { $ne: reservationID } } : {})
    });

    if (conflict) {
      return res.status(400).json({
        message: "Time slot overlaps with existing reservation"
      });
    }

    const updated = await Reservation.findByIdAndUpdate(
      reservationID,
      {
        labID,
        startTime,
        endTime,
        date: selectedDate,
        seats,
        primaryStudent,        
        additionalStudents       
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.json({
      message: "Reservation updated successfully",
      reservation: updated
    });

  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: err.message });
  }
};
