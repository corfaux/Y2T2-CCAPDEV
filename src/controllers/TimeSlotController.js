const Slot = require('../models/TimeSlot');
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
    const { labID, studentID, slot_ID, date, seats } = req.body;

    // check if slot exists
    const slot = await Slot.findById(slot_ID);
    if (!slot) return res.status(404).json({ message: 'Slot not found' });

    // check if this slot is already booked for that date
    const existingReservation = await Reservation.findOne({ slot_ID, date, labID });
    if (existingReservation) return res.status(400).json({ message: 'Slot already booked for this date' });

    // create reservation
    const reservation = new Reservation({
      labID,
      studentID,
      slot_ID,
      date,
      seats
    });
    await reservation.save();

    res.json({ message: 'Slot booked successfully', reservation });
  } catch (err) {
    res.status(500).json({ error: err.message });
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