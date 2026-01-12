import React, { useEffect, useState, useRef } from 'react';
import { Upload, Clock3, Search } from 'lucide-react';
import { getSongs, uploadSong } from '../services/musicService';
import SongRow from '../components/SongRow';
import { usePlayer } from '../contexts/PlayerContext';

const Library = () => {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);
    const { playSong } = usePlayer();

    const fetchSongs = async () => {
        setLoading(true);
        const data = await getSongs();
        setSongs(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchSongs();
    }, []);

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploading(true);
            await uploadSong(file);
            setUploading(false);
            fetchSongs();
        } catch (error) {
            console.error("Upload failed", error);
            setUploading(false);
            alert("Upload failed. Please try again.");
        }
    };

    const handlePlay = (song) => {
        playSong(song);
    };

    return (
        <div className="relative pb-32 bg-[#121212] min-h-full rounded-lg overflow-hidden">

            {/* Header / Gradient */}
            <div className="relative h-[280px] w-full bg-gradient-to-b from-[#4000F4] to-[#121212] flex items-end p-8 gap-6">
                <div className="relative z-10 h-[192px] w-[192px] shadow-[0_4px_60px_rgba(0,0,0,0.5)] flex items-center justify-center bg-gradient-to-br from-[#450af5] to-[#c4efd9] shrink-0">
                    <span className="text-6xl text-white opacity-50">♥</span> // Liked Songs placeholder style
                </div>

                <div className="relative z-10 flex flex-col gap-1 w-full overflow-hidden">
                    <span className="uppercase text-xs font-bold tracking-wider text-white">Playlist</span>
                    <h1 className="text-[90px] font-black tracking-tighter text-white leading-tight mb-4 truncate">Your Library</h1>
                    <div className="flex items-center gap-2 text-sm font-bold text-white">
                        <span className="cursor-pointer">User</span>
                        <span className="font-normal text-[#b3b3b3]">• {songs.length} songs</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10 px-8 py-6">
                {/* Toolbar */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button className="bg-[#1ed760] text-black rounded-full p-[14px] hover:scale-105 active:scale-100 transition-transform shadow-lg hover:bg-[#3be477]">
                            <svg role="img" height="24" width="24" viewBox="0 0 24 24" fill="currentColor"><path d="M7.05 3.606l13.49 7.788a.7.7 0 010 1.212L7.05 20.394a.7.7 0 01-1.05-.606V4.212a.7.7 0 011.05-.606z"></path></svg>
                        </button>
                        <button
                            onClick={handleUploadClick}
                            disabled={uploading}
                            className="bg-transparent border border-[#727272] text-white rounded-full px-4 py-2 text-sm font-bold hover:border-white transition-colors flex items-center gap-2"
                        >
                            {uploading ? (
                                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                            ) : (
                                <Upload size={16} />
                            )}
                            Upload Song
                        </button>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="audio/*" className="hidden" />
                    </div>
                    <div className="flex items-center gap-2 text-[#b3b3b3] cursor-pointer hover:text-white transition-colors">
                        <span className="text-sm font-semibold">List</span>
                        <svg role="img" height="16" width="16" viewBox="0 0 16 16" fill="currentColor"><path d="M15 14.5H5V13h10v1.5zm0-5.75H5v-1.5h10v1.5zM15 3H5V1.5h10V3zM3 3H1V1.5h2V3zm0 11.5H1V13h2v1.5zm0-5.75H1v-1.5h2v1.5z"></path></svg>
                    </div>
                </div>

                {/* Table Header */}
                <div className="grid grid-cols-[16px_4fr_3fr_minmax(120px,1fr)] gap-4 px-4 py-2 border-b border-[#282828] text-[#a7a7a7] text-sm font-normal mb-4 sticky top-0 bg-[#121212] z-20">
                    <span className="w-5 text-center">#</span>
                    <span>Title</span>
                    <span>Album</span>
                    <div className="flex justify-end pr-8"><Clock3 size={16} /></div>
                </div>

                <div className="flex flex-col">
                    {loading ? (
                        <div className="text-center py-10 text-[#727272]">Loading...</div>
                    ) : songs.length === 0 ? (
                        <div className="text-center py-20 text-gray-500">
                            <div className="text-6xl mb-4">🎵</div>
                            <h3 className="text-xl font-bold text-white">It's a bit empty here</h3>
                            <p className="text-[#a7a7a7] mt-2">Upload songs to start building your library.</p>
                        </div>
                    ) : (
                        songs.map((song, index) => (
                            <SongRow
                                key={song.id}
                                song={song}
                                index={index}
                                onPlay={handlePlay}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Library;
