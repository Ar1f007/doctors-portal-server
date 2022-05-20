const { client } = require('../config/connectDB');
const userCollection = client.db('doctors_portal').collection('users');

exports.verifyAdmin = async (req, res, next) => {
  const initiatorEmail = req.user.email;
  const email = req.params.email;
  const initiatorAccount = await userCollection.findOne({ email: initiatorEmail });

  if (initiatorAccount.role === 'admin') {
    return next();
  }

  return res.status(403).send({ message: 'You are not allowed to perform this action' });
};
