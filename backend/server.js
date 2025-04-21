const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// Middleware
app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));
app.use('/altImg', express.static(path.join(__dirname, 'public/assets/altImg')));


// API Routes
app.use('/api', (req, res, next) => {
  console.log('API request received:', req.url); // Debug log
  next();
}, require('./routes/product'));

// Serve React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ error: 'Internal server error' });
});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});