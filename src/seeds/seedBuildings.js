const mongoose = require('mongoose');
const Building = require('../models/Building');

mongoose.connect('mongodb://127.0.0.1:27017/lab-reservation');

async function seedBuildings() {
  try {

    await Building.deleteMany({});

    const buildings = [
      { name: "Gokongwei Building", code: "GK" },
      { name: "St. La Salle Hall", code: "LS" },
      { name: "St. Joseph Hall", code: "SJ" },
      { name: "Velasco", code: "VL" },
      { name: "Br. Andrew Gonzales Hall", code: "AG" },
      { name: "STRC Building", code: "C" },
      { name: "Yuchengco Building", code: "Y" }
    ];

    await Building.insertMany(buildings);

    console.log("Buildings inserted successfully");

    mongoose.disconnect();

  } catch (err) {
    console.error(err);
  }
}

seedBuildings();