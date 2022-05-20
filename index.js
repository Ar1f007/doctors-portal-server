const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { client } = require('./config/connectDB');

const { getServices, getAvailableBookingSlot } = require('./controllers/serviceController');
const { createBooking, getBookings, getSingleBooking } = require('./controllers/bookingController');
const { createUser, getUsers, makeUserAdmin, isAdmin } = require('./controllers/userController');
const { createDoctor, getDoctors, deleteDoctor } = require('./controllers/doctorController');

const { verifyToken } = require('./middleware/verifyToken');
const { verifyAdmin } = require('./middleware/verifyAdmin');
const stripe = require('stripe')(process.env.STRIPE_SK);
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

async function run() {
  try {
    await client.connect();

    app.get('/', async (req, res) => {
      res.send('running');
    });

    console.log('DB connection established');
    app.listen(PORT, () => {
      console.log(`server running at port: ${PORT}`);
    });

    app.get('/services', getServices);
    app.get('/services/available-slots', getAvailableBookingSlot);

    app.get('/bookings', verifyToken, getBookings);
    app.get('/bookings/:id', verifyToken, getSingleBooking);
    app.post('/bookings', createBooking);

    app.get('/users', verifyToken, getUsers);
    app.put('/users/:email', createUser);

    app.put('/users/make-admin/:email', verifyToken, verifyAdmin, makeUserAdmin);
    app.get('/admin/:email', verifyToken, isAdmin);

    app.post('/doctors', verifyToken, verifyAdmin, createDoctor);
    app.get('/doctors', verifyToken, verifyAdmin, getDoctors);
    app.delete('/doctor/:id', verifyToken, verifyAdmin, deleteDoctor);

    app.post('/create-payment-intent', async (req, res) => {
      const { price } = req.body;

      const amount = +price * 100;

      // Create a PaymentIntent with the order amount and currency
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        payment_method_types: ['card'],
      });

      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    });
  } finally {
  }
}

run().catch(console.dir);
