// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// TODO: Replace the following with your app's Firebase project configuration
// You can find this in your Firebase Console -> Project Settings -> General
const firebaseConfig = {
  apiKey: "AIzaSyDqsz2agOo3hLHXd8mX9iCyAKm22-5Q5OY",
  authDomain: "music-e960b.firebaseapp.com",
  projectId: "music-e960b",
  storageBucket: "music-e960b.firebasestorage.app",
  messagingSenderId: "330042670138",
  appId: "1:330042670138:web:5a508c64342f5cd5934903"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export default app;
