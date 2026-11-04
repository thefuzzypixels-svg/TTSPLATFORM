# Edge TTS Platform 🎙️

A modern, full-stack Text-to-Speech (TTS) web platform powered by Microsoft Edge's Neural Text-to-Speech engine. No API keys or paid subscriptions required.

---

## 📁 Project Structure

```text
edge-tts-platform/
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx          # Main dashboard UI
│   │   │   ├── layout.tsx        # App layout and metadata
│   │   │   └── globals.css       # Tailwind & custom styles
│   │   │
│   │   ├── components/
│   │   │   ├── TextEditor.tsx     # Text script input & presets
│   │   │   ├── VoiceSelector.tsx  # Neural voice selection & filter
│   │   │   ├── VoiceSettings.tsx  # Rate, pitch & volume sliders
│   │   │   └── AudioPlayer.tsx    # Audio playback & MP3 download
│   │   │
│   │   └── lib/
│   │       └── api.ts             # API client for backend
│   │
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── server.js              # Express application server
│   │   ├── routes/
│   │   │   └── tts.routes.js      # TTS synthesis & voice routes
│   │   └── services/
│   │       └── edgeTTS.js         # Edge TTS synthesis engine
│   │
│   ├── uploads/                   # Generated audio storage
│   ├── .env                       # Backend port & client config
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18 or higher (v20+ recommended)
- **npm** or **yarn** / **pnpm**

---

### 1. Backend Setup

```bash
cd backend
npm install
npm start
```
- The backend will start on **`http://localhost:5000`**.
- Generated audio files are served from `http://localhost:5000/uploads/`.
- Health check available at `http://localhost:5000/api/health`.

### 2. Frontend Setup

In a new terminal window:

```bash
cd frontend
npm install
npm run dev
```
- The web app will open at **`http://localhost:3000`**.

---

## ⚡ Features

- **Free High-Quality Neural Voices**: Hundreds of natural voices across languages (US/UK English, Urdu, Hindi, Spanish, French, Arabic, and more).
- **Voice Customization**:
  - **Speech Speed / Rate**: Slower (-50%) to Faster (+100%).
  - **Pitch Modulation**: Deeper (-50Hz) to Higher (+50Hz).
  - **Volume Adjustments**: Customize output gain.
- **Interactive Audio Player**:
  - Live progress timeline and seeking.
  - One-click **Download MP3** button.
  - History of recent voice generations.
- **Modern Responsive Design**: Dark theme with Tailwind CSS, Lucide icons, and responsive layouts for desktop and mobile.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Backend status check |
| `GET` | `/api/tts/voices` | Returns all available Edge neural voices |
| `POST` | `/api/tts/synthesize` | Generates speech audio and returns URL |

### Sample Synthesis Request Body:
```json
{
  "text": "Hello world, this is a test voiceover.",
  "voice": "en-US-AriaNeural",
  "rate": "+0%",
  "pitch": "+0Hz",
  "volume": "+0%"
}
```

---

## 📜 License
MIT License. Free to use and modify.
