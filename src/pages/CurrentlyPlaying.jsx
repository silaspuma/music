import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePlayer } from '../contexts/PlayerContext';
import { subscribeToListeningSessions, adminControlPlayState, adminControlSkip } from '../services/listeningSessionService';
import { Play, Pause, SkipForward, SkipBack, Music2, Users, Headphones, StopCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CurrentlyPlaying = () => {
    const { currentUser, isAdmin } = useAuth();
    const { startListeningIn, stopListeningIn, listeningToUserId } = usePlayer();
    const navigate = useNavigate();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Redirect if not logged in
        if (!currentUser) {
            navigate('/');
            return;
        }

        // Subscribe to all listening sessions
        const unsubscribe = subscribeToListeningSessions((activeSessions) => {
            setSessions(activeSessions);
            setLoading(false);
        });

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [currentUser, navigate]);

    const handlePlayPause = async (userId, currentPlayState) => {
        try {
            await adminControlPlayState(userId, !currentPlayState);
        } catch (error) {
            console.error('Error controlling playback:', error);
            alert('Failed to control playback');
        }
    };

    const handleSkip = async (userId, direction) => {
        try {
            await adminControlSkip(userId, direction);
        } catch (error) {
            console.error('Error skipping:', error);
            alert('Failed to skip track');
        }
    };

    if (!currentUser) {
        return null;
    }

    if (loading) {
        return (
            <div className="p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-gradient-to-br from-[#ff6b1a] to-[#ff8c42] p-3 rounded-lg">
                        <Users size={32} className="text-white" />
                    </div>
                    <h1 className="text-4xl font-bold">Currently Playing</h1>
                </div>
                <p className="text-[#b3b3b3]">Loading active sessions...</p>
            </div>
        );
    }

    const activeSessions = sessions.filter(s => s.currentSong && s.userId !== currentUser.uid);

    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-[#ff6b1a] to-[#ff8c42] p-3 rounded-lg shadow-lg">
                    <Users size={32} className="text-white" />
                </div>
                <div>
                    <h1 className="text-4xl font-bold">Currently Playing</h1>
                    <p className="text-[#b3b3b3] mt-1">
                        {activeSessions.length} {activeSessions.length === 1 ? 'user' : 'users'} listening now
                    </p>
                </div>
            </div>

            {/* Active Sessions */}
            {activeSessions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="bg-[#282828] p-6 rounded-full mb-4">
                        <Music2 size={48} className="text-[#b3b3b3]" />
                    </div>
                    <h2 className="text-xl font-bold mb-2">No Active Listeners</h2>
                    <p className="text-[#b3b3b3] max-w-md">
                        {isAdmin() 
                            ? "When users start playing music, they'll appear here and you can control their playback."
                            : "When other users start playing music, they'll appear here and you can listen along with them."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeSessions.map((session) => (
                        <div
                            key={session.userId}
                            className="bg-[#181818] rounded-lg p-4 hover:bg-[#282828] transition-colors"
                        >
                            {/* User Info */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center font-bold text-white flex-shrink-0">
                                    {session.username?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-white truncate">
                                        {session.username || 'Unknown User'}
                                    </p>
                                    <p className="text-xs text-[#b3b3b3]">
                                        {session.isPlaying ? 'Playing' : 'Paused'}
                                    </p>
                                </div>
                            </div>

                            {/* Currently Playing Song */}
                            {session.currentSong && (
                                <div className="mb-4">
                                    <div className="flex gap-3">
                                        {session.currentSong.imageUrl ? (
                                            <img
                                                src={session.currentSong.imageUrl}
                                                alt={session.currentSong.title}
                                                className="h-16 w-16 rounded-md object-cover shadow-lg flex-shrink-0"
                                            />
                                        ) : (
                                            <div className="h-16 w-16 bg-[#282828] flex items-center justify-center rounded-md flex-shrink-0">
                                                <Music2 size={24} className="text-[#b3b3b3]" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-white truncate mb-1">
                                                {session.currentSong.title}
                                            </p>
                                            <p className="text-xs text-[#b3b3b3] truncate">
                                                {session.currentSong.artist}
                                            </p>
                                            <p className="text-xs text-[#b3b3b3] truncate">
                                                {session.currentSong.album}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Controls: Admin controls or Listen In button */}
                            {isAdmin() ? (
                                <>
                                    <div className="flex items-center justify-center gap-4 pt-3 border-t border-[#282828]">
                                        <button
                                            onClick={() => handleSkip(session.userId, 'previous')}
                                            className="text-[#b3b3b3] hover:text-white transition-colors p-2"
                                            title="Previous track"
                                        >
                                            <SkipBack size={20} />
                                        </button>
                                        <button
                                            onClick={() => handlePlayPause(session.userId, session.isPlaying)}
                                            className="bg-white rounded-full p-3 text-black hover:scale-105 transition-transform"
                                            title={session.isPlaying ? 'Pause' : 'Play'}
                                        >
                                            {session.isPlaying ? (
                                                <Pause size={20} fill="currentColor" />
                                            ) : (
                                                <Play size={20} fill="currentColor" />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleSkip(session.userId, 'next')}
                                            className="text-[#b3b3b3] hover:text-white transition-colors p-2"
                                            title="Next track"
                                        >
                                            <SkipForward size={20} />
                                        </button>
                                    </div>

                                    {session.adminControlled && (
                                        <p className="text-xs text-[#ff6b1a] text-center mt-2">
                                            Admin controlled
                                        </p>
                                    )}
                                </>
                            ) : (
                                <div className="pt-3 border-t border-[#282828]">
                                    {listeningToUserId === session.userId ? (
                                        <button
                                            onClick={() => stopListeningIn()}
                                            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                                        >
                                            <StopCircle size={20} />
                                            Stop Listening In
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => startListeningIn(session.userId)}
                                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-br from-[#ff6b1a] to-[#ff8c42] hover:from-[#ff7b2a] hover:to-[#ff9c52] text-white font-semibold py-3 px-4 rounded-lg transition-all hover:scale-[1.02]"
                                        >
                                            <Headphones size={20} />
                                            Listen In
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CurrentlyPlaying;
