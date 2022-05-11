const express = require('express');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5000;

const cors = require('cors');

app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  res.send('running');
});

app.listen(PORT, () => {
  console.log(`server running at port: ${PORT}`);
});
