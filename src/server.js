const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // load .env variables
const Reservation = require('./models/Reservation');
const Lab = require('./models/Lab');

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
const allowedOrigins = ["http://127.0.0.1:5500", "http://localhost:5500"];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true); // allow non-browser requests like Postman
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET","POST","PUT","DELETE"]
}));

app.use(express.json()); // parse JSON requests

// routes
const accountRoutes = require("./routes/AccountRoutes"); // must match filename exactly
app.use("/api/accounts", accountRoutes);
const availableSlotsRoutes  = require('./routes/AvailableSlotsRoutes');
app.use('/api/slots', availableSlotsRoutes);
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

    const specificLab = await Lab.findOne({ room: labID });

    if (specificLab) {
      labs = [specificLab._id];
    } 
    else {

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
