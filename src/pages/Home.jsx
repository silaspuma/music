import React, { useState, useEffect } from 'react';
import { getSongs } from '../services/musicService';
import { getPlaylists } from '../services/playlistService';
import { usePlayer } from '../contexts/PlayerContext';
import { Play, Music, Users } from 'lucide-react';

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
            <button className="absolute bottom-2 right-2 bg-[#1ed760] rounded-full p-2 text-black shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:scale-105 hover:bg-[#3be477]">
                <Play fill="currentColor" size={16} className="ml-0.5" />
            </button>
        </div>
        <h3 className="font-bold text-white mb-2 truncate text-[16px]">{song.title}</h3>
        <p className="text-sm text-[#a7a7a7] truncate line-clamp-2">{song.artist}</p>
    </div>
);

const Home = () => {
    const [recentSongs, setRecentSongs] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [trendingArtists, setTrendingArtists] = useState([]);
    const [loading, setLoading] = useState(true);
    const { playQueue } = usePlayer();

    useEffect(() => {
        const fetchData = async () => {
            const songs = await getSongs();
            setRecentSongs(songs.slice(0, 8));
            
            const playlistData = await getPlaylists();
            setPlaylists(playlistData.slice(0, 5));
            
            // Get trending artists (count plays by artist)
            const artistCounts = {};
            songs.forEach(song => {
                artistCounts[song.artist] = (artistCounts[song.artist] || 0) + (song.playCount || 0);
            });
            const topArtists = Object.entries(artistCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([artist, _]) => ({ artist, count: artistCounts[artist] }));
            setTrendingArtists(topArtists);
            
            setLoading(false);
        };
        fetchData();
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

            <div className="relative z-10 p-4 sm:p-6 md:p-8">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2 tracking-tight">{greeting()}</h1>
                <p className="text-sm text-[#b3b3b3] mb-6">Welcome to Pumafy - Your community music library, accessible anywhere 🐆</p>

                {/* Recently Added Section */}
                <section className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold hover:underline cursor-pointer tracking-tight">Recently Added</h2>
                        <span className="text-xs font-bold text-[#b3b3b3] hover:underline cursor-pointer tracking-widest hover:text-white">SHOW ALL</span>
                    </div>

                    {loading ? (
                        <div className="text-gray-500">Loading...</div>
                    ) : (
                        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
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

                {/* Trending Artists Section */}
                {trendingArtists.length > 0 && (
                    <section className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold hover:underline cursor-pointer tracking-tight flex items-center gap-2"><Users size={28} />Trending Artists</h2>
                            <span className="text-xs font-bold text-[#b3b3b3] hover:underline cursor-pointer tracking-widest hover:text-white">SHOW ALL</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                            {trendingArtists.map((artist) => (
                                <div key={artist.artist} className="bg-[#181818] p-4 rounded-[6px] hover:bg-[#282828] transition-all duration-300 cursor-pointer text-center">
                                    <div className="w-full aspect-square bg-gradient-to-br from-purple-600 to-pink-600 rounded-[6px] flex items-center justify-center mb-4">
                                        <Users size={32} className="text-white" />
                                    </div>
                                    <h3 className="font-bold text-white truncate text-[14px]">{artist.artist}</h3>
                                    <p className="text-xs text-[#a7a7a7] mt-1">{artist.count} plays</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Your Playlists Section */}
                {playlists.length > 0 && (
                    <section className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold hover:underline cursor-pointer tracking-tight flex items-center gap-2"><Music size={28} />Your Playlists</h2>
                            <span className="text-xs font-bold text-[#b3b3b3] hover:underline cursor-pointer tracking-widest hover:text-white">SHOW ALL</span>
                        </div>
                        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                            {playlists.map((playlist) => (
                                <div key={playlist.id} className="bg-[#181818] p-4 rounded-[6px] hover:bg-[#282828] transition-all duration-300 group cursor-pointer relative">
                                    <div className="relative mb-4 shadow-[0_8px_24px_rgba(0,0,0,0.5)] rounded-[6px] overflow-hidden">
                                        {playlist.coverUrl ? (
                                            <img src={playlist.coverUrl} alt={playlist.name} className="w-full aspect-square object-cover" />
                                        ) : (
                                            <div className="w-full aspect-square bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                                                <Music size={32} className="text-white" />
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="font-bold text-white truncate text-[14px]">{playlist.name}</h3>
                                    <p className="text-xs text-[#a7a7a7] truncate line-clamp-1">{playlist.description || 'No description'}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default Home;
