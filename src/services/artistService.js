import { collection, doc, setDoc, getDoc, getDocs, query, orderBy, updateDoc } from 'firebase/firestore';
import { db } from '../firebase.config';

/**
 * Get or create an artist document
 * @param {string} artistName - The artist name
 * @returns {Promise<Object>} The artist document data
 */
export const getOrCreateArtist = async (artistName) => {
    try {
        const artistId = artistName.toLowerCase().replace(/\s+/g, '-');
        const artistRef = doc(db, 'artists', artistId);
        const artistDoc = await getDoc(artistRef);
        
        if (artistDoc.exists()) {
            return { id: artistDoc.id, ...artistDoc.data() };
        } else {
            // Create new artist document
            const newArtist = {
                name: artistName,
                verified: false,
                createdAt: new Date(),
                totalPlays: 0,
                songCount: 0
            };
            await setDoc(artistRef, newArtist);
            return { id: artistId, ...newArtist };
        }
    } catch (error) {
        console.error('Error getting/creating artist:', error);
        return { name: artistName, verified: false };
    }
};

/**
 * Get all artists from Firestore
 * @returns {Promise<Array>} Array of artist objects
 */
export const getAllArtists = async () => {
    try {
        const artistsRef = collection(db, 'artists');
        const q = query(artistsRef, orderBy('name', 'asc'));
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error getting artists:', error);
        return [];
    }
};

/**
 * Verify or unverify an artist
 * @param {string} artistId - The artist document ID
 * @param {boolean} verified - Whether to verify or unverify
 */
export const setArtistVerification = async (artistId, verified) => {
    try {
        const artistRef = doc(db, 'artists', artistId);
        await updateDoc(artistRef, {
            verified: verified,
            verifiedAt: verified ? new Date() : null
        });
    } catch (error) {
        console.error('Error setting artist verification:', error);
        throw error;
    }
};

/**
 * Update artist stats (song count and total plays)
 * @param {string} artistName - The artist name
 * @param {number} songCount - Number of songs
 * @param {number} totalPlays - Total play count
 */
export const updateArtistStats = async (artistName, songCount, totalPlays) => {
    try {
        const artistId = artistName.toLowerCase().replace(/\s+/g, '-');
        const artistRef = doc(db, 'artists', artistId);
        
        await updateDoc(artistRef, {
            songCount,
            totalPlays,
            lastUpdated: new Date()
        });
    } catch (error) {
        console.error('Error updating artist stats:', error);
    }
};

/**
 * Check if an artist is verified
 * @param {string} artistName - The artist name
 * @returns {Promise<boolean>} Whether the artist is verified
 */
export const isArtistVerified = async (artistName) => {
    try {
        const artistId = artistName.toLowerCase().replace(/\s+/g, '-');
        const artistRef = doc(db, 'artists', artistId);
        const artistDoc = await getDoc(artistRef);
        
        if (artistDoc.exists()) {
            return artistDoc.data().verified || false;
        }
        return false;
    } catch (error) {
        console.error('Error checking artist verification:', error);
        return false;
    }
};

/**
 * Update artist profile information
 * @param {string} artistId - The artist document ID
 * @param {Object} profileData - Profile data to update
 */
export const updateArtistProfile = async (artistId, profileData) => {
    try {
        const artistRef = doc(db, 'artists', artistId);
        await updateDoc(artistRef, {
            ...profileData,
            lastUpdated: new Date()
        });
    } catch (error) {
        console.error('Error updating artist profile:', error);
        throw error;
    }
};
