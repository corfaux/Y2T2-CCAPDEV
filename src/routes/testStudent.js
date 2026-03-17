const express = require('express');
const router = express.Router();
const Account = require('../models/Account');
const bcrypt = require("bcryptjs");

// create a test student
router.post("/create-test-student", async (req, res) => {
  try {
    // check if student already exists
    const existing = await Account.findOne({ email: req.body.email });

    if (existing) {
      // return existing student
      return res.json(existing);
    }

    // create new student only if not found
    const student = new Account(req.body);
    await student.save();

    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;