# Firebase Deployment Guide

This guide explains how to deploy Firestore and Storage security rules to your Firebase project.

## Prerequisites

1. Install Firebase CLI globally:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

## Initial Setup

If you haven't initialized Firebase in this project yet:

```bash
firebase init
```

When prompted:
- Select **Firestore** and **Storage**
- Choose your existing Firebase project
- Accept the default filenames (they match what's already in the repo)
- Don't overwrite existing files

## Deploy Rules

To deploy Firestore security rules:
```bash
firebase deploy --only firestore:rules
```

To deploy Storage security rules:
```bash
firebase deploy --only storage:rules
```

To deploy both at once:
```bash
firebase deploy --only firestore:rules,storage:rules
```

## Verify Deployment

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Firestore Database** → **Rules** tab
4. Verify the rules are deployed
5. Navigate to **Storage** → **Rules** tab
6. Verify the storage rules are deployed

## Admin Access

The security rules grant special permissions to the admin user:
- Email: `silasputerbaugh1@gmail.com`
- Permissions:
  - Read all listening sessions
  - Control other users' playback
  - Manage all data

## Troubleshooting

### Permission Denied Errors

If you see "Permission denied" errors after deployment:
1. Check that rules are deployed: `firebase deploy --only firestore:rules`
2. Verify you're logged in with the correct Firebase account
3. Check the browser console for detailed error messages
4. Verify the admin email matches in both `firestore.rules` and `AuthContext.jsx`

### Rules Not Updating

If changes don't seem to take effect:
1. Rules can take a few seconds to propagate
2. Clear browser cache and refresh
3. Verify deployment succeeded without errors
4. Check Firebase Console to see the current rules

### Testing Rules

You can test rules locally before deploying:
```bash
firebase emulators:start --only firestore
```

## Security Notes

- Never commit Firebase API keys to public repositories (though the current API key is already public)
- The admin email is hardcoded in the rules and should match the email in `AuthContext.jsx`
- Regular users can only access their own data
- All song metadata is publicly readable (by design)
