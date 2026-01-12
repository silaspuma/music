import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSongs } from '../services/musicService';
import SongRow from '../components/SongRow';
import { usePlayer } from '../contexts/PlayerContext';
import { Play, Clock3, Heart, MoreHorizontal } from 'lucide-react';

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

    if (loading) return <div className="p-8 text-[#b3b3b3]">Loading...</div>;

    const albumCover = songs.length > 0 ? songs[0].imageUrl : null;
    const artistName = songs.length > 0 ? songs[0].artist : "Unknown Artist";

    return (
        <div className="relative pb-32 bg-[#121212] min-h-full rounded-lg overflow-hidden">

            {/* Header */}
            <div className="relative h-[340px] w-full bg-gradient-to-b from-[#602a5c] to-[#121212] flex items-end p-8 gap-6">
                {/* Shadow Overlay */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-40 mix-blend-multiply"></div>

                <div className="relative z-10 h-[232px] w-[232px] shadow-[0_4px_60px_rgba(0,0,0,0.5)] flex items-center justify-center bg-[#333] shrink-0">
                    {albumCover ? <img src={albumCover} alt={name} className="h-full w-full object-cover" /> : <span className="text-6xl font-bold">💿</span>}
                </div>

                <div className="relative z-10 flex flex-col gap-1 w-full overflow-hidden">
                    <span className="uppercase text-xs font-bold tracking-wider text-white">Album</span>
                    <h1 className="text-[72px] font-black tracking-tighter text-white leading-tight mb-2 truncate">{decodeURIComponent(name)}</h1>
                    <div className="flex items-center gap-2 text-sm font-bold text-white">
                        <div className="h-6 w-6 rounded-full bg-gray-500 overflow-hidden">
                            {/* Artist Avatar Placeholder */}
                            {songs[0]?.imageUrl && <img src={songs[0].imageUrl} className="h-full w-full object-cover" />}
                        </div>
                        <span className="hover:underline cursor-pointer">{artistName}</span>
                        <span className="font-normal text-[#b3b3b3]">• 2024 • {songs.length} songs, <span className="text-[#a7a7a7]">24 min 12 sec</span></span>
                    </div>
                </div>
            </div>

            <div className="relative z-10 px-8 py-6 bg-[#121212]/40 backdrop-blur-3xl">
                <div className="flex items-center gap-6 mb-8">
                    <button className="bg-[#1ed760] text-black rounded-full p-[14px] hover:scale-105 active:scale-100 transition-transform shadow-lg hover:bg-[#3be477]">
                        <Play fill="currentColor" size={28} />
                    </button>
                    <button className="text-[#b3b3b3] hover:text-white transition-colors"><Heart size={32} /></button>
                    <button className="text-[#b3b3b3] hover:text-white transition-colors"><MoreHorizontal size={32} /></button>
                </div>

                {/* Table Header */}
                <div className="grid grid-cols-[16px_4fr_3fr_minmax(120px,1fr)] gap-4 px-4 py-2 border-b border-[#282828] text-[#a7a7a7] text-sm font-normal mb-4">
                    <span className="w-5 text-center">#</span>
                    <span>Title</span>
                    <span className="invisible">Album</span> {/* Hidden on album page as redundant? Spotify duplicates it usually */}
                    <div className="flex justify-end pr-8"><Clock3 size={16} /></div>
                </div>

                <div className="flex flex-col">
                    {songs.map((song, index) => (
                        <SongRow
                            key={song.id}
                            song={song}
                            index={index}
                            onPlay={(s) => playSong(s)}
                        />
                    ))}
                </div>

                <div className="mt-8 pt-8 px-4 text-[#a7a7a7] text-xs font-medium">
                    <p>© 2024 {artistName}</p>
                    <p>℗ 2024 {artistName}</p>
                </div>
            </div>
        </div>
    );
};

export default Album;
