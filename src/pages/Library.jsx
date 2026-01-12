import React, { useEffect, useState, useRef } from 'react';
import { Upload, Clock3 } from 'lucide-react';
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
            // Refresh list
            fetchSongs();
        } catch (error) {
            console.error("Upload failed", error);
            setUploading(false);
            alert("Upload failed. Please try again.");
        }
    };

    const handlePlay = (song) => {
        // Play song and basic queue handling (just playing one for now, or could set queue to whole list)
        playSong(song);
    };

    return (
        <div className="p-8 pb-32">
            {/* Header */}
            <div className="flex items-end gap-6 mb-8">
                <div className="h-52 w-52 bg-gradient-to-br from-indigo-600 to-indigo-900 shadow-2xl flex items-center justify-center rounded-md">
                    <span className="text-6xl font-bold">♫</span>
                </div>
                <div className="flex flex-col gap-2">
                    <span className="uppercase text-xs font-bold tracking-wider">Playlist</span>
                    <h1 className="text-8xl font-black tracking-tight text-white mb-4">Your Library</h1>
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                        <span>User</span>
                        <span>•</span>
                        <span>{songs.length} songs</span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between mb-8 sticky top-0 bg-[#121212] pt-4 pb-4 z-10 border-b border-[#282828]">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleUploadClick}
                        disabled={uploading}
                        className="bg-green-500 text-black rounded-full px-8 py-3 font-bold hover:scale-105 transition-transform flex items-center gap-2"
                    >
                        {uploading ? (
                            <>
                                <span className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full"></span>
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload size={20} />
                                Upload Song
                            </>
                        )}
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="audio/*"
                        className="hidden"
                    />
                </div>
            </div>

            {/* Header Row */}
            <div className="grid grid-cols-[auto_1fr_1fr_auto_auto] gap-4 px-4 py-2 border-b border-[#282828] text-gray-400 text-sm font-medium mb-4 sticky top-24 bg-[#121212] z-10">
                <span className="w-5 text-center">#</span>
                <span>Title</span>
                <span>Album</span>
                <span className="w-8"></span>
                <div className="flex justify-end w-12"><Clock3 size={16} /></div>
            </div>

            {/* List */}
            <div className="flex flex-col gap-1">
                {loading ? (
                    <div className="text-center py-10 text-gray-500">Loading songs...</div>
                ) : songs.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">No songs yet. Upload some music!</div>
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
    );
};

export default Library;
