const express = require('express');
const router = express.Router();
const LabController = require('../controllers/Admin-LabController');

router.get('/', LabController.getAllLabs);
router.post('/', LabController.createLab);
router.put('/:id', LabController.updateLab);
router.delete('/:id', LabController.deleteLab);
router.get('/:labId/slots', LabController.getLabSlots);

module.exports = router;