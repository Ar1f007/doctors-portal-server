const { client } = require('../config/connectDB');
const serviceCollection = client.db('doctors_portal').collection('services');
const bookingCollection = client.db('doctors_portal').collection('bookings');

exports.getServices = async (req, res) => {
  const services = await serviceCollection.find().project({ name: 1 }).toArray();
  res.send(services);
};

exports.getAvailableBookingSlot = async (req, res) => {
  // Should use : aggregate lookup, pipeline, match, group
  const date = req.query.date;

  // get all services
  const services = await serviceCollection.find().toArray();

  // get the booking of that day
  const bookings = await bookingCollection.find({ date }).toArray();

  // for each service
  services.forEach((service) => {
    // find bookings for that service
    const serviceBookings = bookings.filter((b) => b.treatment === service.name);

    // select slots for the service bookings
    const booked = serviceBookings.map((b) => b.slot);

    // replace slots with available slots
    service.slots = service.slots.filter((s) => !booked.includes(s));
  });

  res.send(services);
};
