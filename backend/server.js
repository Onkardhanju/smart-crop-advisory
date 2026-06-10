const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// ✅ Allow ALL origins (easiest fix for deployment)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/farms', require('./routes/farmRoutes'));
app.use('/api/crops', require('./routes/cropRoutes'));
app.use('/api/weather', require('./routes/weatherRoutes'));
app.use('/api/advisory', require('./routes/advisoryRoutes'));

app.get('/', (req, res) => {
  res.json({
    message: 'Smart Crop Advisory API is running!',
    status: 'success'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
