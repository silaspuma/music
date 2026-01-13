# 🔥 Firebase Setup Guide for Pumafy

This guide will walk you through setting up Firebase for your Pumafy instance.

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Add project"**
3. Enter project name (e.g., "pumafy-music")
4. Disable Google Analytics (optional)
5. Click **"Create project"**

## Step 2: Enable Firebase Authentication

1. In Firebase Console, go to **Build → Authentication**
2. Click **"Get started"**
3. Enable **Email/Password** sign-in method
4. Click **"Save"**

## Step 3: Enable Firestore Database

1. Go to **Build → Firestore Database**
2. Click **"Create database"**
3. Select **"Start in production mode"** (we'll deploy custom rules)
4. Choose your preferred region
5. Click **"Enable"**

## Step 4: Enable Firebase Storage

1. Go to **Build → Storage**
2. Click **"Get started"**
3. Start in **production mode**
4. Choose the same region as Firestore
5. Click **"Done"**

## Step 5: Configure Storage Rules

In the Storage section, click on **"Rules"** tab and replace with:

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    // Allow authenticated users to upload music files
    match /songs/{allPaths=**} {
      allow read: if true;  // Anyone can read/download
      allow write: if request.auth != null;  // Only authenticated users can upload
    }
    
    // Allow authenticated users to upload images
    match /images/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

Click **"Publish"**

## Step 6: Deploy Firestore Security Rules

### Option A: Using Firebase CLI (Recommended)

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project:
   ```bash
   firebase init firestore
   ```
   - Select your Firebase project
   - Press Enter to accept `firestore.rules` as the rules file
   - Press Enter to accept `firestore.indexes.json` as the indexes file

4. Deploy the rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

### Option B: Manual Copy-Paste

1. In Firebase Console, go to **Firestore Database → Rules**
2. Copy the contents of `firestore.rules` from your project
3. Paste into the Firebase Console
4. Click **"Publish"**

## Step 7: Get Firebase Configuration

1. In Firebase Console, click the ⚙️ gear icon → **Project settings**
2. Scroll down to **"Your apps"** section
3. Click **Web** icon `</>`
4. Register your app with a nickname (e.g., "pumafy-web")
5. Copy the `firebaseConfig` object

## Step 8: Update Your Local Config

1. Open `src/firebase.config.js` in your project
2. Replace the config object with your values:

```javascript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
```

## Step 9: Create Indexes (Required for Queries)

Firestore needs indexes for complex queries. When you run the app, if you see console errors about missing indexes, Firestore will provide direct links to create them.

Alternatively, create these indexes manually:

1. Go to **Firestore Database → Indexes**
2. Click **"Create index"**

### Required Indexes:

**Index 1: User Uploads Query**
- Collection: `songs`
- Fields to index:
  - `uploadedBy` (Ascending)
  - `createdAt` (Descending)
- Query scope: Collection

**Index 2: Search by Username**
- Collection: `songs`
- Fields to index:
  - `uploaderUsername` (Ascending)
  - `createdAt` (Descending)
- Query scope: Collection

## Step 10: Set Up Admin User

1. Run your app locally: `npm run dev`
2. Create your first user account through the signup form
3. Go to Firebase Console → Firestore Database
4. Find your user document in the `users` collection
5. Click on the document
6. Add a new field:
   - Field name: `isAdmin`
   - Type: `boolean`
   - Value: `true`
7. Click **"Update"**

8. Open `src/contexts/AuthContext.jsx`
9. Update the `ADMIN_EMAIL` constant with your email:
   ```javascript
   const ADMIN_EMAIL = 'your-email@example.com';
   ```

## Step 11: Test Your Setup

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:5173

3. Test the following:
   - ✅ Sign up with a new account
   - ✅ Log in
   - ✅ Upload a song (check Storage console to see the file)
   - ✅ Play the song
   - ✅ Check that quota system works (shows "29/30 remaining")
   - ✅ View your uploads in Library
   - ✅ Check Stream shows recent uploads

## 🎉 You're Done!

Your Pumafy instance is now connected to Firebase and ready to use!

## 📊 Monitoring & Maintenance

### Check Usage
- Go to **Project Overview** to see:
  - Active users
  - Storage usage
  - Database reads/writes

### Set Up Budget Alerts
1. Go to **Project settings → Usage and billing**
2. Set up budget alerts to avoid unexpected charges
3. Free tier limits:
   - **Firestore**: 50K reads/day, 20K writes/day
   - **Storage**: 5GB stored, 1GB/day download
   - **Authentication**: Unlimited

### Backup Your Data
```bash
# Export Firestore data
firebase firestore:export gs://your-bucket/backups/$(date +%Y%m%d)

# Requires Firebase Blaze plan (pay-as-you-go)
```

## 🐛 Troubleshooting

### "Permission denied" errors
- Check that Firestore rules are deployed correctly
- Verify user is authenticated before uploading
- Check browser console for specific error messages

### Songs not appearing
- Check Firebase Console → Firestore Database → `songs` collection
- Verify `uploadedBy` field matches user's UID
- Check browser console for index creation links

### Upload fails
- Check Firebase Console → Storage to see if files are uploading
- Verify Storage rules allow authenticated writes
- Check file size (max 10MB recommended for free tier)

### "Quota exceeded" showing incorrectly
- Check Firestore Console → `users` collection
- Verify `uploadedToday` and `lastUploadDate` fields
- Try logging out and back in

## 🔐 Security Best Practices

1. **Never commit `firebase.config.js` with real credentials to public repos**
   - Add to `.gitignore`
   - Use environment variables for production

2. **Keep security rules restrictive**
   - Only authenticated users can write
   - Users can only delete their own content

3. **Monitor usage regularly**
   - Set up budget alerts
   - Check for unusual activity

4. **Backup regularly**
   - Export Firestore data monthly
   - Keep local backups of critical data

---

Need help? Check the [Firebase Documentation](https://firebase.google.com/docs) or create an issue in the repo!
