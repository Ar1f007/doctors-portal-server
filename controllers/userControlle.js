const { client } = require('../config/connectDB');
const userCollection = client.db('doctors_portal').collection('users');

exports.createUser = async (req, res) => {
  const email = req.params.email;
  const user = req.body.email;
  const filter = { email };
  const options = { upsert: true };
  const updateDoc = { $set: { email: user } };

  const result = await userCollection.updateOne(filter, updateDoc, options);

  res.send(result);
};
