const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { client } = require('./config/connectDB');

const { getServices, getAvailableBookingSlot } = require('./controllers/serviceController');

const { createBooking, getBookings } = require('./controllers/bookingController');

const { createUser, getUsers, makeUserAdmin, isAdmin } = require('./controllers/userController');

const { verifyToken } = require('./middleware/verifyToken');
const { createDoctor } = require('./controllers/doctorController');

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
    app.post('/bookings', createBooking);

    app.get('/users', verifyToken, getUsers);
    app.put('/users/:email', createUser);

    app.put('/users/make-admin/:email', verifyToken, makeUserAdmin);
    app.get('/admin/:email', verifyToken, isAdmin);

    app.post('/doctors', verifyToken, createDoctor);
  } finally {
  }
}

run().catch(console.dir);
