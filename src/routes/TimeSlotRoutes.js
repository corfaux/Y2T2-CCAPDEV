const express = require('express');
const router = express.Router();
const timeSlotController = require('../controllers/TimeSlotController');

// get all slots
router.get('/', timeSlotController.getAllSlots);
// book a slot
router.post('/book', timeSlotController.bookSlot);
// get all reservations
router.get('/reservations', timeSlotController.getReservations);

module.exports = router;