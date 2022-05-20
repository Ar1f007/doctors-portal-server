const { client } = require('../config/connectDB');
const userCollection = client.db('doctors_portal').collection('users');
const jwt = require('jsonwebtoken');

exports.isAdmin = async (req, res) => {
  const email = req.params.email;
  const user = await userCollection.findOne({ email });

  const isAdmin = user.role === 'admin';
  res.send({ admin: isAdmin });
};
exports.getUsers = async (req, res) => {
  const users = await userCollection.find().toArray();
  res.send(users);
};

exports.createUser = async (req, res) => {
  const email = req.params.email;

  const user = req.body.email;
  const name = req.body.name;
  const filter = { email };
  const options = { upsert: true };
  const updateDoc = { $set: { email: user, name } };

  const result = await userCollection.updateOne(filter, updateDoc, options);
  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });

  res.send({ result, token });
};

exports.makeUserAdmin = async (req, res) => {
  const initiatorEmail = req.user.email;
  const email = req.params.email;
  const initiatorAccount = await userCollection.findOne({ email: initiatorEmail });

  if (initiatorAccount.role === 'admin') {
    const filter = { email };
    const updateDoc = { $set: { role: 'admin' } };
    const result = await userCollection.updateOne(filter, updateDoc);

    return res.send(result);
  }

  return res.status(403).send({ message: 'You are not allowed to perform this action' });
};
