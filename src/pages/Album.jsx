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
    const { playQueue } = usePlayer();

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
            <div className="relative h-[200px] sm:h-[250px] md:h-[340px] w-full bg-gradient-to-b from-[#602a5c] to-[#121212] flex flex-col sm:flex-row items-end p-4 sm:p-6 md:p-8 gap-4 sm:gap-6">
                {/* Shadow Overlay */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-40 mix-blend-multiply"></div>

                <div className="relative z-10 h-[120px] sm:h-[160px] md:h-[232px] w-[120px] sm:w-[160px] md:w-[232px] shadow-[0_4px_60px_rgba(0,0,0,0.5)] flex items-center justify-center bg-[#333] shrink-0 rounded-lg">
                    {albumCover ? <img src={albumCover} alt={name} className="h-full w-full object-cover" /> : <span className="text-3xl sm:text-5xl md:text-6xl font-bold">💿</span>}
                </div>

                <div className="relative z-10 flex flex-col gap-1 w-full overflow-hidden">
                    <span className="uppercase text-xs font-bold tracking-wider text-white">Album</span>
                    <h1 className="text-3xl sm:text-5xl md:text-[72px] font-black tracking-tighter text-white leading-tight mb-1 sm:mb-2 truncate">{decodeURIComponent(name)}</h1>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold text-white">
                        <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-gray-500 overflow-hidden">
                            {songs[0]?.imageUrl && <img src={songs[0].imageUrl} className="h-full w-full object-cover" />}
                        </div>
                        <span className="hover:underline cursor-pointer">{artistName}</span>
                        <span className="font-normal text-[#b3b3b3]">• 2024 • {songs.length} songs</span>
                    </div>
                </div>
            </div>

            <div className="relative z-10 px-4 sm:px-6 md:px-8 py-4 md:py-6 bg-[#121212]/40 backdrop-blur-3xl">
                <div className="flex items-center gap-4 sm:gap-6 mb-6 md:mb-8">
                    <button
                        className="bg-[#1ed760] text-black rounded-full p-[14px] hover:scale-105 active:scale-100 transition-transform shadow-lg hover:bg-[#3be477] touch-active"
                        onClick={() => songs.length && playQueue(songs, 0)}
                    >
                        <Play fill="currentColor" size={28} />
                    </button>
                    <button className="text-white text-xs sm:text-sm font-bold border border-[#727272] hover:border-white rounded-[4px] px-4 py-2 uppercase tracking-widest transition-colors">Follow</button>
                </div>

                {/* Table Header - Hidden on mobile */}
                <div className="hidden sm:grid grid-cols-[16px_4fr_3fr_minmax(120px,1fr)] gap-4 px-4 py-2 border-b border-[#282828] text-[#a7a7a7] text-sm font-normal mb-4">
                    <span className="w-5 text-center">#</span>
                    <span>Title</span>
                    <span className="invisible">Album</span>
                    <div className="flex justify-end pr-8"><Clock3 size={16} /></div>
                </div>

                <div className="flex flex-col">
                    {songs.map((song, index) => (
                        <SongRow
                            key={song.id}
                            song={song}
                            index={index}
                            onPlay={(_s, i) => playQueue(songs, i)}
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
