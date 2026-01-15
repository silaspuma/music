import { db } from '../firebase.config';
import { collection, doc, setDoc, deleteDoc, query, where, onSnapshot, getDocs, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';

// Update or create a user's current listening session
export const updateListeningSession = async (userId, username, songData, currentTime = 0) => {
    try {
        const sessionRef = doc(db, 'listeningSessions', userId);
        await setDoc(sessionRef, {
            userId,
            username,
            currentSong: songData ? {
                id: songData.id,
                title: songData.title,
                artist: songData.artist,
                album: songData.album,
                imageUrl: songData.imageUrl,
                duration: songData.duration
            } : null,
            isPlaying: !!songData,
            currentTime: currentTime,
            lastUpdated: serverTimestamp()
        }, { merge: true });
    } catch (error) {
        console.error('Error updating listening session:', error);
    }
};

// Clear a user's listening session
export const clearListeningSession = async (userId) => {
    try {
        const sessionRef = doc(db, 'listeningSessions', userId);
        await deleteDoc(sessionRef);
    } catch (error) {
        console.error('Error clearing listening session:', error);
    }
};

// Update play/pause state
export const updatePlayState = async (userId, isPlaying) => {
    try {
        const sessionRef = doc(db, 'listeningSessions', userId);
        await updateDoc(sessionRef, {
            isPlaying,
            lastUpdated: serverTimestamp()
        });
    } catch (error) {
        console.error('Error updating play state:', error);
    }
};

// Subscribe to all active listening sessions (for admin)
export const subscribeToListeningSessions = (callback) => {
    const q = query(collection(db, 'listeningSessions'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const sessions = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(sessions);
    }, (error) => {
        console.error('Error subscribing to listening sessions:', error);
    });
    
    return unsubscribe;
};

// Admin control: Update another user's play state
export const adminControlPlayState = async (userId, isPlaying) => {
    try {
        const sessionRef = doc(db, 'listeningSessions', userId);
        await updateDoc(sessionRef, {
            isPlaying,
            adminControlled: true,
            lastUpdated: serverTimestamp()
        });
    } catch (error) {
        console.error('Error controlling user play state:', error);
        throw error;
    }
};

// Admin control: Skip to next/previous song for a user
export const adminControlSkip = async (userId, direction) => {
    try {
        const sessionRef = doc(db, 'listeningSessions', userId);
        await updateDoc(sessionRef, {
            skipCommand: {
                direction, // 'next' or 'previous'
                timestamp: Date.now()
            },
            lastUpdated: serverTimestamp()
        });
    } catch (error) {
        console.error('Error sending skip command:', error);
        throw error;
    }
};

// Get all active sessions (one-time fetch)
export const getActiveSessions = async () => {
    try {
        const q = query(collection(db, 'listeningSessions'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error getting active sessions:', error);
        return [];
    }
};

// Subscribe to a specific user's listening session
export const subscribeToUserSession = (targetUserId, callback) => {
    const sessionRef = doc(db, 'listeningSessions', targetUserId);
    
    const unsubscribe = onSnapshot(sessionRef, (snapshot) => {
        if (snapshot.exists()) {
            callback({
                id: snapshot.id,
                ...snapshot.data()
            });
        } else {
            callback(null);
        }
    }, (error) => {
        console.error('Error subscribing to user session:', error);
        callback(null);
    });
    
    return unsubscribe;
};

// Update current playback time for syncing
export const updateCurrentTime = async (userId, currentTime) => {
    try {
        const sessionRef = doc(db, 'listeningSessions', userId);
        await updateDoc(sessionRef, {
            currentTime,
            lastUpdated: serverTimestamp()
        });
    } catch (error) {
        console.error('Error updating current time:', error);
    }
};
