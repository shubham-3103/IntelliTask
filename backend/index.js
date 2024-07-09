const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const port = process.env.PORT || 5000;
const CreateTaskRoute = require('./Routes/CreateTaskRoute')

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

app.use('/', CreateTaskRoute);

db.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });
  
  db.once('open', () => {
    console.log('Connected to MongoDB');
  });
  
  db.once('disconnected', () => {
    console.log('Disconnected from MongoDB');
  });
  
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
  