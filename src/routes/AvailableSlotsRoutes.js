const express = require('express');
const router = express.Router();
const availableSlotsController = require('../controllers/AvailableSlotsController');

// get all slots
router.get('/', availableSlotsController.getAllSlots);
// book a slot
router.post('/book', availableSlotsController.bookSlot);
// get all reservations
router.get('/reservations', availableSlotsController.getReservations);

module.exports = router;