const Reservation = require('../models/Reservation');

exports.getReservations = async (req, res) => {
  try {
    const { labID, date } = req.query;
    const query = {};

    if (labID) query.labID = labID;

    if (date) {
      const start = new Date(date);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);

      query.date = {
        $gte: start,
        $lt: end
      };
    }
    const reservations = await Reservation.find(query)
      .populate('labID')
      .populate('studentID')
      //.populate('slot_ID');
    // Format for frontend
    const formatted = reservations.map(r => ({
      _id: r._id,
      labID: r.labID._id,
      name: `${r.studentID.firstName} ${r.studentID.lastName}`,
      email: r.studentID.email,
      time: convertTo12Hour(r.slot_ID.startTime),
      seats: r.seats
    }));

    res.json(formatted);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

function convertTo12Hour(time) {
  const [h, m] = time.split(":");
  const hour = parseInt(h);
  const suffix = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${m} ${suffix}`;
}
