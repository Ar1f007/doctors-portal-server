const { ObjectId } = require('mongodb');
const { client } = require('../config/connectDB');

const doctorCollection = client.db('doctors_portal').collection('doctors');

exports.createDoctor = async (req, res) => {
  const doctorInfo = req.body;

  const email = doctorInfo.email;
  const alreadyExists = await doctorCollection.findOne({ email });

  if (alreadyExists) {
    return res.status(424).send('Already a doctor with the same email exists.');
  }

  const response = await doctorCollection.insertOne(doctorInfo);
  return res.status(201).send(response);
};

exports.getDoctors = async (req, res) => {
  const doctors = await doctorCollection.find().toArray();

  res.send(doctors);
};

exports.deleteDoctor = async (req, res) => {
  const id = req.params.id;
  const exists = await doctorCollection.findOne({ _id: ObjectId(id) });

  if (exists) {
    const response = await doctorCollection.deleteOne({ _id: ObjectId(id) });
    return res.send(response);
  }

  return res.send('Doctor does not exists');
};
