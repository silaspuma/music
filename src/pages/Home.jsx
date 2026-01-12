import React, { useState, useEffect } from 'react';
import { getSongs } from '../services/musicService';
import { usePlayer } from '../contexts/PlayerContext';
import { Play } from 'lucide-react';

const Card = ({ song, index, onPlay }) => (
    <div
        className="bg-[#181818] p-4 rounded-[6px] hover:bg-[#282828] transition-all duration-300 group cursor-pointer relative"
        onClick={() => onPlay(song, index)}
    >
        <div className="relative mb-4 shadow-[0_8px_24px_rgba(0,0,0,0.5)] rounded-[6px] overflow-hidden">
            {song.imageUrl ? (
                <img src={song.imageUrl} alt={song.title} className="w-full aspect-square object-cover" />
            ) : (
                <div className="w-full aspect-square bg-[#333] flex items-center justify-center text-4xl text-gray-500 font-bold">♫</div>
            )}
            <button className="absolute bottom-2 right-2 bg-[#1ed760] rounded-full p-3 text-black shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:scale-105 hover:bg-[#3be477]">
                <Play fill="currentColor" size={24} className="ml-0.5" />
            </button>
        </div>
        <h3 className="font-bold text-white mb-2 truncate text-[16px]">{song.title}</h3>
        <p className="text-sm text-[#a7a7a7] truncate line-clamp-2">{song.artist}</p>
    </div>
);

const Home = () => {
    const [recentSongs, setRecentSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { playQueue } = usePlayer();

    useEffect(() => {
        const fetchRecent = async () => {
            const data = await getSongs();
            setRecentSongs(data.slice(0, 8)); // Top 8 recent
            setLoading(false);
        };
        fetchRecent();
    }, []);

    const greeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };

    return (
        <div className="relative pb-32 bg-[#121212] min-h-full rounded-lg overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute top-0 left-0 w-full h-[332px] bg-gradient-to-b from-[#222222] to-[#121212] z-0 pointer-events-none"></div>

            <div className="relative z-10 p-8">
                <h1 className="text-3xl font-bold mb-6 tracking-tight">{greeting()}</h1>

                {/* Recently Added Section */}
                <section className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold hover:underline cursor-pointer tracking-tight">Recently Added</h2>
                        <span className="text-xs font-bold text-[#b3b3b3] hover:underline cursor-pointer tracking-widest hover:text-white">SHOW ALL</span>
                    </div>

                    {loading ? (
                        <div className="text-gray-500">Loading...</div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {recentSongs.length > 0 ? recentSongs.map((song, index) => (
                                <Card key={song.id} song={song} index={index} onPlay={(_s, i) => playQueue(recentSongs, i)} />
                            )) : (
                                <div className="col-span-full py-12 text-gray-500 text-center bg-[#181818]/50 rounded-lg border border-dashed border-gray-700">
                                    No music uploaded yet. Go to Library to add some songs!
                                </div>
                            )}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default Home;
