const { client } = require('../config/connectDB');
const bookingCollection = client.db('doctors_portal').collection('bookings');
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');

const options = {
  auth: {
    api_key: process.env.SENDGRID_API_KEY,
  },
};

const emailClient = nodemailer.createTransport(sgTransport(options));

const sendAppointmentEmail = (booking) => {
  const { treatment, patientName, patientEmail, date, slot } = booking;
  console.log(treatment, patientName, patientEmail, date, slot);
  const email = {
    from: process.env.EMAIL_SENDER,
    to: patientEmail,
    subject: 'Booking Confirmation',
    text: `Your appointment for ${treatment} has been confirmed on ${date} at ${slot}`,
    html: `
      <div>
      <b>Hello ${patientName}</b>,
      <p>Your appointment for ${treatment} has been confirmed on ${date} at ${slot}<p/>
      <div/>
    `,
  };

  emailClient.sendMail(email, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log('Message sent: ', info);
    }
  });
};

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
  sendAppointmentEmail(booking);
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
