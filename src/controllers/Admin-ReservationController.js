const Reservation = require('../models/Reservation');

exports.deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Reservation.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ message: "Reservation not found" });

    res.json({ message: "Reservation deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

