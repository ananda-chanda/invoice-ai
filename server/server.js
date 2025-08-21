require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Allow all origins for development
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '2mb' }));

// Check if MONGODB_URI is defined before connecting
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('Error: MONGODB_URI is not defined in environment variables.');
  process.exit(1);
}

mongoose.connect(mongoUri)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

app.get('/health', (_, res) => res.json({ ok: true }));

app.use('/api/invoices', require('./routes/invoices'));

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server running on ${port}`));