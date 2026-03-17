const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // load .env variables
const Reservation = require('./models/Reservation');
const Lab = require('./models/Lab');
const testStudentRoutes = require("./routes/testStudent");

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
const corsOptions = {
  origin: "http://127.0.0.1:5500", // frontend origin
  methods: ["GET","POST","PUT","DELETE"],
  credentials: true // if you need cookies
};

app.use(cors(corsOptions));

app.use(express.json()); // parse JSON requests
app.use("/api/test", testStudentRoutes);

// routes
const timeSlotRoutes = require('./routes/TimeSlotRoutes');
app.use('/api/slots', timeSlotRoutes);
const labRoutes = require('./routes/Admin-LabRoutes');
app.use('/api/labs', labRoutes);

// get reservations by lab (room) and date
app.get("/api/reservations", async (req, res) => {
  try {
    const { labID, date } = req.query;

    if (!labID || !date) {
      return res.status(400).json({ message: "labID and date required" });
    }

    const reservationDate = new Date(date);
    reservationDate.setHours(0,0,0,0);

    const nextDay = new Date(reservationDate);
    nextDay.setDate(nextDay.getDate() + 1);

    let labs;

    // CASE 1: exact room (GK210)
    const specificLab = await Lab.findOne({ room: labID });

    if (specificLab) {
      labs = [specificLab._id];
    } 
    else {
      // CASE 2: building code (GK, LS, VL)
      const building = await Lab.aggregate([
        {
          $lookup: {
            from: "buildings",
            localField: "buildingID",
            foreignField: "_id",
            as: "building"
          }
        },
        { $unwind: "$building" },
        { $match: { "building.code": labID } }
      ]);

      labs = building.map(l => l._id);
    }

    const reservations = await Reservation.find({
      labID: { $in: labs },
      date: { $gte: reservationDate, $lt: nextDay }
    }).populate("slot_ID");

    res.json(reservations);

  } catch (err) {
    console.error(err);
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
