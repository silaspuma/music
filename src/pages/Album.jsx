import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSongs } from '../services/musicService';
import SongRow from '../components/SongRow';
import { usePlayer } from '../contexts/PlayerContext';
import { Play, Clock3 } from 'lucide-react';

const Album = () => {
    const { name } = useParams();
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { playSong } = usePlayer();

    useEffect(() => {
        const fetchAlbumSongs = async () => {
            setLoading(true);
            const allSongs = await getSongs();
            const decodedName = decodeURIComponent(name);
            const albumSongs = allSongs.filter(s => s.album === decodedName);
            setSongs(albumSongs);
            setLoading(false);
        };
        fetchAlbumSongs();
    }, [name]);

    if (loading) return <div className="p-8">Loading...</div>;

    const albumCover = songs.length > 0 ? songs[0].imageUrl : null;
    const artistName = songs.length > 0 ? songs[0].artist : "Unknown Artist";

    return (
        <div className="pb-32">
            {/* Header */}
            <div className="flex items-end gap-6 p-8 bg-gradient-to-b from-purple-800 to-[#121212]">
                <div className="h-52 w-52 bg-[#333] shadow-2xl flex items-center justify-center rounded-sm transition-transform hover:scale-105">
                    {albumCover ? <img src={albumCover} alt={name} className="h-full w-full object-cover shadow-lg" /> : <span className="text-6xl font-bold">💿</span>}
                </div>
                <div className="flex flex-col gap-2">
                    <span className="uppercase text-xs font-bold tracking-wider">Album</span>
                    <h1 className="text-6xl font-black tracking-tight text-white mb-2">{decodeURIComponent(name)}</h1>
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                        {artistName && (
                            <>
                                <span className="hover:underline cursor-pointer text-white">{artistName}</span>
                                <span>•</span>
                            </>
                        )}
                        <span>{new Date().getFullYear()}</span> {/* Placeholder year */}
                        <span>•</span>
                        <span>{songs.length} songs</span>
                    </div>
                </div>
            </div>

            <div className="px-8 mt-4">
                {/* Actions Row */}
                <div className="flex items-center gap-6 mb-8">
                    <button className="bg-green-500 text-black rounded-full p-3 hover:scale-105 transition-transform">
                        <Play fill="currentColor" size={24} />
                    </button>
                    <button className="text-gray-400 hover:text-white border border-gray-600 rounded-full px-4 py-1 text-sm font-bold uppercase tracking-widest">
                        Follow
                    </button>
                </div>

                {/* Header Row */}
                <div className="grid grid-cols-[auto_1fr_1fr_auto_auto] gap-4 px-4 py-2 border-b border-[#282828] text-gray-400 text-sm font-medium mb-4">
                    <span className="w-5 text-center">#</span>
                    <span>Title</span>
                    <span>Artist</span>
                    <span className="w-8"></span>
                    <div className="flex justify-end w-12"><Clock3 size={16} /></div>
                </div>

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

export default Album;
