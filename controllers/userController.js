const { client } = require('../config/connectDB');
const userCollection = client.db('doctors_portal').collection('users');
const jwt = require('jsonwebtoken');

exports.getUsers = async (req, res) => {
  const users = await userCollection.find().toArray();
  res.send(users);
};

exports.createUser = async (req, res) => {
  const email = req.params.email;
  const user = req.body.email;
  const filter = { email };
  const options = { upsert: true };
  const updateDoc = { $set: { email: user } };

  const result = await userCollection.updateOne(filter, updateDoc, options);
  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.send({ result, token });
};
