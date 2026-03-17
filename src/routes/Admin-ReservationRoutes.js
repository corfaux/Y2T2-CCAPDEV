const express = require('express');
const router = express.Router();
const ReservationController = require('../controllers/Admin-ReservationController');

router.get('/', ReservationController.getReservations);
router.post('/', ReservationController.createReservation);
router.delete('/:id', ReservationController.deleteReservation);

module.exports = router;