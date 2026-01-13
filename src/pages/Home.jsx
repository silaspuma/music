import React, { useState, useEffect } from 'react';
import { getSongs } from '../services/musicService';
import { getPlaylists } from '../services/playlistService';
import { usePlayer } from '../contexts/PlayerContext';
import { Play, Music, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const AlbumCard = ({ album, onClick }) => (
    <Link
        to={`/album/${encodeURIComponent(album.name)}`}
        className="bg-[#181818] p-4 rounded-[6px] hover:bg-[#282828] transition-all duration-300 group cursor-pointer relative"
    >
        <div className="relative mb-4 shadow-[0_8px_24px_rgba(0,0,0,0.5)] rounded-[6px] overflow-hidden">
            <img src={album.coverUrl} alt={album.name} className="w-full aspect-square object-cover" />
            <button 
                onClick={(e) => {
                    e.preventDefault();
                    onClick();
                }}
                className="absolute bottom-2 right-2 bg-[#ff6b1a] rounded-full p-2 text-white shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:scale-105 hover:bg-[#ff8c42]"
            >
                <Play fill="currentColor" size={16} className="ml-0.5" />
            </button>
        </div>
        <h3 className="font-bold text-white mb-2 truncate text-[16px]">{album.name}</h3>
        <p className="text-sm text-[#a7a7a7] truncate">{album.artist}</p>
    </Link>
);

const ArtistCard = ({ artist }) => (
    <Link
        to={`/artist/${encodeURIComponent(artist.name)}`}
        className="bg-[#181818] p-4 rounded-[6px] hover:bg-[#282828] transition-all duration-300 cursor-pointer text-center group"
    >
        <div className="relative mb-4 shadow-[0_8px_24px_rgba(0,0,0,0.5)] rounded-full overflow-hidden">
            <img src={artist.coverUrl} alt={artist.name} className="w-full aspect-square object-cover" />
        </div>
        <h3 className="font-bold text-white truncate text-[14px] mb-1">{artist.name}</h3>
        <p className="text-xs text-[#a7a7a7]">Artist</p>
    </Link>
);

const Home = () => {
    const [recentAlbums, setRecentAlbums] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [trendingArtists, setTrendingArtists] = useState([]);
    const [allSongs, setAllSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { playQueue } = usePlayer();

    useEffect(() => {
        const fetchData = async () => {
            const songs = await getSongs();
            setAllSongs(songs);
            
            const playlistData = await getPlaylists();
            setPlaylists(playlistData.slice(0, 5));
            
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
            <div className="absolute top-0 left-0 w-full h-[332px] bg-gradient-to-b from-[#222222] to-[#121212] z-0 pointer-events-none"></div>

            <div className="relative z-10 p-4 sm:p-6 md:p-8">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2 tracking-tight">{greeting()}</h1>
                <p className="text-sm text-[#b3b3b3] mb-6">Welcome to Pumafy - Your school-wide music service 🐆</p>

                {/* Trending Artists Section */}
                {trendingArtists.length > 0 && (
                    <section className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold hover:underline cursor-pointer tracking-tight flex items-center gap-2">
                                <Users size={28} />Trending Artists
                            </h2>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                            {trendingArtists.map((artist) => (
                                <ArtistCard key={artist.name} artist={artist} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Recently Added Albums Section */}
                <section className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold hover:underline cursor-pointer tracking-tight">Recently Added Albums</h2>
                    </div>

                    {loading ? (
                        <div className="text-gray-500">Loading...</div>
                    ) : (
                        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                            {recentAlbums.length > 0 ? recentAlbums.map((album) => (
                                <AlbumCard 
                                    key={`${album.name}-${album.artist}`} 
                                    album={album}
                                    onClick={() => handlePlayAlbum(album)}
                                />
                            )) : (
                                <div className="col-span-full py-12 text-gray-500 text-center bg-[#181818]/50 rounded-lg border border-dashed border-gray-700">
                                    No music uploaded yet. Go to All Songs to add some!
                                </div>
                            )}
                        </div>
                    )}
                </section>

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
