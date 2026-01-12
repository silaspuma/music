import { db, storage } from '../firebase.config';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, addDoc, getDocs, query, orderBy, deleteDoc, doc, where, increment, updateDoc } from 'firebase/firestore';
import * as mm from 'music-metadata-browser';

export const uploadSong = async (file) => {
    try {
        console.log("Starting upload for file:", file.name);
        
        // Default values
        let title = file.name.replace(/\.[^/.]+$/, "");
        let artist = "Unknown Artist";
        let album = "Unknown Album";
        let duration = 0;
        let coverUrl = null;

        // Extract metadata
        console.log("Attempting to parse metadata...");
        const metadata = await mm.parseBlob(file);
        console.log("Raw metadata:", metadata);
        
        const { common, format } = metadata;
        console.log("Common metadata:", common);
        console.log("Format metadata:", format);
        
        // Extract title, artist, album
        title = common.title || title;
        artist = common.artist || artist;
        album = common.album || album;
        duration = format.duration || 0;
        
        console.log("Extracted metadata - Title:", title, "Artist:", artist, "Album:", album, "Duration:", duration);
        
        // Check for duplicates
        console.log("Checking for duplicates...");
        const allSongs = await getSongs();
        const duplicate = allSongs.find(
            song => song.title.toLowerCase() === title.toLowerCase() && 
                    song.artist.toLowerCase() === artist.toLowerCase()
        );
        
        if (duplicate) {
            console.warn("Duplicate song found:", duplicate);
            throw new Error(`Song "${title}" by ${artist} already exists in your library`);
        }
        
        // Extract cover art
        if (common.picture && common.picture.length > 0) {
            console.log("Found cover art, uploading...");
            const picture = common.picture[0];
            const coverRef = ref(storage, `covers/${Date.now()}_cover.jpg`);
            const coverBlob = new Blob([picture.data], { type: picture.format || 'image/jpeg' });
            const coverSnapshot = await uploadBytes(coverRef, coverBlob);
            coverUrl = await getDownloadURL(coverSnapshot.ref);
            console.log("Cover art uploaded successfully:", coverUrl);
        } else {
            console.log("No cover art found in metadata");
        }

        // Upload audio file
        console.log("Uploading audio file...");
        const storageRef = ref(storage, `songs/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(snapshot.ref);
        console.log("Audio file uploaded:", downloadUrl);

        // Save to Firestore
        const songData = {
            title,
            artist,
            album,
            duration,
            url: downloadUrl,
            imageUrl: coverUrl,
            createdAt: new Date(),
            searchKeywords: [title, artist, album].map(s => s.toLowerCase())
        };

        console.log("Saving to Firestore:", songData);
        const docRef = await addDoc(collection(db, "songs"), songData);
        console.log("✅ Song uploaded successfully with ID:", docRef.id);
        
        return { id: docRef.id, ...songData };

    } catch (error) {
        console.error("❌ Error uploading song:", error);
        throw error;
    }
};

export const getSongs = async () => {
    try {
        const q = query(collection(db, "songs"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const songs = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return { 
                id: doc.id, 
                title: data.title || "Unknown Title",
                artist: data.artist || "Unknown Artist", 
                album: data.album || "Unknown Album",
                duration: data.duration || 0,
                url: data.url || "",
                imageUrl: data.imageUrl || null,
                createdAt: data.createdAt,
                searchKeywords: data.searchKeywords || []
            };
        });
        console.log("Fetched songs with metadata:", songs);
        return songs;
    } catch (error) {
        console.error("Error getting songs: ", error);
        if (error.code === 'permission-denied') {
            console.warn('Songs require proper Firestore permissions. Check your Firebase security rules.');
        }
        throw error;
    }
};

export const deleteSong = async (songId, audioUrl, coverUrl) => {
    try {
        // Delete from Firestore
        await deleteDoc(doc(db, "songs", songId));
        
        // Delete audio file from storage
        if (audioUrl) {
            try {
                const audioRef = ref(storage, audioUrl);
                await deleteObject(audioRef);
            } catch (e) {
                console.warn("Could not delete audio file:", e);
            }
        }
        
        // Delete cover art from storage
        if (coverUrl) {
            try {
                const coverRef = ref(storage, coverUrl);
                await deleteObject(coverRef);
            } catch (e) {
                console.warn("Could not delete cover art:", e);
            }
        }
        
        console.log("Song deleted successfully");
    } catch (error) {
        console.error("Error deleting song: ", error);
        throw error;
    }
};

export const searchSongs = async (term) => {
    try {
        const allSongs = await getSongs();
        if (!term) return allSongs;
        const lowerTerm = term.toLowerCase();
        return allSongs.filter(song =>
            song.title.toLowerCase().includes(lowerTerm) ||
            song.artist.toLowerCase().includes(lowerTerm) ||
            song.album.toLowerCase().includes(lowerTerm)
        );
    } catch (error) {
        console.error("Error searching songs: ", error);
        return [];
    }
};

export const trackPlay = async (songId) => {
    try {
        const songRef = doc(db, "songs", songId);
        await updateDoc(songRef, {
            playCount: increment(1),
            lastPlayed: new Date()
        });
    } catch (error) {
        console.error("Error tracking play: ", error);
    }
};

export const getArtistStats = async (artistName) => {
    try {
        const q = query(collection(db, "songs"), where("artist", "==", artistName));
        const querySnapshot = await getDocs(q);
        
        let totalPlays = 0;
        const songs = querySnapshot.docs.map(doc => {
            const data = doc.data();
            totalPlays += data.playCount || 0;
            return { id: doc.id, ...data };
        });
        
        // Monthly listeners approximation (unique plays in last 30 days)
        // For simplicity, we'll use total plays / 10 as an estimate
        const monthlyListeners = Math.floor(totalPlays / 10) || songs.length * 42;
        
        return {
            totalPlays,
            monthlyListeners,
            songCount: songs.length
        };
    } catch (error) {
        console.error("Error getting artist stats: ", error);
        return { totalPlays: 0, monthlyListeners: 0, songCount: 0 };
    }
};

// Liked Songs
export const toggleLikeSong = async (songId) => {
    try {
        const likesRef = collection(db, "likedSongs");
        const q = query(likesRef, where("songId", "==", songId));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            // Like the song
            await addDoc(likesRef, {
                songId,
                likedAt: new Date()
            });
            return true;
        } else {
            // Unlike the song
            const likeDoc = querySnapshot.docs[0];
            await deleteDoc(doc(db, "likedSongs", likeDoc.id));
            return false;
        }
    } catch (error) {
        console.error("Error toggling like: ", error);
        throw error;
    }
};

export const isLiked = async (songId) => {
    try {
        const q = query(collection(db, "likedSongs"), where("songId", "==", songId));
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty;
    } catch (error) {
        console.error("Error checking if liked: ", error);
        return false;
    }
};

export const getLikedSongs = async () => {
    try {
        const q = query(collection(db, "likedSongs"), orderBy("likedAt", "desc"));
        const querySnapshot = await getDocs(q);
        const likedSongIds = querySnapshot.docs.map(doc => doc.data().songId);
        
        // Get all songs
        const allSongs = await getSongs();
        
        // Filter to only liked songs
        return allSongs.filter(song => likedSongIds.includes(song.id));
    } catch (error) {
        console.error("Error getting liked songs: ", error);
        return [];
    }
};
