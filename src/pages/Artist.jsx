import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSongs } from '../services/musicService';
import SongRow from '../components/SongRow';
import { usePlayer } from '../contexts/PlayerContext';
import { Play } from 'lucide-react';

const Artist = () => {
    const { name } = useParams();
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { playSong } = usePlayer();

    useEffect(() => {
        const fetchArtistSongs = async () => {
            setLoading(true);
            // In a real app, we'd have a specific query or endpoint
            const allSongs = await getSongs();
            // Decode URI component just in case
            const decodedName = decodeURIComponent(name);
            const artistSongs = allSongs.filter(s => s.artist === decodedName);
            setSongs(artistSongs);
            setLoading(false);
        };
        fetchArtistSongs();
    }, [name]);

    const handlePlayAll = () => {
        if (songs.length > 0) {
            playSong(songs[0]);
            // Ideally set queue to all songs here
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;

    const artistImage = songs.length > 0 ? songs[0].imageUrl : null;

    return (
        <div className="pb-32">
            {/* Header */}
            <div className="flex items-end gap-6 p-8 bg-gradient-to-b from-gray-700 to-[#121212]">
                <div className="h-52 w-52 bg-[#333] shadow-2xl flex items-center justify-center rounded-full overflow-hidden">
                    {artistImage ? <img src={artistImage} alt={name} className="h-full w-full object-cover" /> : <span className="text-6xl font-bold">👤</span>}
                </div>
                <div className="flex flex-col gap-2">
                    <span className="uppercase text-xs font-bold tracking-wider flex items-center gap-1"><span className="bg-blue-500 text-white text-[10px] px-1 rounded-sm">✓</span> Verified Artist</span>
                    <h1 className="text-8xl font-black tracking-tight text-white mb-4">{decodeURIComponent(name)}</h1>
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                        <span>{songs.length} songs</span>
                    </div>
                </div>
            </div>

            <div className="px-8 mt-4">
                <button onClick={handlePlayAll} className="bg-green-500 text-black rounded-full p-4 hover:scale-105 transition-transform mb-8">
                    <Play fill="currentColor" size={24} />
                </button>

                <h2 className="text-2xl font-bold mb-4">Popular</h2>
                <div className="flex flex-col gap-1">
                    {songs.map((song, index) => (
                        <SongRow
                            key={song.id}
                            song={song}
                            index={index}
                            onPlay={(s) => playSong(s)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Artist;
