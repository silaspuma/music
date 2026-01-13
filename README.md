# 🐆 Pumafy - Community Music Platform

**Pumafy** is a SoundCloud/Napster-style community music platform where anyone can upload, share, and discover music. Upload up to 30 songs per day, build your profile, and get discovered by the community.

## ✨ Features

### Community Features
- 🎵 **Upload Your Music** - Any user can upload up to 30 songs per day (free forever!)
- 🌊 **Discovery Stream** - Browse recent uploads from the entire community
- 👤 **User Profiles** - Build your profile and showcase your uploads
- 📊 **Track Attribution** - Every song credits the uploader
- 🔍 **Smart Search** - Find music by title, artist, or uploader
- ❤️ **Liked Songs** - Save your favorite tracks
- 🎯 **Queue Management** - Full playback controls with queue

### Upload System
- 📤 **30 Songs Per Day** - Fair quota system for all users
- 🔄 **Daily Reset** - Quota refreshes every midnight
- 📈 **Upload Tracking** - See how many uploads you have remaining
- 🎨 **Auto Metadata** - Extracts metadata from MP3 files automatically
- 🖼️ **Album Art Support** - Embedded artwork displayed beautifully

### Playback Features
- 🔀 **Shuffle & Repeat** - Full playback controls
- ⌨️ **Keyboard Shortcuts** - Space (play/pause), arrows (navigation)
- 😴 **Sleep Timer** - Auto-pause after 15/30/45/60 minutes
- 📱 **PWA Support** - Install as an app on iOS/Android
- 🔊 **Media Session API** - Lock screen controls

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
1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Firestore Database**
3. Enable **Firebase Storage**
4. Enable **Firebase Authentication** (Email/Password)
5. Copy your config to `src/firebase.config.js`
6. Deploy the Firestore security rules:
   ```bash
   firebase deploy --only firestore:rules
   ```
   Or manually copy the rules from `firestore.rules` to your Firebase Console

### Admin Setup
1. Create your first user account through the app
2. In Firestore, find your user document in the `users` collection
3. Add a field `isAdmin: true` to your user document
4. Update the `ADMIN_EMAIL` constant in `src/contexts/AuthContext.jsx` with your email

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

## 📤 Upload Quota System

- **30 uploads per day** per user (free forever!)
- Quota resets at **midnight** every day
- Upload counter shows remaining uploads: `(23/30)`
- Users can delete their own songs at any time
- Admins can manage all content

## 🔒 Security & Permissions

Firestore security rules ensure:
- ✅ Any authenticated user can upload songs
- ✅ Users can only delete their own songs
- ✅ Admins can manage all content
- ✅ Song attribution is enforced (uploadedBy field required)
- ✅ All users can read/discover all songs

## 🎨 Themes

Choose from 5 beautiful themes in Settings:
- 🌑 Dark (Default)
- ☀️ Light
- 🌊 Ocean Blue
- 💜 Purple Dream
- 🌲 Forest Green

## 📊 Stats & Analytics

- Total uploads per user
- User profile pages with upload history
- Recently uploaded stream
- Artist and album pages
- Listening time tracking

## 🛠️ Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool
- **Firebase** - Backend (Firestore + Storage + Auth)
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **music-metadata-browser** - MP3 metadata extraction
- **Media Session API** - Lock screen controls

## 🗂️ Database Schema

### Users Collection
```javascript
{
  uid: string,
  email: string,
  username: string,
  uploadedToday: number,      // Daily upload count
  lastUploadDate: timestamp,   // Last upload date
  uploadedSongs: string[],     // Array of song IDs
  isAdmin: boolean
}
```

### Songs Collection
```javascript
{
  title: string,
  artist: string,
  album: string,
  duration: number,
  url: string,
  imageUrl: string,
  uploadedBy: string,          // User UID
  uploaderUsername: string,    // Display name
  uploaderEmail: string,       // For attribution
  createdAt: timestamp
}
```

## 📄 License

MIT License - Feel free to use this project for your own purposes!

## 🤝 Contributing

Community music library means community contributions! Feel free to submit issues or pull requests.

---

Made with ❤️ by the Pumafy community
