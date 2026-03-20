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
      idNumber: account.idNumber,
      college: account.college,
      description: account.description,
      role: account.role
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// create new user (student) account
router.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password, 
            contactNumber, idNumber, college, description, 
            role 
          } = req.body;

    const existingUser = await Account.findOne({ email });
    if(existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAccount = new Account({
      firstName: firstName,
      lastName: lastName,
      email: email,
      passwordHash: hashedPassword,
      contactNumber: contactNumber,
      idNumber: idNumber,
      college: college,
      description: description,
      role: role
    });

    await newAccount.save();

    res.status(201).json({ message: "Account created successfully!" });
  } catch(err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Server crashed during signup." });
  }
});

// account deletion by user
router.delete("/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const deletedAccount = await Account.findOneAndDelete({ email: email});

    if(!deletedAccount) {
      return res.status(404).json({ message: "Account not found." });
    }

    res.status(200).json({ message: "Account successfully deleted." });
  } catch(err) {
    console.error("Account deletion error:", err);
    res.status(500).json({ message: "Server error while deleting account." });
  }
});

module.exports = router;