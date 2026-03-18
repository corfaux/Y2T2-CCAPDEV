const Slot = require('../models/AvailableSlots');
const Reservation = require('../models/Reservation');

// get all slots
exports.getAllSlots = async (req, res) => {
  try {
    const slots = await Slot.find();
    res.json(slots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// book a slot
exports.bookSlot = async (req, res) => {
  try {
    console.log("Booking request body:", req.body);

    const { labID, studentID, slot_ID, date, seats, primaryStudent, additionalStudents } = req.body;

    // Validate required fields
    if (!labID || !studentID || !slot_ID || !date || !seats) {
      return res.status(400).json({ message: "Missing required field(s)" });
    }

    // Check if slot exists
    const slot = await Slot.findById(slot_ID);
    if (!slot) return res.status(404).json({ message: "Slot not found" });

    // Check if slot is already booked for that date
    const existingReservation = await Reservation.findOne({ slot_ID, date, labID });
    if (existingReservation) {
      return res.status(400).json({ message: "Slot already booked for this date" });
    }

    // Create reservation
    const reservation = new Reservation({
      labID,
      studentID,
      slot_ID,
      date,
      seats,
      primaryStudent: primaryStudent || {},       // save optional fields
      additionalStudents: additionalStudents || [] // save optional fields
    });

    await reservation.save();

    res.status(201).json({ message: "Slot booked successfully", reservation });
  } catch (err) {
    console.error("Book slot error:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};


// get reservations
exports.getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate('slot_ID')
      .populate('labID')
      .populate('studentID');
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};