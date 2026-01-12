import { db, storage } from '../firebase.config';
import { collection, addDoc, getDocs, query, orderBy, updateDoc, doc, arrayUnion, arrayRemove, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const createPlaylist = async (name, description = '', coverFile = null) => {
    try {
        let coverUrl = null;
        
        // Upload cover image if provided
        if (coverFile) {
            const coverRef = ref(storage, `playlist-covers/${Date.now()}_${coverFile.name}`);
            const snapshot = await uploadBytes(coverRef, coverFile);
            coverUrl = await getDownloadURL(snapshot.ref);
        }
        
        const docRef = await addDoc(collection(db, "playlists"), {
            name,
            description,
            coverUrl,
            createdAt: new Date(),
            songs: []
        });
        return { id: docRef.id, name, description, coverUrl, songs: [] };
    } catch (error) {
        console.error("Error creating playlist: ", error);
        throw error;
    }
};

export const getPlaylists = async () => {
    try {
        const q = query(collection(db, "playlists"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching playlists: ", error);
        if (error.code === 'permission-denied') {
            console.warn('Playlists require proper Firestore permissions.');
        }
        throw error;
    }
};

export const addSongToPlaylist = async (playlistId, song) => {
    try {
        const playlistRef = doc(db, "playlists", playlistId);
        await updateDoc(playlistRef, {
            songs: arrayUnion(song)
        });
        console.log("Song added to playlist");
        return true;
    } catch (error) {
        console.error("Error adding song to playlist: ", error);
        throw error;
    }
};

export const removeSongFromPlaylist = async (playlistId, songId) => {
    try {
        const playlists = await getPlaylists();
        const playlist = playlists.find(p => p.id === playlistId);
        
        if (!playlist) throw new Error("Playlist not found");
        
        const songToRemove = playlist.songs.find(s => s.id === songId);
        if (!songToRemove) throw new Error("Song not in playlist");
        
        const playlistRef = doc(db, "playlists", playlistId);
        await updateDoc(playlistRef, {
            songs: arrayRemove(songToRemove)
        });
        console.log("Song removed from playlist");
        return true;
    } catch (error) {
        console.error("Error removing song from playlist: ", error);
        throw error;
    }
};

export const updatePlaylist = async (playlistId, updates) => {
    try {
        const playlistRef = doc(db, "playlists", playlistId);
        await updateDoc(playlistRef, updates);
        console.log("Playlist updated");
        return true;
    } catch (error) {
        console.error("Error updating playlist: ", error);
        throw error;
    }
};

export const deletePlaylist = async (playlistId) => {
    try {
        await deleteDoc(doc(db, "playlists", playlistId));
        console.log("Playlist deleted");
        return true;
    } catch (error) {
        console.error("Error deleting playlist: ", error);
        throw error;
    }
};

export const getPlaylistById = async (playlistId) => {
    try {
        const playlists = await getPlaylists();
        return playlists.find(p => p.id === playlistId);
    } catch (error) {
        console.error("Error getting playlist: ", error);
        throw error;
    }
};
