import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { trackPlay } from '../services/musicService';
import { updateListeningSession, clearListeningSession, updatePlayState, subscribeToListeningSessions } from '../services/listeningSessionService';
import { useAuth } from './AuthContext';
import AuthModal from '../components/AuthModal';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase.config';

const PlayerContext = createContext();

export function PlayerProvider({ children }) {
    const { currentUser, userProfile } = useAuth();
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [queue, setQueue] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [isShuffle, setIsShuffle] = useState(false);
    const [repeatMode, setRepeatMode] = useState('off'); // 'off', 'one', 'all'
    const [originalQueue, setOriginalQueue] = useState([]);
    const [sleepTimer, setSleepTimer] = useState(null); // null or timestamp when to pause
    const [sleepTimerMinutes, setSleepTimerMinutes] = useState(0); // minutes remaining
    const [showAuthModal, setShowAuthModal] = useState(false);
    const audioRef = useRef(new Audio());
    const sleepTimerInterval = useRef(null);

    // Setup Media Session API for lock screen controls
    useEffect(() => {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.setActionHandler('play', () => {
                if (currentSong) setIsPlaying(true);
            });
            navigator.mediaSession.setActionHandler('pause', () => {
                setIsPlaying(false);
            });
            navigator.mediaSession.setActionHandler('nexttrack', () => {
                playNext();
            });
            navigator.mediaSession.setActionHandler('previoustrack', () => {
                playPrevious();
            });
        }
    }, []);

    // Update Media Session metadata when song changes
    useEffect(() => {
        if ('mediaSession' in navigator && currentSong) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: currentSong.title,
                artist: currentSong.artist,
                album: currentSong.album,
                artwork: currentSong.imageUrl
                    ? [
                        {
                            src: currentSong.imageUrl,
                            sizes: '512x512',
                            type: 'image/jpeg',
                        }
                    ]
                    : []
            });
            navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
        }
    }, [currentSong, isPlaying]);

    useEffect(() => {
        audioRef.current.volume = volume;

        const handleEnded = () => {
            if (repeatMode === 'one') {
                audioRef.current.currentTime = 0;
                audioRef.current.play();
            } else {
                // Play next song in queue
                if (queue.length > 0) {
                    if (currentIndex < queue.length - 1) {
                        const nextIndex = currentIndex + 1;
                        setCurrentIndex(nextIndex);
                        setCurrentSong(queue[nextIndex]);
                        setIsPlaying(true);
                    } else if (repeatMode === 'all') {
                        // Loop back to start
                        setCurrentIndex(0);
                        setCurrentSong(queue[0]);
                        setIsPlaying(true);
                    } else {
                        setIsPlaying(false);
                        audioRef.current.currentTime = 0;
                    }
                }
            }
        };

        audioRef.current.addEventListener('ended', handleEnded);
        return () => {
            audioRef.current.removeEventListener('ended', handleEnded);
        };
    }, [repeatMode, queue, currentIndex]);

    // Sync volume state with audio element
    useEffect(() => {
        audioRef.current.volume = volume;
    }, [volume]);

    // Sync current song to Firestore for listening sessions
    useEffect(() => {
        if (currentUser && userProfile) {
            if (currentSong && isPlaying) {
                updateListeningSession(currentUser.uid, userProfile.username, currentSong);
            } else if (!currentSong) {
                clearListeningSession(currentUser.uid);
            }
        }
    }, [currentSong, isPlaying, currentUser, userProfile]);

    // Sync play state to Firestore
    useEffect(() => {
        if (currentUser && currentSong) {
            updatePlayState(currentUser.uid, isPlaying);
        }
    }, [isPlaying, currentUser, currentSong]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (currentUser) {
                clearListeningSession(currentUser.uid);
            }
        };
    }, [currentUser]);

    // Listen for admin controls
    useEffect(() => {
        if (!currentUser) return;

        const sessionRef = doc(db, 'listeningSessions', currentUser.uid);
        const unsubscribe = onSnapshot(sessionRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.data();
                
                // Handle admin play/pause control
                if (data.adminControlled && data.isPlaying !== undefined) {
                    if (data.isPlaying !== isPlaying) {
                        setIsPlaying(data.isPlaying);
                    }
                }
                
                // Handle admin skip commands
                if (data.skipCommand) {
                    const { direction, timestamp } = data.skipCommand;
                    // Only process if this is a new command (within last 2 seconds)
                    if (Date.now() - timestamp < 2000) {
                        if (direction === 'next') {
                            playNext();
                        } else if (direction === 'previous') {
                            playPrevious();
                        }
                    }
                }
            }
        });

        return () => unsubscribe();
    }, [currentUser, isPlaying]);

    // Handle song changes
    useEffect(() => {
        if (currentSong) {
            audioRef.current.src = currentSong.url;
            audioRef.current.play()
                .then(() => {
                    setIsPlaying(true);
                    // Track play in Firebase
                    if (currentSong.id) {
                        trackPlay(currentSong.id);
                    }
                })
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
        // Require authentication to play songs
        if (!currentUser) {
            setShowAuthModal(true);
            return;
        }
        setCurrentSong(song);
        setQueue([song]);
        setCurrentIndex(0);
        setIsPlaying(true);
    };

    const playQueue = (newQueue, startIndex = 0) => {
        if (!newQueue || newQueue.length === 0) return;
        // Require authentication to play songs
        if (!currentUser) {
            setShowAuthModal(true);
            return;
        }
        const safeIndex = Math.min(Math.max(startIndex, 0), newQueue.length - 1);
        setOriginalQueue(newQueue);
        setQueue(newQueue);
        setCurrentIndex(safeIndex);
        setCurrentSong(newQueue[safeIndex]);
        setIsPlaying(true);
    };

    const toggleShuffle = () => {
        if (!isShuffle) {
            // Turn shuffle on
            if (queue.length > 1) {
                const currentSongData = currentSong;
                // Create shuffled queue, keeping current song at current position
                const otherSongs = queue.filter(s => s.id !== currentSongData?.id);
                const shuffled = [...otherSongs].sort(() => Math.random() - 0.5);
                
                // Insert current song at the beginning
                const newQueue = currentSongData ? [currentSongData, ...shuffled] : shuffled;
                setQueue(newQueue);
                setCurrentIndex(0);
            }
            setIsShuffle(true);
        } else {
            // Turn shuffle off - restore original queue
            if (originalQueue.length > 0) {
                const currentSongData = currentSong;
                const originalIndex = originalQueue.findIndex(s => s.id === currentSongData?.id);
                setQueue(originalQueue);
                setCurrentIndex(originalIndex >= 0 ? originalIndex : 0);
            }
            setIsShuffle(false);
        }
    };

    const togglePlay = () => {
        if (currentSong) {
            setIsPlaying(!isPlaying);
        }
    };

    const playNext = () => {
        if (queue.length > 0) {
            if (currentIndex < queue.length - 1) {
                const nextIndex = currentIndex + 1;
                setCurrentIndex(nextIndex);
                setCurrentSong(queue[nextIndex]);
                setIsPlaying(true);
            } else if (repeatMode === 'all') {
                // Loop back to start
                setCurrentIndex(0);
                setCurrentSong(queue[0]);
                setIsPlaying(true);
            } else {
                setIsPlaying(false);
                audioRef.current.currentTime = 0;
            }
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

    const toggleRepeat = () => {
        setRepeatMode(mode => {
            if (mode === 'off') return 'all';
            if (mode === 'all') return 'one';
            return 'off';
        });
    };

    const removeFromQueue = (index) => {
        const newQueue = queue.filter((_, i) => i !== index);
        setQueue(newQueue);
        if (index < currentIndex) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const clearQueue = () => {
        const current = currentSong ? [currentSong] : [];
        setQueue(current);
        setCurrentIndex(0);
    };

    const addToQueue = (song) => {
        setQueue([...queue, song]);
    };

    const playNextInQueue = (song) => {
        // Insert song right after current song
        if (currentSong) {
            const newQueue = [...queue];
            newQueue.splice(currentIndex + 1, 0, song);
            setQueue(newQueue);
            
            // Update original queue too if shuffle is on
            if (isShuffle && originalQueue.length > 0) {
                const newOriginalQueue = [...originalQueue];
                const originalCurrentIndex = originalQueue.findIndex(s => s.id === currentSong.id);
                if (originalCurrentIndex >= 0) {
                    newOriginalQueue.splice(originalCurrentIndex + 1, 0, song);
                    setOriginalQueue(newOriginalQueue);
                }
            }
        } else {
            // No current song, just add to queue and start playing
            setQueue([song]);
            setCurrentSong(song);
            setCurrentIndex(0);
            setIsPlaying(true);
        }
    };

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e) => {
            // Don't trigger if typing in an input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            switch(e.key) {
                case ' ':
                    e.preventDefault();
                    if (currentSong) togglePlay();
                    break;
                case 'ArrowRight':
                    if (e.shiftKey) {
                        // Seek forward 10s
                        audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 10, audioRef.current.duration);
                    } else {
                        playNext();
                    }
                    break;
                case 'ArrowLeft':
                    if (e.shiftKey) {
                        // Seek backward 10s
                        audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 10, 0);
                    } else {
                        playPrevious();
                    }
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    setVolume(Math.min(volume + 0.1, 1));
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    setVolume(Math.max(volume - 0.1, 0));
                    break;
                case 's':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                    } else {
                        toggleShuffle();
                    }
                    break;
                case 'r':
                    toggleRepeat();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [currentSong, isPlaying, volume]);

    // Sleep timer effect
    useEffect(() => {
        if (sleepTimer) {
            sleepTimerInterval.current = setInterval(() => {
                const now = Date.now();
                const remaining = Math.ceil((sleepTimer - now) / 1000 / 60);
                setSleepTimerMinutes(Math.max(0, remaining));

                if (now >= sleepTimer) {
                    setIsPlaying(false);
                    setSleepTimer(null);
                    setSleepTimerMinutes(0);
                    clearInterval(sleepTimerInterval.current);
                }
            }, 1000);

            return () => {
                if (sleepTimerInterval.current) {
                    clearInterval(sleepTimerInterval.current);
                }
            };
        } else {
            if (sleepTimerInterval.current) {
                clearInterval(sleepTimerInterval.current);
            }
            setSleepTimerMinutes(0);
        }
    }, [sleepTimer]);

    const setSleepTimerDuration = (minutes) => {
        if (minutes === 0) {
            setSleepTimer(null);
            setSleepTimerMinutes(0);
        } else {
            const endTime = Date.now() + (minutes * 60 * 1000);
            setSleepTimer(endTime);
            setSleepTimerMinutes(minutes);
        }
    };

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
        seek,
        isShuffle,
        toggleShuffle,
        repeatMode,
        toggleRepeat,
        queue,
        currentIndex,
        removeFromQueue,
        clearQueue,
        addToQueue,
        playNextInQueue,
        sleepTimer,
        sleepTimerMinutes,
        setSleepTimerDuration,
        showAuthModal,
        setShowAuthModal
    };

    return (
        <PlayerContext.Provider value={value}>
            {children}
            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
        </PlayerContext.Provider>
    );
}

export function usePlayer() {
    return useContext(PlayerContext);
}
