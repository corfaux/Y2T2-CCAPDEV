const express = require('express');
const router = express.Router();
const Building = require('../models/Building');

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