const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { client } = require('./config/connectDB');

const { getServices, getAvailableBookingSlot } = require('./controllers/serviceController');
const {
  createBooking,
  getBookings,
  getSingleBooking,
  clientSecretGenerate,
  updateBooking,
} = require('./controllers/bookingController');
const { createUser, getUsers, makeUserAdmin, isAdmin } = require('./controllers/userController');
const { createDoctor, getDoctors, deleteDoctor } = require('./controllers/doctorController');

const { verifyToken } = require('./middleware/verifyToken');
const { verifyAdmin } = require('./middleware/verifyAdmin');
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
    app.post('/create-payment-intent', verifyToken, clientSecretGenerate);
    app.patch('/update-booking/:id', verifyToken, updateBooking);

    app.get('/users', verifyToken, getUsers);
    app.put('/users/:email', createUser);

    app.put('/users/make-admin/:email', verifyToken, verifyAdmin, makeUserAdmin);
    app.get('/admin/:email', verifyToken, isAdmin);

    app.post('/doctors', verifyToken, verifyAdmin, createDoctor);
    app.get('/doctors', verifyToken, verifyAdmin, getDoctors);
    app.delete('/doctor/:id', verifyToken, verifyAdmin, deleteDoctor);
  } finally {
  }
}

run().catch(console.dir);
