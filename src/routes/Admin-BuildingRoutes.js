const express = require('express');
const router = express.Router();
const Building = require('../models/Building');

// create new building
router.post('/', async (req, res) => {
  try {
    const { name, code } = req.body;

    const existing = await Building.findOne({ code });
    if (existing) {
      return res.status(400).json({ message: "Building already exists" });
    }

    const building = new Building({ name, code });
    await building.save();

    res.status(201).json(building);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// get building by code
router.get('/code/:code', async (req, res) => {
  try {
    const building = await Building.findOne({ code: req.params.code });

    if (!building) {
      return res.status(404).json({ message: "Building not found" });
    }

    res.json(building);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;