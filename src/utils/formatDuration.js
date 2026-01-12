/**
 * Format total duration in seconds to "X hr Y min" format
 * @param {number} totalSeconds - Total duration in seconds
 * @returns {string} Formatted duration string
 */
export const formatTotalDuration = (totalSeconds) => {
    const totalMinutes = Math.floor(totalSeconds / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    if (hours === 0) {
        return `${minutes} min`;
    }
    return `${hours} hr ${minutes} min`;
};
