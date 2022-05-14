const { client } = require('../config/connectDB');
const bookingCollection = client.db('doctors_portal').collection('bookings');

exports.createBooking = async (req, res) => {
  const booking = req.body;
  const query = {
    treatment: booking.treatment,
    date: booking.date,
    patientName: booking.patientName,
  };

  const alreadyBooked = await bookingCollection.findOne(query);
  if (alreadyBooked) {
    return res.send({ success: false, booking: alreadyBooked });
  }
  const response = await bookingCollection.insertOne(booking);
  return res.send({ success: true, response });
};
