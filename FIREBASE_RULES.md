# Firebase Security Rules Fix

The permission errors occur because Firestore's default security rules deny all access. You need to add the proper rules to allow reads/writes to the `songs` and `playlists` collections.

## Add these rules to your Firestore Rules:

Go to Firebase Console → Firestore Database → Rules and replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow anyone to read songs (public library)
    match /songs/{document=**} {
      allow read: if true;
      allow write: if true; // Change to authenticated users only in production
    }
    
    // Allow anyone to read playlists
    match /playlists/{document=**} {
      allow read: if true;
      allow write: if true; // Change to authenticated users only in production
    }
  }
}
```

## For Production:

Replace `if true` with authentication checks:

```javascript
match /songs/{document=**} {
  allow read: if request.auth != null;
  allow write: if request.auth != null;
}
```

This requires users to be logged in.

## After updating:

1. Save the rules in Firebase Console
2. Restart the dev server: `npm run dev`
3. The sidebar and library should load without "Unable to load playlists" errors
4. You can now upload songs

**Note:** The app currently has no user authentication. For production, add Firebase Authentication first, then restrict rules to authenticated users only.
