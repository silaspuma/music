import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { getRecentlyPlayed } from '../services/musicService';
import SongRow from '../components/SongRow';
import { usePlayer } from '../contexts/PlayerContext';

const RecentlyPlayed = () => {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { playQueue } = usePlayer();

    useEffect(() => {
        loadRecentlyPlayed();
    }, []);

    const loadRecentlyPlayed = async () => {
        try {
            const recentSongs = await getRecentlyPlayed();
            setSongs(recentSongs);
        } catch (error) {
            console.error("Error loading recently played:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePlayAll = () => {
        if (songs.length > 0) {
            playQueue(songs, 0);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#4d4d4d] to-[#121212] pb-32">
            <div className="p-8">
                {/* Header */}
                <div className="flex items-end gap-6 mb-6">
                    <div className="w-56 h-56 bg-gradient-to-br from-blue-600 to-blue-800 rounded-md shadow-2xl flex items-center justify-center">
                        <Clock size={96} className="text-white/80" />
                    </div>
                    <div className="flex flex-col justify-end pb-2">
                        <p className="text-sm font-bold">PLAYLIST</p>
                        <h1 className="text-7xl font-black my-4">Recently Played</h1>
                        <p className="text-sm text-[#b3b3b3] mt-2">
                            Your recent listening history
                        </p>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4 my-6">
                    <button 
                        onClick={handlePlayAll}
                        disabled={songs.length === 0}
                        className="bg-[#1ed760] hover:bg-[#1fdf64] hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold rounded-full w-14 h-14 flex items-center justify-center"
                    >
                        ▶
                    </button>
                </div>

                {/* Song List */}
                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-[#b3b3b3]">Loading...</p>
                    </div>
                ) : songs.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-[#b3b3b3]">No recently played songs yet</p>
                        <p className="text-sm text-[#b3b3b3] mt-2">Start listening to see your history here</p>
                    </div>
                ) : (
                    <div className="mt-4">
                        {songs.map((song, index) => (
                            <SongRow 
                                key={`${song.id}-${index}`} 
                                song={song} 
                                index={index}
                                onDelete={loadRecentlyPlayed}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecentlyPlayed;
