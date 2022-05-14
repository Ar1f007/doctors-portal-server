const { client } = require('../config/connectDB');
const serviceCollection = client.db('doctors_portal').collection('services');

exports.getServices = async (req, res) => {
  const services = await serviceCollection.find({}).toArray();
  res.send(services);
};
