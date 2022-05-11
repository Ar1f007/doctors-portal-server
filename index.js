const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { client } = require('./config/connectDB');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  res.send('running');
});

async function run() {
  try {
    await client.connect();
    console.log('DB connection established');
    app.listen(PORT, () => {
      console.log(`server running at port: ${PORT}`);
    });

    const serviceCollection = client.db('doctors_portal').collection('services');

    app.get('/services', async (req, res) => {
      const services = await serviceCollection.find({}).toArray();

      res.send(services);
    });
  } finally {
  }
}

run().catch(console.dir);
