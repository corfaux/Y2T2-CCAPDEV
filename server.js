const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload');
require('dotenv').config();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
const allowedOrigins = [
  "http://127.0.0.1:5500",
  "http://localhost:5500",
  "http://127.0.0.1:5000",
  "http://localhost:5000",
  "http://localhost:3000"
];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true); // allow Postman / non-browser
    if(allowedOrigins.indexOf(origin) === -1){
      return callback(new Error('CORS policy does not allow access from this origin.'), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET","POST","PUT","DELETE"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({ createParentPath: true }));
app.use(express.static(path.join(__dirname, "../public")));

// --- Routes ---
const accountRoutes = require("./routes/AccountRoutes");
app.use("/api/accounts", accountRoutes);

const availableSlotsRoutes = require("./routes/AvailableSlotsRoutes");
app.use("/api/slots", availableSlotsRoutes);

const labRoutes = require("./routes/Admin-LabRoutes");
app.use("/api/labs", labRoutes);

// --- Default route ---
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

// --- MongoDB connection ---
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lab-reservation';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- Start server ---
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});