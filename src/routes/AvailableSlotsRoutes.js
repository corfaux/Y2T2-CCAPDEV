const express = require('express');
const router = express.Router();
const availableSlotsController = require('../controllers/AvailableSlotsController');

// get all slots
router.get('/', availableSlotsController.getAvailability);
// book a slot
router.post('/book', availableSlotsController.bookSlot);
// get all reservations
router.get('/reservations', availableSlotsController.getReservations);
// delete a reservation
router.delete('/reservations/:reservationID', availableSlotsController.deleteReservation);

module.exports = router;