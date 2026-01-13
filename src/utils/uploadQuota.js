import { doc, getDoc, updateDoc, increment, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase.config';

const DAILY_UPLOAD_LIMIT = 30;

export const checkUploadQuota = async (userId) => {
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        
        if (!userDoc.exists()) {
            throw new Error('User not found');
        }

        const userData = userDoc.data();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const lastUploadDate = userData.lastUploadDate?.toDate();
        const uploadedToday = userData.uploadedToday || 0;

        // Reset counter if it's a new day
        if (!lastUploadDate || lastUploadDate < today) {
            await updateDoc(doc(db, 'users', userId), {
                uploadedToday: 0,
                lastUploadDate: new Date()
            });
            return { canUpload: true, remaining: DAILY_UPLOAD_LIMIT, uploadedToday: 0 };
        }

        // Check if user has reached limit
        if (uploadedToday >= DAILY_UPLOAD_LIMIT) {
            return { canUpload: false, remaining: 0, uploadedToday };
        }

        return { 
            canUpload: true, 
            remaining: DAILY_UPLOAD_LIMIT - uploadedToday,
            uploadedToday 
        };
    } catch (error) {
        console.error('Error checking upload quota:', error);
        throw error;
    }
};

export const incrementUploadCount = async (userId, songId) => {
    try {
        await updateDoc(doc(db, 'users', userId), {
            uploadedToday: increment(1),
            lastUploadDate: new Date(),
            uploadedSongs: arrayUnion(songId)
        });
    } catch (error) {
        console.error('Error incrementing upload count:', error);
        throw error;
    }
};

export const getUploadStats = async (userId) => {
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        
        if (!userDoc.exists()) {
            return { uploadedToday: 0, remaining: DAILY_UPLOAD_LIMIT, totalUploads: 0 };
        }

        const userData = userDoc.data();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const lastUploadDate = userData.lastUploadDate?.toDate();
        let uploadedToday = userData.uploadedToday || 0;

        // Reset if new day
        if (!lastUploadDate || lastUploadDate < today) {
            uploadedToday = 0;
        }

        return {
            uploadedToday,
            remaining: DAILY_UPLOAD_LIMIT - uploadedToday,
            totalUploads: userData.uploadedSongs?.length || 0
        };
    } catch (error) {
        console.error('Error getting upload stats:', error);
        return { uploadedToday: 0, remaining: DAILY_UPLOAD_LIMIT, totalUploads: 0 };
    }
};
