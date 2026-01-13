# 🐆 Pumafy - Community Music Library

**Pumafy** is a community music library you can access from anywhere. Upload your music, create playlists, track your listening stats, and enjoy a beautiful Spotify-inspired interface with powerful features.

## ✨ Features

### Core Features
- 🎵 **Upload & Play Music** - Extract metadata from MP3 files automatically
- 📝 **Playlists** - Create custom playlists with covers and descriptions
- ❤️ **Liked Songs** - Save your favorite tracks
- 🔀 **Shuffle & Repeat** - Full playback controls with multiple repeat modes
- 🎯 **Queue Management** - View and manage your playback queue
- 📊 **Listening Stats** - Track your top songs, artists, and listening time
- 🕐 **Recently Played** - View your listening history
- 🔍 **Smart Search** - Filter by artist, album, or all content
- 📱 **PWA Support** - Install as an app on iOS/Android

### Advanced Features
- ⌨️ **Keyboard Shortcuts** - Space (play/pause), arrows (navigation), S (shuffle), R (repeat)
- 😴 **Sleep Timer** - Auto-pause after 15/30/45/60 minutes
- 🎨 **Custom Themes** - 5 color schemes (Dark, Light, Ocean Blue, Purple Dream, Forest Green)
- 📤 **Export/Import** - Backup your library as JSON
- 🔄 **Duplicate Detection** - Prevents re-uploading the same songs
- 🎚️ **Sort & Filter** - Organize by date, title, artist, or play count

## 📱 Install as PWA on iOS

1. Open Pumafy in **Safari** on your iPhone/iPad
2. Tap the **Share** button (square with arrow pointing up)
3. Scroll down and tap **"Add to Home Screen"**
4. Tap **"Add"** in the top right corner
5. Pumafy will now appear on your home screen like a native app!

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- Firebase account with Firestore and Storage enabled

### Installation

```bash
npm install
```

### Firebase Setup
1. Create a Firebase project
2. Enable Firestore Database
3. Enable Firebase Storage
4. Copy your config to `src/firebase.config.js`

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

## 🎮 Keyboard Shortcuts

- **Space** - Play/Pause
- **→** - Next track (Shift+→: Seek forward 10s)
- **←** - Previous track (Shift+←: Seek backward 10s)
- **↑** - Volume up
- **↓** - Volume down
- **S** - Toggle shuffle
- **R** - Cycle repeat modes (Off → All → One)

## 🎨 Themes

Choose from 5 beautiful themes in Settings:
- 🌑 Dark (Default)
- ☀️ Light
- 🌊 Ocean Blue
- 💜 Purple Dream
- 🌲 Forest Green

## 📊 Stats & Analytics

- Total plays counter
- Total listening time
- Top 10 songs
- Top 10 artists
- Recently played history

## 🛠️ Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool
- **Firebase** - Backend (Firestore + Storage)
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **music-metadata-browser** - MP3 metadata extraction
- **Media Session API** - Lock screen controls

## 📄 License

MIT License - Feel free to use this project for your own purposes!

## 🤝 Contributing

Community music library means community contributions! Feel free to submit issues or pull requests.

---

Made with ❤️ by the Pumafy community
