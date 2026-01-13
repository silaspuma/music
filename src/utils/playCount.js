import { doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { db } from '../firebase.config';

/**
 * Increment the play count for a song
 * @param {string} songId - The ID of the song to increment
 */
export const incrementPlayCount = async (songId) => {
    try {
        const songRef = doc(db, 'songs', songId);
        await updateDoc(songRef, {
            playCount: increment(1)
        });
    } catch (error) {
        console.error('Error incrementing play count:', error);
    }
};

/**
 * Get play count for a specific song
 * @param {string} songId - The ID of the song
 * @returns {Promise<number>} The play count
 */
export const getPlayCount = async (songId) => {
    try {
        const songRef = doc(db, 'songs', songId);
        const songSnap = await getDoc(songRef);
        
        if (songSnap.exists()) {
            return songSnap.data().playCount || 0;
        }
        return 0;
    } catch (error) {
        console.error('Error getting play count:', error);
        return 0;
    }
};

/**
 * Get total plays for an artist
 * @param {Array} songs - Array of song objects for the artist
 * @returns {number} Total play count
 */
export const getArtistTotalPlays = (songs) => {
    return songs.reduce((total, song) => total + (song.playCount || 0), 0);
};

/**
 * Get trending songs (sorted by play count)
 * @param {Array} songs - Array of all songs
 * @param {number} limit - Number of songs to return (default 10)
 * @returns {Array} Top songs by play count
 */
export const getTrendingSongs = (songs, limit = 10) => {
    return [...songs]
        .sort((a, b) => (b.playCount || 0) - (a.playCount || 0))
        .slice(0, limit);
};

/**
 * Get top artists by total plays
 * @param {Array} songs - Array of all songs
 * @param {number} limit - Number of artists to return (default 10)
 * @returns {Array} Top artists with their total plays
 */
export const getTopArtists = (songs, limit = 10) => {
    const artistMap = new Map();
    
    songs.forEach(song => {
        if (!artistMap.has(song.artist)) {
            artistMap.set(song.artist, {
                name: song.artist,
                imageUrl: song.imageUrl,
                totalPlays: song.playCount || 0,
                songCount: 1
            });
        } else {
            const artist = artistMap.get(song.artist);
            artist.totalPlays += (song.playCount || 0);
            artist.songCount += 1;
        }
    });
    
    return Array.from(artistMap.values())
        .sort((a, b) => b.totalPlays - a.totalPlays)
        .slice(0, limit);
};

/**
 * Format play count for display (1,234 or 1.2K or 1.2M)
 * @param {number} count - The play count
 * @returns {string} Formatted string
 */
export const formatPlayCount = (count) => {
    if (!count || count === 0) return '0';
    if (count < 1000) return count.toLocaleString();
    if (count < 1000000) return `${(count / 1000).toFixed(1)}K`;
    return `${(count / 1000000).toFixed(1)}M`;
};
