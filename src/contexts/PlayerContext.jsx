import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const PlayerContext = createContext();

export function PlayerProvider({ children }) {
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1); // 0 to 1
    const [queue, setQueue] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const audioRef = useRef(new Audio());

    useEffect(() => {
        // Configure audio element
        audioRef.current.volume = volume;

        const handleEnded = () => {
            playNext();
        };

        audioRef.current.addEventListener('ended', handleEnded);
        return () => {
            audioRef.current.removeEventListener('ended', handleEnded);
        };
    }, []); // Run once on mount

    // Sync volume state with audio element
    useEffect(() => {
        audioRef.current.volume = volume;
    }, [volume]);

    // Handle song changes
    useEffect(() => {
        if (currentSong) {
            audioRef.current.src = currentSong.url;
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(e => console.error("Error playing audio:", e));
        } else {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    }, [currentSong]);

    // Handle play/pause toggle
    useEffect(() => {
        if (isPlaying) {
            if (audioRef.current.paused && currentSong) {
                audioRef.current.play().catch(e => console.error(e));
            }
        } else {
            if (!audioRef.current.paused) {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, currentSong]);

    const playSong = (song) => {
        // If clicking a new song, make a simple queue of 1 or handle context
        // For now, simpler implementation: just play the song, add to 1-item queue if not there?
        // Better: We usually pass the whole context (artist list, playlist) to playSong.
        // For MVP: Just play; we'll handle queue management separately.
        setCurrentSong(song);
        // If the song is already in the queue, find index. If not, replace queue or add?
        // Let's adopt a "Play logic": If playing from a list, set that list as queue.
        // For now, simpler:
        setQueue([song]);
        setCurrentIndex(0);
        setIsPlaying(true);
    };

    const playQueue = (newQueue, startIndex = 0) => {
        setQueue(newQueue);
        setCurrentIndex(startIndex);
        setCurrentSong(newQueue[startIndex]);
        setIsPlaying(true);
    };

    const togglePlay = () => {
        if (currentSong) {
            setIsPlaying(!isPlaying);
        }
    };

    const playNext = () => {
        if (queue.length > 0 && currentIndex < queue.length - 1) {
            const nextIndex = currentIndex + 1;
            setCurrentIndex(nextIndex);
            setCurrentSong(queue[nextIndex]);
            setIsPlaying(true);
        } else {
            // End of queue
            setIsPlaying(false);
        }
    };

    const playPrevious = () => {
        if (queue.length > 0 && currentIndex > 0) {
            const prevIndex = currentIndex - 1;
            setCurrentIndex(prevIndex);
            setCurrentSong(queue[prevIndex]);
            setIsPlaying(true);
        } else {
            // Restart song if at beginning?
            if (audioRef.current.currentTime > 3) {
                audioRef.current.currentTime = 0;
            }
        }
    };

    const seek = (time) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time;
        }
    }

    const value = {
        currentSong,
        isPlaying,
        volume,
        setVolume,
        togglePlay,
        playSong,
        playQueue,
        playNext,
        playPrevious,
        audioRef,
        seek
    };

    return (
        <PlayerContext.Provider value={value}>
            {children}
        </PlayerContext.Provider>
    );
}

export function usePlayer() {
    return useContext(PlayerContext);
}
