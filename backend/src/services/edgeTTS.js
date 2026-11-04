const { MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts');
const path = require('path');
const fs = require('fs');

class EdgeTTSService {
  constructor() {
    this.tts = new MsEdgeTTS();
    this.cachedVoices = null;
    this.uploadsDir = path.join(__dirname, '..', '..', 'uploads');

    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  /**
   * Fetch all available Edge TTS voices
   */
  async getVoices() {
    if (this.cachedVoices && this.cachedVoices.length > 0) {
      return this.cachedVoices;
    }

    try {
      const voices = await this.tts.getVoices();
      // Format voices with clean metadata
      this.cachedVoices = voices.map((v) => ({
        name: v.Name,
        shortName: v.ShortName,
        gender: v.Gender,
        locale: v.Locale,
        friendlyName: v.FriendlyName || v.ShortName,
        suggestedCodec: v.SuggestedCodec,
      }));
      return this.cachedVoices;
    } catch (error) {
      console.error('Failed to get voices from Edge TTS service:', error.message);
      // Return reliable fallback list of popular neural voices if remote fetch fails
      return this.getFallbackVoices();
    }
  }

  /**
   * Synthesize text to speech and save as MP3 file
   */
  async synthesize({ text, voice = 'en-US-AriaNeural', rate = '+0%', pitch = '+0Hz', volume = '+0%' }) {
    if (!text || text.trim() === '') {
      throw new Error('Text is required for TTS synthesis.');
    }

    // Format rate, pitch, volume to acceptable Edge TTS string formats if numeric
    const formattedRate = typeof rate === 'number' ? (rate >= 0 ? `+${rate}%` : `${rate}%`) : rate;
    const formattedPitch = typeof pitch === 'number' ? (pitch >= 0 ? `+${pitch}Hz` : `${pitch}Hz`) : pitch;
    const formattedVolume = typeof volume === 'number' ? (volume >= 0 ? `+${volume}%` : `${volume}%`) : volume;

    const ttsInstance = new MsEdgeTTS();
    await ttsInstance.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);

    const timestamp = Date.now();
    const safeVoiceTag = voice.replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = `tts_${safeVoiceTag}_${timestamp}.mp3`;
    const filePath = path.join(this.uploadsDir, fileName);

    const readable = ttsInstance.toStream(text, {
      rate: formattedRate,
      pitch: formattedPitch,
      volume: formattedVolume,
    });

    return new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(filePath);

      readable.pipe(writeStream);

      writeStream.on('finish', () => {
        const stats = fs.statSync(filePath);
        resolve({
          fileName,
          filePath,
          fileSize: stats.size,
          voice,
          textLength: text.length,
          createdAt: new Date().toISOString(),
        });
      });

      writeStream.on('error', (err) => {
        reject(new Error(`Failed to write audio file: ${err.message}`));
      });

      readable.on('error', (err) => {
        reject(new Error(`Edge TTS streaming error: ${err.message}`));
      });
    });
  }

  /**
   * Fallback curated voices in case Microsoft metadata endpoint is temporarily unavailable
   */
  getFallbackVoices() {
    return [
      { name: 'Microsoft Server Speech Text to Speech Voice (en-US, AriaNeural)', shortName: 'en-US-AriaNeural', gender: 'Female', locale: 'en-US', friendlyName: 'Aria (US English)' },
      { name: 'Microsoft Server Speech Text to Speech Voice (en-US, GuyNeural)', shortName: 'en-US-GuyNeural', gender: 'Male', locale: 'en-US', friendlyName: 'Guy (US English)' },
      { name: 'Microsoft Server Speech Text to Speech Voice (en-US, JennyNeural)', shortName: 'en-US-JennyNeural', gender: 'Female', locale: 'en-US', friendlyName: 'Jenny (US English)' },
      { name: 'Microsoft Server Speech Text to Speech Voice (en-GB, SoniaNeural)', shortName: 'en-GB-SoniaNeural', gender: 'Female', locale: 'en-GB', friendlyName: 'Sonia (UK English)' },
      { name: 'Microsoft Server Speech Text to Speech Voice (en-GB, RyanNeural)', shortName: 'en-GB-RyanNeural', gender: 'Male', locale: 'en-GB', friendlyName: 'Ryan (UK English)' },
      { name: 'Microsoft Server Speech Text to Speech Voice (ur-PK, UzmaNeural)', shortName: 'ur-PK-UzmaNeural', gender: 'Female', locale: 'ur-PK', friendlyName: 'Uzma (Urdu - Pakistan)' },
      { name: 'Microsoft Server Speech Text to Speech Voice (ur-PK, AsadNeural)', shortName: 'ur-PK-AsadNeural', gender: 'Male', locale: 'ur-PK', friendlyName: 'Asad (Urdu - Pakistan)' },
      { name: 'Microsoft Server Speech Text to Speech Voice (hi-IN, SwaraNeural)', shortName: 'hi-IN-SwaraNeural', gender: 'Female', locale: 'hi-IN', friendlyName: 'Swara (Hindi - India)' },
      { name: 'Microsoft Server Speech Text to Speech Voice (hi-IN, MadhurNeural)', shortName: 'hi-IN-MadhurNeural', gender: 'Male', locale: 'hi-IN', friendlyName: 'Madhur (Hindi - India)' },
      { name: 'Microsoft Server Speech Text to Speech Voice (ar-SA, ZariyahNeural)', shortName: 'ar-SA-ZariyahNeural', gender: 'Female', locale: 'ar-SA', friendlyName: 'Zariyah (Arabic - Saudi Arabia)' },
      { name: 'Microsoft Server Speech Text to Speech Voice (es-ES, ElviraNeural)', shortName: 'es-ES-ElviraNeural', gender: 'Female', locale: 'es-ES', friendlyName: 'Elvira (Spanish - Spain)' },
      { name: 'Microsoft Server Speech Text to Speech Voice (fr-FR, DeniseNeural)', shortName: 'fr-FR-DeniseNeural', gender: 'Female', locale: 'fr-FR', friendlyName: 'Denise (French - France)' },
      { name: 'Microsoft Server Speech Text to Speech Voice (de-DE, KatjaNeural)', shortName: 'de-DE-KatjaNeural', gender: 'Female', locale: 'de-DE', friendlyName: 'Katja (German - Germany)' }
    ];
  }
}

module.exports = new EdgeTTSService();
