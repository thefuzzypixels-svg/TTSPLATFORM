const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const ttsRoutes = require('./routes/tts.routes');

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static generated audio files from uploads directory
const uploadsPath = path.join(__dirname, '..', 'uploads');
app.use('/uploads', express.static(uploadsPath));

// Routes
app.use('/api/tts', ttsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Edge TTS Platform Backend',
    timestamp: new Date().toISOString(),
  });
});

// Root endpoint info
app.get('/', (req, res) => {
  res.send('Edge TTS Platform API is running. Check /api/tts/voices or /api/health.');
});

// Start server
app.listen(PORT, () => {
  console.log(`TTS Backend running on http://localhost:${PORT}`);
  console.log(`Audio uploads served at http://localhost:${PORT}/uploads/`);
});
