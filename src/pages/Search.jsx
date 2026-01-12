import React, { useState, useEffect } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { searchSongs } from '../services/musicService';
import SongRow from '../components/SongRow';
import { usePlayer } from '../contexts/PlayerContext';

const Search = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const { playSong } = usePlayer();

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            const data = await searchSongs(query);
            setResults(data);
            setLoading(false);
        };

        const debounce = setTimeout(fetchResults, 300);
        return () => clearTimeout(debounce);
    }, [query]);

    return (
        <div className="p-8 pb-32">
            <h1 className="text-2xl font-bold mb-6">Search</h1>
            <div className="relative mb-8">
                <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black" size={24} />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="What do you want to listen to?"
                    className="w-full md:w-96 bg-white text-black rounded-full pl-12 pr-4 py-3 font-medium placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/50"
                />
            </div>

            {loading ? (
                <div className="text-gray-500">Searching...</div>
            ) : (
                <div className="flex flex-col gap-1">
                    {results.length === 0 && query ? (
                        <div className="text-center py-10 text-gray-500">No matches found for "{query}"</div>
                    ) : results.length === 0 && !query ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
                            {/* Browse all category placeholders */}
                            <div className="h-48 rounded-lg bg-red-500 p-4 font-bold text-2xl relative overflow-hidden">Pop <img className="absolute -right-4 -bottom-4 w-24 h-24 rotate-12 shadow-md" src="https://misc.scdn.co/liked-songs/liked-songs-300.png" alt="" /></div>
                            <div className="h-48 rounded-lg bg-blue-500 p-4 font-bold text-2xl relative overflow-hidden">Rock</div>
                            <div className="h-48 rounded-lg bg-purple-500 p-4 font-bold text-2xl relative overflow-hidden">Hip-Hop</div>
                            <div className="h-48 rounded-lg bg-orange-500 p-4 font-bold text-2xl relative overflow-hidden">Indie</div>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-xl font-bold mb-4">Songs</h2>
                            {results.map((song, index) => (
                                <SongRow
                                    key={song.id}
                                    song={song}
                                    index={index}
                                    onPlay={(s) => playSong(s)}
                                />
                            ))}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default Search;
