const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // load .env variables
const Reservation = require('./models/Reservation');

const Lab = require('./models/Lab');

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json()); // parse JSON requests

// routes
const timeSlotRoutes = require('./routes/TimeSlotRoutes');
app.use('/api/slots', timeSlotRoutes);

// get reservations by lab (room) and date
app.get("/api/reservations", async (req, res) => {
  try {
    const { labID, date } = req.query;

    if (!labID || !date) {
      return res.status(400).json({ message: "labID and date are required" });
    }

    // find the Lab document by room string (case-insensitive)
    const lab = await Lab.findOne({ room: labID.trim() });
    if (!lab) {
      return res.status(404).json({ message: `Lab '${labID}' not found` });
    }

    // parse the date
    const reservationDate = new Date(date);
    reservationDate.setHours(0, 0, 0, 0); // normalize to start of day
    const nextDay = new Date(reservationDate);
    nextDay.setDate(nextDay.getDate() + 1);

    // fetch reservations for this lab on that date
    const reservations = await Reservation.find({
      labID: lab._id,
      date: { $gte: reservationDate, $lt: nextDay }
    })
      .populate('slot_ID')   
      .populate('studentID') 
      .populate({
        path: 'labID',
        select: 'room buildingID'
      });

    res.json(reservations);

  } catch (err) {
    console.error("Error fetching reservations:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// mongodb connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lab-reservation';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
