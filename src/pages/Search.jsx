import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, Filter, X } from 'lucide-react';
import { searchSongs } from '../services/musicService';
import SongRow from '../components/SongRow';
import { usePlayer } from '../contexts/PlayerContext';

const Search = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filterType, setFilterType] = useState("all"); // all, artist, album
    const [showFilters, setShowFilters] = useState(false);
    const { playQueue } = usePlayer();

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            const data = await searchSongs(query);
            
            // Apply filter
            let filtered = data;
            if (filterType !== "all" && query) {
                const lowerQuery = query.toLowerCase();
                if (filterType === "artist") {
                    filtered = data.filter(song => song.artist.toLowerCase().includes(lowerQuery));
                } else if (filterType === "album") {
                    filtered = data.filter(song => song.album.toLowerCase().includes(lowerQuery));
                }
            }
            
            setResults(filtered);
            setLoading(false);
        };

        const debounce = setTimeout(fetchResults, 300);
        return () => clearTimeout(debounce);
    }, [query, filterType]);

    const clearFilters = () => {
        setFilterType("all");
        setShowFilters(false);
    };

    return (
        <div className="relative pb-32 bg-[#121212] min-h-full rounded-lg overflow-hidden">
            {/* Gradient Background - More subtle for Search */}
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
                            className="w-full bg-white text-black rounded-full pl-12 pr-12 py-3 text-sm font-medium placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white border border-transparent shadow-sm hover:bg-[#f0f0f0] transition-colors"
                        />
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`absolute right-4 top-1/2 transform -translate-y-1/2 text-[#121212] hover:text-[#1ed760] transition ${filterType !== 'all' ? 'text-[#1ed760]' : ''}`}
                        >
                            <Filter size={20} />
                        </button>
                    </div>

                    {/* Filter Pills */}
                    {showFilters && (
                        <div className="flex gap-2 mb-4 animate-fadeIn">
                            <button
                                onClick={() => setFilterType("all")}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                                    filterType === "all" 
                                        ? "bg-white text-black" 
                                        : "bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]"
                                }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilterType("artist")}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                                    filterType === "artist" 
                                        ? "bg-white text-black" 
                                        : "bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]"
                                }`}
                            >
                                Artist
                            </button>
                            <button
                                onClick={() => setFilterType("album")}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                                    filterType === "album" 
                                        ? "bg-white text-black" 
                                        : "bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]"
                                }`}
                            >
                                Album
                            </button>
                            {filterType !== "all" && (
                                <button
                                    onClick={clearFilters}
                                    className="px-4 py-2 rounded-full text-sm font-medium bg-[#2a2a2a] text-white hover:bg-[#3a3a3a] transition flex items-center gap-2"
                                >
                                    <X size={16} /> Clear
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {loading ? (
                    <div className="text-[#a7a7a7] text-sm">Searching...</div>
                ) : (
                    <div className="flex flex-col gap-1">
                        {results.length === 0 && query ? (
                            <div className="text-center py-12">
                                <h3 className="text-xl font-bold text-white mb-2">No results found for "{query}"</h3>
                                <p className="text-[#a7a7a7]">Please make sure your words are spelled correctly, or use fewer or different keywords.</p>
                            </div>
                        ) : results.length === 0 && !query ? (
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
                                {/* Browse all category placeholders */}
                                <div className="aspect-square rounded-lg bg-[#E13300] p-4 text-2xl font-bold text-white relative overflow-hidden cursor-pointer hover:shadow-lg transition-transform hover:scale-[1.02]">Pop <img className="absolute -right-4 -bottom-2 w-28 h-28 rotate-[25deg] shadow-md" src="https://i.scdn.co/image/ab67706f0000000255519ea89585698b6c507c5a" alt="" /></div>
                                <div className="aspect-square rounded-lg bg-[#7358FF] p-4 text-2xl font-bold text-white relative overflow-hidden cursor-pointer hover:shadow-lg transition-transform hover:scale-[1.02]">Rock <img className="absolute -right-4 -bottom-2 w-28 h-28 rotate-[25deg] shadow-md" src="https://i.scdn.co/image/ab67706f00000002fe24d70b631d87c945145b34" alt="" /></div>
                                <div className="aspect-square rounded-lg bg-[#BC5900] p-4 text-2xl font-bold text-white relative overflow-hidden cursor-pointer hover:shadow-lg transition-transform hover:scale-[1.02]">Hip-Hop <img className="absolute -right-4 -bottom-2 w-28 h-28 rotate-[25deg] shadow-md" src="https://i.scdn.co/image/ab67706f000000025f385ceb528b1db84c2f6890" alt="" /></div>
                                <div className="aspect-square rounded-lg bg-[#E91429] p-4 text-2xl font-bold text-white relative overflow-hidden cursor-pointer hover:shadow-lg transition-transform hover:scale-[1.02]">Indie <img className="absolute -right-4 -bottom-2 w-28 h-28 rotate-[25deg] shadow-md" src="https://i.scdn.co/image/ab67706f00000002e2133c914bf6ce036e477f10" alt="" /></div>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-xl font-bold mb-4">Songs</h2>
                                {results.map((song, index) => (
                                    <SongRow
                                        key={song.id}
                                        song={song}
                                        index={index}
                                        onPlay={(_s, i) => playQueue(results, i)}
                                    />
                                ))}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;
