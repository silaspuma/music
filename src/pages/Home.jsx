import React, { useState, useEffect } from 'react';
import { getSongs } from '../services/musicService';
import { usePlayer } from '../contexts/PlayerContext';
import { Play, Clock, User, Disc3 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
    const [recentUploads, setRecentUploads] = useState([]);
    const [loading, setLoading] = useState(true);
    const { playQueue, setCurrentSongIndex } = usePlayer();

    useEffect(() => {
        const fetchData = async () => {
            const songs = await getSongs();
            
            // Sort by upload date and take top 50 most recent
            const sorted = songs
                .sort((a, b) => {
                    const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : a.createdAt || new Date(0);
                    const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : b.createdAt || new Date(0);
                    return dateB - dateA;
                })
                .slice(0, 50);
            
            setRecentUploads(sorted);
            setLoading(false);
        };
        fetchData();
    }, []);

    const formatTimeAgo = (timestamp) => {
        if (!timestamp) return 'Recently';
        const date = timestamp.toDate ? timestamp.toDate() : timestamp;
        const seconds = Math.floor((new Date() - date) / 1000);
        
        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
        return `${Math.floor(seconds / 604800)}w ago`;
    };

    const handlePlay = (song) => {
        const index = recentUploads.findIndex(s => s.id === song.id);
        playQueue(recentUploads, index);
    };

    return (
        <div className="relative pb-32 bg-[#121212] min-h-full rounded-lg overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute top-0 left-0 w-full h-[340px] bg-gradient-to-b from-[#1ed760]/10 to-[#121212] z-0 pointer-events-none"></div>

            <div className="relative z-10 p-6 md:p-8">
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">Stream</h1>
                    <p className="text-sm text-[#b3b3b3]">Discover new music from the community</p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-[#a7a7a7]">Loading stream...</div>
                    </div>
                ) : recentUploads.length === 0 ? (
                    <div className="py-12 text-center bg-[#181818] rounded-lg border-2 border-dashed border-[#282828]">
                        <Disc3 size={48} className="mx-auto mb-4 text-[#535353]" />
                        <p className="text-[#a7a7a7] mb-2">No uploads yet</p>
                        <p className="text-sm text-[#535353]">Be the first to upload music!</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {recentUploads.map((song) => (
                            <div
                                key={song.id}
                                className="group flex items-center gap-4 p-3 bg-[#181818] hover:bg-[#282828] rounded-lg transition-all cursor-pointer"
                                onClick={() => handlePlay(song)}
                            >
                                {/* Album Cover */}
                                <div className="relative flex-shrink-0 w-14 h-14 bg-[#282828] rounded overflow-hidden">
                                    {song.imageUrl ? (
                                        <img src={song.imageUrl} alt={song.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Disc3 size={24} className="text-[#535353]" />
                                        </div>
                                    )}
                                    {/* Play Button Overlay */}
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="bg-[#1ed760] rounded-full p-2">
                                            <Play size={16} fill="black" className="text-black" />
                                        </div>
                                    </div>
                                </div>

                                {/* Song Info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-white truncate">{song.title}</h3>
                                    <div className="flex items-center gap-2 text-sm text-[#b3b3b3]">
                                        <Link 
                                            to={`/artist/${encodeURIComponent(song.artist)}`}
                                            className="hover:underline truncate"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {song.artist}
                                        </Link>
                                        <span>•</span>
                                        {song.uploaderUsername && (
                                            <>
                                                <span className="flex items-center gap-1 truncate">
                                                    <User size={12} />
                                                    <Link
                                                        to={`/user/${encodeURIComponent(song.uploaderUsername)}`}
                                                        className="hover:underline"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        {song.uploaderUsername}
                                                    </Link>
                                                </span>
                                                <span>•</span>
                                            </>
                                        )}
                                        <span className="flex items-center gap-1">
                                            <Clock size={12} />
                                            {formatTimeAgo(song.createdAt)}
                                        </span>
                                    </div>
                                </div>

                                {/* Album & Duration */}
                                <div className="hidden md:flex items-center gap-8 text-sm text-[#b3b3b3]">
                                    <span className="w-32 truncate">{song.album}</span>
                                    <span className="w-12 text-right">{song.duration}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
