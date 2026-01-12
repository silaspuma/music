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
        if (!song) return;
        setCurrentSong(song);
        setQueue([song]);
        setCurrentIndex(0);
        setIsPlaying(true);
    };

    const playQueue = (newQueue, startIndex = 0) => {
        if (!newQueue || newQueue.length === 0) return;
        const safeIndex = Math.min(Math.max(startIndex, 0), newQueue.length - 1);
        setQueue(newQueue);
        setCurrentIndex(safeIndex);
        setCurrentSong(newQueue[safeIndex]);
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
            setIsPlaying(false);
            audioRef.current.currentTime = 0;
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
