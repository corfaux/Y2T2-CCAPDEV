const Lab = require('../models/Lab');
const Building = require('../models/Building')

exports.getAllLabs = async (req, res) => {
  try {
    const labs = await Lab.find().populate('buildingID'); //
    res.json(labs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createLab = async (req, res) => {
  try {
    const { buildingID, room, capacity } = req.body;

    const lab = new Lab({
      buildingID,
      room,
      capacity,
      availability: true
    });

    await lab.save();
    res.status(201).json(lab);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateLab = async (req, res) => {
  try {
    const { capacity, availability } = req.body;

    const lab = await Lab.findByIdAndUpdate(
      req.params.id,
      { capacity, availability },
      { new: true }
    ).populate('buildingID');

    res.json(lab);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteLab = async (req, res) => {
  try {
    await Lab.findByIdAndDelete(req.params.id);
    res.json({ message: 'Lab deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getLabSlots = async (req, res) => {
  try {
    const { labId } = req.params;

    const lab = await Lab.findById(labId);

    if (!lab) {
      return res.status(404).json({ message: "Lab not found" });
    }

    res.json(lab.slots || []); 
  } catch (err) {
    console.error("getLabSlots error:", err); 
    res.status(500).json({ message: "Server error" });
  }
};