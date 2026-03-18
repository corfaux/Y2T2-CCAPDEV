const mongoose = require('mongoose');
const Lab = require('../models/Lab');
const Building = require('../models/Building');

mongoose.connect('mongodb://127.0.0.1:27017/lab-reservation');

async function seedLabs() {
  try {

    await Lab.deleteMany({});

    // Find buildings by CODE, not name
    const gk = await Building.findOne({ code: "GK" });
    const vl = await Building.findOne({ code: "VL" });
    const ls = await Building.findOne({ code: "LS" });
    const sj = await Building.findOne({ code: "SJ" });
    const ag = await Building.findOne({ code: "AG" });
    const c = await Building.findOne({ code: "C" });
    const y = await Building.findOne({ code: "Y" });

    if (!gk || !vl || !ls || !sj || !ag || !c || !y) {
      console.error("Some buildings were not found. Run seedBuildings.js first.");
      process.exit();
    }

    const labs = [

      { buildingID: gk._id, room: "GK210", capacity: 40 },
      { buildingID: gk._id, room: "GK211", capacity: 40 },
      { buildingID: gk._id, room: "GK302A", capacity: 40 },
      { buildingID: gk._id, room: "GK302B", capacity: 40 },
      { buildingID: gk._id, room: "GK304B", capacity: 40 },
      { buildingID: gk._id, room: "GK306A", capacity: 40 },
      { buildingID: gk._id, room: "GK306B", capacity: 40 },
      { buildingID: gk._id, room: "GK404A", capacity: 40 },
      { buildingID: gk._id, room: "GK404B", capacity: 40 },

      { buildingID: ls._id, room: "LS212", capacity: 40 },
      { buildingID: ls._id, room: "LS229", capacity: 40 },
      { buildingID: ls._id, room: "LS320", capacity: 40 },
      { buildingID: ls._id, room: "LS335", capacity: 40 },

      { buildingID: sj._id, room: "SJ212", capacity: 40 },
    
      { buildingID: vl._id, room: "VL103", capacity: 40 },
      { buildingID: vl._id, room: "VL205", capacity: 40 },
      { buildingID: vl._id, room: "VL206", capacity: 40 },
      { buildingID: vl._id, room: "VL208A", capacity: 40 },
      { buildingID: vl._id, room: "VL208B", capacity: 40 },
      { buildingID: vl._id, room: "VL301", capacity: 40 },
      { buildingID: vl._id, room: "VL310", capacity: 40 },


      { buildingID: ag._id, room: "AG1904", capacity: 40 },

      { buildingID: c._id, room: "C314", capacity: 40 },
      
      { buildingID: y._id, room: "Y602", capacity: 40 }

    ];

    await Lab.insertMany(labs);

    console.log("Labs inserted successfully");

    mongoose.disconnect();

  } catch (err) {
    console.error(err);
  }
}

seedLabs();