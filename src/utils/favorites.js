/**
 * Utility functions for managing favorite songs using localStorage
 */

const FAVORITES_KEY = 'pumafy_favorites';

export const getFavorites = () => {
    try {
        const favorites = localStorage.getItem(FAVORITES_KEY);
        return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
        console.error('Error getting favorites:', error);
        return [];
    }
};

export const isFavorite = (songId) => {
    const favorites = getFavorites();
    return favorites.includes(songId);
};

export const toggleFavorite = (songId) => {
    const favorites = getFavorites();
    const index = favorites.indexOf(songId);
    
    if (index > -1) {
        // Remove from favorites
        favorites.splice(index, 1);
    } else {
        // Add to favorites
        favorites.push(songId);
    }
    
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    return index === -1; // Return true if added, false if removed
};

export const clearFavorites = () => {
    localStorage.removeItem(FAVORITES_KEY);
};
