import React, { useState, useEffect } from 'react';
import { getSongs } from '../services/musicService';
import { usePlayer } from '../contexts/PlayerContext';
import { Play, Music, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const AlbumCard = ({ album, onClick }) => (
    <Link
        to={`/album/${encodeURIComponent(album.name)}`}
        className="bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition-all duration-300 group cursor-pointer relative"
    >
        <div className="relative mb-4 shadow-[0_8px_24px_rgba(0,0,0,0.5)] rounded-lg overflow-hidden">
            {album.coverUrl ? (
                <img src={album.coverUrl} alt={album.name} className="w-full aspect-square object-cover" />
            ) : (
                <div className="w-full aspect-square bg-gradient-to-br from-[#ff6b1a] to-[#ff8c42] flex items-center justify-center">
                    <Music size={48} className="text-white" />
                </div>
            )}
            <button 
                onClick={(e) => {
                    e.preventDefault();
                    onClick();
                }}
                className="absolute bottom-2 right-2 bg-[#ff6b1a] rounded-full p-3 text-white shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:scale-105 hover:bg-[#ff8c42]"
            >
                <Play fill="currentColor" size={20} className="ml-0.5" />
            </button>
        </div>
        <h3 className="font-bold text-white mb-2 truncate text-base">{album.name}</h3>
        <p className="text-sm text-[#a7a7a7] truncate">{album.artist}</p>
    </Link>
);

const ArtistCard = ({ artist }) => (
    <Link
        to={`/artist/${encodeURIComponent(artist.name)}`}
        className="bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition-all duration-300 cursor-pointer group"
    >
        <div className="relative mb-4 shadow-[0_8px_24px_rgba(0,0,0,0.5)] rounded-full overflow-hidden aspect-square">
            {artist.coverUrl ? (
                <img src={artist.coverUrl} alt={artist.name} className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                    <Users size={48} className="text-white" />
                </div>
            )}
        </div>
        <h3 className="font-bold text-white truncate text-base text-center">{artist.name}</h3>
        <p className="text-xs text-[#a7a7a7] text-center mt-1">Artist</p>
    </Link>
);

const Home = () => {
    const [recentAlbums, setRecentAlbums] = useState([]);
    const [trendingArtists, setTrendingArtists] = useState([]);
    const [allSongs, setAllSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { playQueue } = usePlayer();

    useEffect(() => {
        const fetchData = async () => {
            const songs = await getSongs();
            setAllSongs(songs);
            
            // Get unique albums with their newest upload date
            const albumMap = new Map();
            songs.forEach(song => {
                const key = `${song.album}-${song.artist}`;
                if (!albumMap.has(key)) {
                    albumMap.set(key, {
                        name: song.album,
                        artist: song.artist,
                        coverUrl: song.coverUrl,
                        uploadedAt: song.uploadedAt || new Date(),
                        songs: [song]
                    });
                } else {
                    albumMap.get(key).songs.push(song);
                }
            });
            
            // Sort by upload date and take top 5
            const sortedAlbums = Array.from(albumMap.values())
                .sort((a, b) => {
                    const dateA = a.uploadedAt?.toDate ? a.uploadedAt.toDate() : a.uploadedAt;
                    const dateB = b.uploadedAt?.toDate ? b.uploadedAt.toDate() : b.uploadedAt;
                    return dateB - dateA;
                })
                .slice(0, 5);
            
            setRecentAlbums(sortedAlbums);
            
            // Get top 5 artists by play count
            const artistMap = new Map();
            songs.forEach(song => {
                if (!artistMap.has(song.artist)) {
                    artistMap.set(song.artist, {
                        name: song.artist,
                        coverUrl: song.coverUrl,
                        playCount: song.playCount || 0
                    });
                } else {
                    artistMap.get(song.artist).playCount += (song.playCount || 0);
                }
            });
            
            const topArtists = Array.from(artistMap.values())
                .sort((a, b) => b.playCount - a.playCount)
                .slice(0, 5);
            
            setTrendingArtists(topArtists);
            setLoading(false);
        };
        fetchData();
    }, []);

    const handlePlayAlbum = (album) => {
        if (album.songs && album.songs.length > 0) {
            playQueue(album.songs, 0);
        }
    };

    const greeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };

    return (
        <div className="relative pb-32 bg-[#121212] min-h-full rounded-lg overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute top-0 left-0 w-full h-[340px] bg-gradient-to-b from-[#1a1a1a] to-[#121212] z-0 pointer-events-none"></div>

            <div className="relative z-10 p-6 md:p-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">{greeting()}</h1>
                <p className="text-sm text-[#b3b3b3] mb-8">Welcome to Pumafy - Your school-wide music service 🐆</p>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-[#a7a7a7]">Loading your music...</div>
                    </div>
                ) : (
                    <>
                        {/* Trending Artists Section */}
                        {trendingArtists.length > 0 && (
                            <section className="mb-10">
                                <div className="flex items-center mb-5">
                                    <h2 className="text-xl md:text-2xl font-bold tracking-tight">Trending Artists</h2>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                    {trendingArtists.map((artist) => (
                                        <ArtistCard key={artist.name} artist={artist} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Recently Added Albums Section */}
                        <section className="mb-10">
                            <div className="flex items-center mb-5">
                                <h2 className="text-xl md:text-2xl font-bold tracking-tight">Recently Added Albums</h2>
                            </div>
                            {recentAlbums.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                    {recentAlbums.map((album) => (
                                        <AlbumCard 
                                            key={`${album.name}-${album.artist}`} 
                                            album={album}
                                            onClick={() => handlePlayAlbum(album)}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center bg-[#181818] rounded-lg border-2 border-dashed border-[#282828]">
                                    <Music size={48} className="mx-auto mb-4 text-[#535353]" />
                                    <p className="text-[#a7a7a7] mb-2">No albums yet</p>
                                    <p className="text-sm text-[#535353]">Upload some music to get started</p>
                                </div>
                            )}
                        </section>
                    </>
                )}
            </div>
        </div>
    );
};

export default Home;
