import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, Filter, X, Play } from 'lucide-react';
import { searchSongs } from '../services/musicService';
import SongRow from '../components/SongRow';
import { usePlayer } from '../contexts/PlayerContext';
import { Link } from 'react-router-dom';

const Search = () => {
    const [query, setQuery] = useState("");
    const [allResults, setAllResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState("all"); // all, songs, artists, albums
    const { playQueue } = usePlayer();

    useEffect(() => {
        const fetchResults = async () => {
            if (!query.trim()) {
                setAllResults([]);
                return;
            }
            
            setLoading(true);
            const data = await searchSongs(query);
            setAllResults(data);
            setLoading(false);
        };

        const debounce = setTimeout(fetchResults, 300);
        return () => clearTimeout(debounce);
    }, [query]);

    // Get unique artists from results
    const getUniqueArtists = () => {
        const artistMap = new Map();
        allResults.forEach(song => {
            if (!artistMap.has(song.artist)) {
                artistMap.set(song.artist, {
                    name: song.artist,
                    coverUrl: song.coverUrl,
                    songCount: 1
                });
            } else {
                artistMap.get(song.artist).songCount++;
            }
        });
        return Array.from(artistMap.values());
    };

    // Get unique albums from results
    const getUniqueAlbums = () => {
        const albumMap = new Map();
        allResults.forEach(song => {
            const key = `${song.album}-${song.artist}`;
            if (!albumMap.has(key)) {
                albumMap.set(key, {
                    name: song.album,
                    artist: song.artist,
                    coverUrl: song.coverUrl,
                    songCount: 1
                });
            } else {
                albumMap.get(key).songCount++;
            }
        });
        return Array.from(albumMap.values());
    };

    const artists = getUniqueArtists();
    const albums = getUniqueAlbums();

    const filteredSongs = category === "songs" || category === "all" ? allResults : [];
    const filteredArtists = category === "artists" || category === "all" ? artists : [];
    const filteredAlbums = category === "albums" || category === "all" ? albums : [];

    return (
        <div className="relative pb-32 bg-[#121212] min-h-full rounded-lg overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-[#181818] to-[#121212] z-0 pointer-events-none"></div>

            <div className="relative z-10 p-4 sm:p-6 md:p-8">
                <h1 className="text-xl sm:text-2xl font-bold mb-6 tracking-tight">Search</h1>
                
                <div className="mb-8 max-w-[600px]">
                    <div className="relative mb-4">
                        <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#121212] z-10" size={20} />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="What do you want to listen to?"
                            className="w-full bg-white text-black rounded-full pl-12 pr-4 py-3 text-sm font-medium placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white border border-transparent shadow-sm hover:bg-[#f0f0f0] transition-colors"
                        />
                    </div>

                    {/* Category Tabs */}
                    {query && (
                        <div className="flex gap-2 mb-4">
                            <button
                                onClick={() => setCategory("all")}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                                    category === "all" 
                                        ? "bg-white text-black" 
                                        : "bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]"
                                }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setCategory("songs")}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                                    category === "songs" 
                                        ? "bg-white text-black" 
                                        : "bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]"
                                }`}
                            >
                                Songs
                            </button>
                            <button
                                onClick={() => setCategory("artists")}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                                    category === "artists" 
                                        ? "bg-white text-black" 
                                        : "bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]"
                                }`}
                            >
                                Artists
                            </button>
                            <button
                                onClick={() => setCategory("albums")}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                                    category === "albums" 
                                        ? "bg-white text-black" 
                                        : "bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]"
                                }`}
                            >
                                Albums
                            </button>
                        </div>
                    )}
                </div>

                {loading ? (
                    <div className="text-[#a7a7a7] text-sm">Searching...</div>
                ) : (
                    <div>
                        {allResults.length === 0 && query ? (
                            <div className="text-center py-12">
                                <h3 className="text-xl font-bold text-white mb-2">No results found for "{query}"</h3>
                                <p className="text-[#a7a7a7]">Please make sure your words are spelled correctly, or use fewer or different keywords.</p>
                            </div>
                        ) : allResults.length === 0 && !query ? (
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
                                {/* Browse all category placeholders */}
                                <div className="aspect-square rounded-lg bg-[#E13300] p-4 text-2xl font-bold text-white relative overflow-hidden cursor-pointer hover:shadow-lg transition-transform hover:scale-[1.02]">Pop <img className="absolute -right-4 -bottom-2 w-28 h-28 rotate-[25deg] shadow-md" src="https://i.scdn.co/image/ab67706f0000000255519ea89585698b6c507c5a" alt="" /></div>
                                <div className="aspect-square rounded-lg bg-[#7358FF] p-4 text-2xl font-bold text-white relative overflow-hidden cursor-pointer hover:shadow-lg transition-transform hover:scale-[1.02]">Rock <img className="absolute -right-4 -bottom-2 w-28 h-28 rotate-[25deg] shadow-md" src="https://i.scdn.co/image/ab67706f00000002fe24d70b631d87c945145b34" alt="" /></div>
                                <div className="aspect-square rounded-lg bg-[#BC5900] p-4 text-2xl font-bold text-white relative overflow-hidden cursor-pointer hover:shadow-lg transition-transform hover:scale-[1.02]">Hip-Hop <img className="absolute -right-4 -bottom-2 w-28 h-28 rotate-[25deg] shadow-md" src="https://i.scdn.co/image/ab67706f000000025f385ceb528b1db84c2f6890" alt="" /></div>
                                <div className="aspect-square rounded-lg bg-[#E91429] p-4 text-2xl font-bold text-white relative overflow-hidden cursor-pointer hover:shadow-lg transition-transform hover:scale-[1.02]">Indie <img className="absolute -right-4 -bottom-2 w-28 h-28 rotate-[25deg] shadow-md" src="https://i.scdn.co/image/ab67706f00000002e2133c914bf6ce036e477f10" alt="" /></div>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {/* Artists Section */}
                                {filteredArtists.length > 0 && (
                                    <div>
                                        <h2 className="text-xl font-bold mb-4">Artists</h2>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                            {filteredArtists.map((artist) => (
                                                <Link
                                                    key={artist.name}
                                                    to={`/artist/${encodeURIComponent(artist.name)}`}
                                                    className="group bg-[#181818] hover:bg-[#282828] rounded-lg p-4 transition-colors"
                                                >
                                                    <div className="aspect-square rounded-full overflow-hidden mb-4 shadow-lg">
                                                        <img 
                                                            src={artist.coverUrl} 
                                                            alt={artist.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <h3 className="font-bold text-white mb-1 truncate">{artist.name}</h3>
                                                    <p className="text-sm text-[#a7a7a7]">Artist • {artist.songCount} {artist.songCount === 1 ? 'song' : 'songs'}</p>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Albums Section */}
                                {filteredAlbums.length > 0 && (
                                    <div>
                                        <h2 className="text-xl font-bold mb-4">Albums</h2>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                            {filteredAlbums.map((album) => (
                                                <Link
                                                    key={`${album.name}-${album.artist}`}
                                                    to={`/album/${encodeURIComponent(album.name)}`}
                                                    className="group bg-[#181818] hover:bg-[#282828] rounded-lg p-4 transition-colors"
                                                >
                                                    <div className="aspect-square rounded-lg overflow-hidden mb-4 shadow-lg">
                                                        <img 
                                                            src={album.coverUrl} 
                                                            alt={album.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <h3 className="font-bold text-white mb-1 truncate">{album.name}</h3>
                                                    <p className="text-sm text-[#a7a7a7] truncate">{album.artist}</p>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Songs Section */}
                                {filteredSongs.length > 0 && (
                                    <div>
                                        <h2 className="text-xl font-bold mb-4">Songs</h2>
                                        <div className="flex flex-col gap-1">
                                            {filteredSongs.map((song, index) => (
                                                <SongRow
                                                    key={song.id}
                                                    song={song}
                                                    index={index}
                                                    onPlay={(_s, i) => playQueue(filteredSongs, i)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;
