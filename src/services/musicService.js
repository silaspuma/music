import { db, storage } from '../firebase.config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import * as mm from 'music-metadata-browser';

export const uploadSong = async (file) => {
    try {
        // 1. Extract Metadata
        const metadata = await mm.parseBlob(file);
        const { common, format } = metadata;

        const title = common.title || file.name.replace(/\.[^/.]+$/, "");
        const artist = common.artist || "Unknown Artist";
        const album = common.album || "Unknown Album";
        const duration = format.duration || 0;

        // 2. Upload Audio File
        const storageRef = ref(storage, `songs/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(snapshot.ref);

        // 3. Upload Cover Art (if available)
        let coverUrl = null;
        if (common.picture && common.picture.length > 0) {
            const picture = common.picture[0];
            const coverRef = ref(storage, `covers/${Date.now()}_${artist}_${album}.jpg`);
            try {
                // Convert picture data to Uint8Array if it's a Buffer or other type
                const pictureData = picture.data instanceof Uint8Array 
                    ? picture.data 
                    : new Uint8Array(picture.data);
                const coverBlob = new Blob([pictureData], { type: picture.format });
                const coverSnapshot = await uploadBytes(coverRef, coverBlob);
                coverUrl = await getDownloadURL(coverSnapshot.ref);
            } catch (coverError) {
                console.warn("Failed to upload cover art:", coverError);
                // Continue without cover art
            }
        }

        // 4. Save to Firestore
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
