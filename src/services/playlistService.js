import { db } from '../firebase.config';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';

export const createPlaylist = async (name) => {
    try {
        const docRef = await addDoc(collection(db, "playlists"), {
            name,
            createdAt: new Date(),
            songs: []
        });
        return { id: docRef.id, name };
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
