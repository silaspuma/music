import React, { useEffect, useState } from 'react';
import { getLikedSongs } from '../services/musicService';
import SongRow from '../components/SongRow';
import { usePlayer } from '../contexts/PlayerContext';
import { Clock3, Play, Heart } from 'lucide-react';

const LikedSongs = () => {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { playQueue } = usePlayer();

    const fetchLikedSongs = async () => {
        setLoading(true);
        const data = await getLikedSongs();
        setSongs(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchLikedSongs();
    }, []);

    const handlePlay = (_song, index) => {
        playQueue(songs, index);
    };

    const handlePlayAll = () => {
        if (songs.length > 0) {
            playQueue(songs, 0);
        }
    };

    const handleSongDeleted = () => {
        fetchLikedSongs();
    };

    return (
        <div className="relative pb-32 bg-[#121212] min-h-full rounded-lg overflow-hidden">
            {/* Header / Gradient */}
            <div className="relative h-[180px] sm:h-[240px] md:h-[280px] w-full bg-gradient-to-b from-[#5038a0] to-[#121212] flex flex-col sm:flex-row items-end p-4 sm:p-6 md:p-8 gap-4 sm:gap-6">
                <div className="relative z-10 h-[120px] sm:h-[160px] md:h-[192px] w-[120px] sm:w-[160px] md:w-[192px] shadow-[0_4px_60px_rgba(0,0,0,0.5)] flex items-center justify-center bg-gradient-to-br from-[#450af5] to-[#c4efd9] shrink-0 rounded-lg">
                    <Heart fill="#ffffff" stroke="none" size={80} />
                </div>

                <div className="relative z-10 flex flex-col gap-1 w-full overflow-hidden">
                    <span className="uppercase text-xs font-bold tracking-wider text-white">Playlist</span>
                    <h1 className="text-4xl sm:text-6xl md:text-[90px] font-black tracking-tighter text-white leading-tight mb-2 sm:mb-4 truncate">Liked Songs</h1>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold text-white">
                        <span className="cursor-pointer">User</span>
                        <span className="font-normal text-[#b3b3b3]">• {songs.length} songs</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10 px-4 sm:px-6 md:px-8 py-4 md:py-6">
                {/* Toolbar */}
                <div className="flex items-center gap-4 mb-6 md:mb-8">
                    <button
                        onClick={handlePlayAll}
                        disabled={songs.length === 0}
                        className="bg-[#1ed760] text-black rounded-full p-[14px] hover:scale-105 active:scale-100 transition-transform shadow-lg hover:bg-[#3be477] touch-active disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Play fill="currentColor" size={28} />
                    </button>
                </div>

                {/* Table Header - Hidden on mobile */}
                <div className="hidden sm:grid grid-cols-[16px_4fr_3fr_minmax(120px,1fr)] gap-4 px-4 py-2 border-b border-[#282828] text-[#a7a7a7] text-sm font-normal mb-4 sticky top-0 bg-[#121212] z-20">
                    <span className="w-5 text-center">#</span>
                    <span>Title</span>
                    <span>Album</span>
                    <div className="flex justify-end pr-8"><Clock3 size={16} /></div>
                </div>

                <div className="flex flex-col">
                    {loading ? (
                        <div className="text-center py-10 text-[#727272]">Loading...</div>
                    ) : songs.length === 0 ? (
                        <div className="text-center py-20 text-gray-500">
                            <div className="text-6xl mb-4">♥</div>
                            <h3 className="text-xl font-bold text-white">No liked songs yet</h3>
                            <p className="text-[#a7a7a7] mt-2">Heart your favorite songs to add them here.</p>
                        </div>
                    ) : (
                        songs.map((song, index) => (
                            <SongRow
                                key={song.id}
                                song={song}
                                index={index}
                                onPlay={handlePlay}
                                onDelete={handleSongDeleted}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default LikedSongs;
