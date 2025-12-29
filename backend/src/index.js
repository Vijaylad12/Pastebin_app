const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const escapeHtml = require('escape-html');
const pasteRoutes = require('./routes/paste');
const { getPaste, healthCheck, connectDB } = require('./services/db');
const { getCurrentTime, isPasteExpired } = require('./utils/paste-utils');

dotenv.config();

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// API Routes
app.use('/api', pasteRoutes);

// HTML View Route - Redirect to Frontend
app.get('/p/:id', async (req, res) => {
  const { id } = req.params;
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  res.redirect(`${frontendUrl}/p/${id}`);
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
