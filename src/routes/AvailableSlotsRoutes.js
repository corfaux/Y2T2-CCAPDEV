const express = require('express');
const router = express.Router();
const availableSlotsController = require('../controllers/AvailableSlotsController');

// --- Get available slots for a building & date ---
router.get('/', availableSlotsController.getAvailability);

// --- Book a slot (POST) ---
router.post('/book', availableSlotsController.bookSlot);

// --- Get all reservations ---
router.get('/reservations', availableSlotsController.getReservations);

// --- Update a reservation ---
router.put('/reservations/:reservationID', availableSlotsController.updateReservation);

module.exports = router;