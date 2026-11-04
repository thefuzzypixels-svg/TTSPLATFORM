const express = require('express');
const router = express.Router();
const edgeTTSService = require('../services/edgeTTS');

/**
 * GET /api/tts/voices
 * Return list of all available voices
 */
router.get('/voices', async (req, res) => {
  try {
    const voices = await edgeTTSService.getVoices();
    res.json({
      success: true,
      count: voices.length,
      voices,
    });
  } catch (error) {
    console.error('Error fetching voices:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve voice list',
      error: error.message,
    });
  }
});

/**
 * POST /api/tts/synthesize
 * Body: { text, voice, rate, pitch, volume }
 */
router.post('/synthesize', async (req, res) => {
  try {
    const { text, voice, rate, pitch, volume } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Text prompt cannot be empty',
      });
    }

    const result = await edgeTTSService.synthesize({
      text,
      voice,
      rate,
      pitch,
      volume,
    });

    const protocol = req.protocol;
    const host = req.get('host');
    const audioUrl = `${protocol}://${host}/uploads/${result.fileName}`;

    res.json({
      success: true,
      data: {
        ...result,
        audioUrl,
      },
    });
  } catch (error) {
    console.error('Synthesis error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to synthesize speech',
      error: error.message,
    });
  }
});

module.exports = router;
