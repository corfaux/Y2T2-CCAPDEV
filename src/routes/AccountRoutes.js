const express = require('express');
const router = express.Router();
const Account = require('../models/Account');
const bcrypt = require("bcryptjs");

// seed a test student
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const account = await Account.findOne({ email });
    if (!account) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, account.passwordHash);
    if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

    res.json({
      _id: account._id,
      firstName: account.firstName,
      lastName: account.lastName,
      email: account.email,
      contactNumber: account.contactNumber,
      role: account.role
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;