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
