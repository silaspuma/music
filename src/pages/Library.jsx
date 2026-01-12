import React, { useEffect, useState, useRef } from 'react';
import { Upload, Clock3, Search, ArrowUpDown, Shuffle } from 'lucide-react';
import { getSongs, uploadSong } from '../services/musicService';
import SongRow from '../components/SongRow';
import { usePlayer } from '../contexts/PlayerContext';
import { formatTotalDuration } from '../utils/formatDuration';

const Library = () => {
    const [songs, setSongs] = useState([]);
    const [sortedSongs, setSortedSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [sortBy, setSortBy] = useState(() => localStorage.getItem('librarySortBy') || 'dateAdded');
    const fileInputRef = useRef(null);
    const { playQueue } = usePlayer();

    const fetchSongs = async () => {
        setLoading(true);
        const data = await getSongs();
        setSongs(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchSongs();
    }, []);

    useEffect(() => {
        // Apply sorting whenever songs or sortBy changes
        let sorted = [...songs];
        switch (sortBy) {
            case 'title':
                sorted.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'artist':
                sorted.sort((a, b) => a.artist.localeCompare(b.artist));
                break;
            case 'playCount':
                sorted.sort((a, b) => (b.playCount || 0) - (a.playCount || 0));
                break;
            case 'dateAdded':
            default:
                sorted.sort((a, b) => {
                    const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
                    const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
                    return dateB - dateA;
                });
                break;
        }
        setSortedSongs(sorted);
        localStorage.setItem('librarySortBy', sortBy);
    }, [songs, sortBy]);

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        setUploading(true);
        let successCount = 0;
        let skipCount = 0;
        const skippedSongs = [];

        for (const file of files) {
            try {
                await uploadSong(file);
                successCount++;
            } catch (error) {
                if (error.message.includes('already exists')) {
                    skipCount++;
                    const songName = file.name.replace(/\.[^/.]+$/, "");
                    skippedSongs.push(songName);
                    console.log(`Skipped duplicate: ${songName}`);
                } else {
                    console.error(`Failed to upload ${file.name}:`, error);
                    alert(`Failed to upload ${file.name}: ${error.message}`);
                }
            }
        }

        setUploading(false);
        fetchSongs();

        let message = '';
        if (successCount > 0) {
            message += `Successfully uploaded ${successCount} song(s)!`;
        }
        if (skipCount > 0) {
            message += `\n\nSkipped ${skipCount} duplicate song(s):\n${skippedSongs.slice(0, 5).join('\n')}`;
            if (skippedSongs.length > 5) {
                message += `\n...and ${skippedSongs.length - 5} more`;
            }
        }
        if (message) {
            alert(message);
        }
    };

    const handlePlay = (_song, index) => {
        playQueue(songs, index);
    };

    const handleDeleteSong = (songId) => {
        setSongs(songs.filter(s => s.id !== songId));
    };

    const handleShuffle = () => {
        if (sortedSongs.length > 0) {
            const shuffled = [...sortedSongs].sort(() => Math.random() - 0.5);
            playQueue(shuffled, 0);
        }
    };

    const totalMinutes = Math.floor(sortedSongs.reduce((sum, song) => sum + (song.duration || 0), 0) / 60);
    const formattedDuration = formatTotalDuration(sortedSongs.reduce((sum, song) => sum + (song.duration || 0), 0));

    return (
        <div className="relative pb-32 bg-[#121212] min-h-full rounded-lg overflow-hidden">

            {/* Header / Gradient */}
            <div className="relative h-[180px] sm:h-[240px] md:h-[280px] w-full bg-gradient-to-b from-[#4000F4] to-[#121212] flex flex-col sm:flex-row items-end p-4 sm:p-6 md:p-8 gap-4 sm:gap-6">
                <div className="relative z-10 h-[120px] sm:h-[160px] md:h-[192px] w-[120px] sm:w-[160px] md:w-[192px] shadow-[0_4px_60px_rgba(0,0,0,0.5)] flex items-center justify-center bg-gradient-to-br from-[#450af5] to-[#c4efd9] shrink-0 rounded-lg">
                    <span className="text-4xl sm:text-5xl md:text-6xl text-white opacity-50">♫</span>
                </div>

                <div className="relative z-10 flex flex-col gap-1 w-full overflow-hidden">
                    <span className="uppercase text-xs font-bold tracking-wider text-white">Playlist</span>
                    <h1 className="text-4xl sm:text-6xl md:text-[90px] font-black tracking-tighter text-white leading-tight mb-2 sm:mb-4 truncate">Your Library</h1>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold text-white">
                        <span className="cursor-pointer">User</span>
                        <span className="font-normal text-[#b3b3b3]">• {songs.length} songs, {formattedDuration}</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10 px-4 sm:px-6 md:px-8 py-4 md:py-6">
                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
                    <div className="flex items-center gap-4 flex-wrap">
                        <button 
                            onClick={() => playQueue(sortedSongs, 0)}
                            disabled={sortedSongs.length === 0}
                            className="bg-[#1ed760] text-black rounded-full p-[14px] hover:scale-105 active:scale-100 transition-transform shadow-lg hover:bg-[#3be477] touch-active disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg role="img" height="24" width="24" viewBox="0 0 24 24" fill="currentColor"><path d="M7.05 3.606l13.49 7.788a.7.7 0 010 1.212L7.05 20.394a.7.7 0 01-1.05-.606V4.212a.7.7 0 011.05-.606z"></path></svg>
                        </button>
                        <button
                            onClick={handleShuffle}
                            disabled={sortedSongs.length === 0}
                            className="text-[#b3b3b3] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Shuffle"
                        >
                            <Shuffle size={32} />
                        </button>
                        <button
                            onClick={handleUploadClick}
                            disabled={uploading}
                            className="bg-transparent border border-[#727272] text-white rounded-full px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold hover:border-white transition-colors flex items-center gap-2 touch-active"
                        >
                            {uploading ? (
                                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                            ) : (
                                <Upload size={16} />
                            )}
                            {uploading ? 'Uploading...' : 'Upload Songs'}
                        </button>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="audio/*" multiple className="hidden" />
                    </div>
                    <div className="flex items-center gap-4">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-[#2a2a2a] text-white border border-[#727272] rounded-md px-3 py-2 text-sm hover:border-white transition-colors cursor-pointer"
                        >
                            <option value="dateAdded">Date Added</option>
                            <option value="title">Title (A-Z)</option>
                            <option value="artist">Artist (A-Z)</option>
                            <option value="playCount">Play Count</option>
                        </select>
                        <div className="flex items-center gap-2 text-[#b3b3b3] cursor-pointer hover:text-white transition-colors text-xs sm:text-sm">
                            <span className="font-semibold hidden sm:inline">List</span>
                            <svg role="img" height="16" width="16" viewBox="0 0 16 16" fill="currentColor"><path d="M15 14.5H5V13h10v1.5zm0-5.75H5v-1.5h10v1.5zM15 3H5V1.5h10V3zM3 3H1V1.5h2V3zm0 11.5H1V13h2v1.5zm0-5.75H1v-1.5h2v1.5z"></path></svg>
                        </div>
                    </div>
                </div>

                {/* Table Header - Hidden on mobile */}
                <div className="hidden sm:grid grid-cols-[16px_4fr_3fr_minmax(120px,1fr)] gap-4 px-4 py-2 border-b border-[#282828] text-[#a7a7a7] text-sm font-normal mb-4 sticky top-0 bg-[#121212] z-20">
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
                        sortedSongs.map((song, index) => (
                            <SongRow
                                key={song.id}
                                song={song}
                                index={index}
                                onPlay={handlePlay}
                                onDelete={handleDeleteSong}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Library;
