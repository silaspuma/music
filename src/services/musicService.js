import { db, storage } from '../firebase.config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';

export const uploadSong = async (file) => {
    try {
        // Extract title from filename
        const title = file.name.replace(/\.[^/.]+$/, "").replace(/-|_/g, " ");
        const artist = "Unknown Artist";
        const album = "Unknown Album";
        
        // Get duration by creating audio element
        let duration = 0;
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const arrayBuffer = await file.arrayBuffer();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            duration = audioBuffer.duration;
        } catch (e) {
            console.warn("Could not determine audio duration:", e);
            duration = 0;
        }

        // Upload audio file
        const storageRef = ref(storage, `songs/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(snapshot.ref);

        // Save to Firestore
        const songData = {
            title,
            artist,
            album,
            duration,
            url: downloadUrl,
            imageUrl: null,
            createdAt: new Date(),
            searchKeywords: [title, artist, album].map(s => s.toLowerCase())
        };

        const docRef = await addDoc(collection(db, "songs"), songData);
        console.log("Document written with ID: ", docRef.id);
        return { id: docRef.id, ...songData };

    } catch (error) {
        console.error("Error uploading song: ", error);
        throw error;
    }
};

export const getSongs = async () => {
    try {
        const q = query(collection(db, "songs"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error getting songs: ", error);
        if (error.code === 'permission-denied') {
            console.warn('Songs require proper Firestore permissions. Check your Firebase security rules.');
        }
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
}
