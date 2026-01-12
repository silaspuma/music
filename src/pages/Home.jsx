import React, { useState, useEffect } from 'react';
import { getSongs } from '../services/musicService';
import { usePlayer } from '../contexts/PlayerContext';
import { Play } from 'lucide-react';

const Card = ({ song, onPlay }) => (
    <div
        className="bg-[#181818] p-4 rounded-md hover:bg-[#282828] transition-colors group cursor-pointer"
        onClick={() => onPlay(song)}
    >
        <div className="relative mb-4">
            {song.imageUrl ? (
                <img src={song.imageUrl} alt={song.title} className="w-full aspect-square object-cover rounded-md shadow-lg" />
            ) : (
                <div className="w-full aspect-square bg-[#333] rounded-md shadow-lg flex items-center justify-center text-4xl text-gray-500 font-bold">♫</div>
            )}
            <button className="absolute bottom-2 right-2 bg-green-500 rounded-full p-3 text-black shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                <Play fill="currentColor" size={20} />
            </button>
        </div>
        <h3 className="font-bold text-white mb-1 truncate">{song.title}</h3>
        <p className="text-sm text-gray-400 truncate">{song.artist}</p>
    </div>
);

const Home = () => {
    const [recentSongs, setRecentSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { playSong } = usePlayer();

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
        <div className="p-8 pb-32">
            <h1 className="text-3xl font-bold mb-6">{greeting()}</h1>

            {/* Recently Added Section */}
            <section className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold hover:underline cursor-pointer">Recently Added</h2>
                    <span className="text-xs font-bold text-gray-400 hover:underline cursor-pointer tracking-wider">SHOW ALL</span>
                </div>

                {loading ? (
                    <div className="text-gray-500">Loading...</div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {recentSongs.map(song => (
                            <Card key={song.id} song={song} onPlay={playSong} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
