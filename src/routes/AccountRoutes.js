const express = require('express');
const router = express.Router();
const AccountController = require("../controllers/AccountController");

router.post("/login", AccountController.login);
router.post("/signup", AccountController.signup);
router.post("/save-profile", AccountController.saveProfile);
router.delete("/:email", AccountController.deleteAccount);

module.exports = router;