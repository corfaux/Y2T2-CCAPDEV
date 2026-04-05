const express = require('express');
const router = express.Router();
const AccountController = require("../controllers/AccountController");

router.post("/login", AccountController.login);
router.post("/signup", AccountController.signup);
router.post("/logout", AccountController.logout)
router.get("/check-session", AccountController.checkSession);
router.get("/profile", AccountController.getProfile);
router.patch("/save-profile", AccountController.saveProfile);
router.delete("/:_id", AccountController.deleteAccount);

module.exports = router;