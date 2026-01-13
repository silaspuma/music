import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { auth, db } from '../firebase.config';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const ADMIN_EMAIL = 'silasputerbaugh1@gmail.com';

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            
            if (user) {
                // Fetch or create user profile
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    setUserProfile(userDoc.data());
                } else {
                    // Create new user profile
                    const profile = {
                        uid: user.uid,
                        email: user.email,
                        username: user.displayName || user.email.split('@')[0],
                        listeningMinutes: 0,
                        uploadedToday: 0,
                        lastUploadDate: null,
                        uploadedSongs: [],
                        createdAt: new Date(),
                        isAdmin: user.email === ADMIN_EMAIL
                    };
                    await setDoc(doc(db, 'users', user.uid), profile);
                    setUserProfile(profile);
                }
            } else {
                setUserProfile(null);
            }
            
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const signup = async (email, password, username) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Update display name
        await updateProfile(user, { displayName: username });
        
        // Create user profile in Firestore
        const profile = {
            uid: user.uid,
            email: user.email,
            username: username,
            listeningMinutes: 0,
            uploadedToday: 0,
            lastUploadDate: null,
            uploadedSongs: [],
            createdAt: new Date(),
            isAdmin: user.email === ADMIN_EMAIL
        };
        await setDoc(doc(db, 'users', user.uid), profile);
        setUserProfile(profile);
        
        return userCredential;
    };

    const login = async (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logout = async () => {
        await signOut(auth);
        setCurrentUser(null);
        setUserProfile(null);
    };

    const updateListeningTime = async (minutes) => {
        if (currentUser && userProfile) {
            await updateDoc(doc(db, 'users', currentUser.uid), {
                listeningMinutes: increment(minutes)
            });
            setUserProfile({
                ...userProfile,
                listeningMinutes: (userProfile.listeningMinutes || 0) + minutes
            });
        }
    };

    const isAdmin = () => {
        return currentUser?.email === ADMIN_EMAIL;
    };

    const value = {
        currentUser,
        userProfile,
        loading,
        signup,
        login,
        logout,
        updateListeningTime,
        isAdmin
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
