const { client } = require('../config/connectDB');
const bookingCollection = client.db('doctors_portal').collection('bookings');

exports.createBooking = async (req, res) => {
  const booking = req.body;
  const query = {
    treatment: booking.treatment,
    date: booking.date,
    patientName: booking.patientName,
  };

  const alreadyBookedByTheSameUser = await bookingCollection.findOne(query);

  if (alreadyBookedByTheSameUser) {
    return res.send({
      success: false,
      message: `You have already booked an appointment for it on ${alreadyBookedByTheSameUser?.date} at ${alreadyBookedByTheSameUser?.slot}`,
    });
  }

  const slotAlreadyTaken = await bookingCollection.findOne({
    treatment: booking.treatment,
    slot: booking.slot,
    date: booking.date,
  });

  if (slotAlreadyTaken) {
    return res.send({
      success: false,
      message: 'Sorry, the time slot you picked is already taken. Please try another slot.',
    });
  }
  const response = await bookingCollection.insertOne(booking);
  return res.send({ success: true, response });
};

exports.getBookings = async (req, res) => {
  const email = req.user.email;
  const patientEmail = req.query.patientEmail;

  if (email === patientEmail) {
    const query = { patientEmail };
    const bookings = await bookingCollection.find(query).toArray();

    return res.send(bookings);
  }

  return res.status(403).send({ message: 'Forbidden access' });
};
