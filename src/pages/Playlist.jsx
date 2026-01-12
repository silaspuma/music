import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getPlaylistById, updatePlaylist, deletePlaylist } from '../services/playlistService';
import { usePlayer } from '../contexts/PlayerContext';
import SongRow from '../components/SongRow';
import { Play, MoreHorizontal, Pencil, Trash2, Upload } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase.config';

const Playlist = () => {
    const { id } = useParams();
    const [playlist, setPlaylist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showMenu, setShowMenu] = useState(false);
    const [editing, setEditing] = useState(false);
    const [editName, setEditName] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const coverInputRef = useRef(null);
    const { playQueue } = usePlayer();

    useEffect(() => {
        fetchPlaylist();
    }, [id]);

    const fetchPlaylist = async () => {
        setLoading(true);
        const data = await getPlaylistById(id);
        setPlaylist(data);
        setEditName(data?.name || '');
        setEditDescription(data?.description || '');
        setLoading(false);
    };

    const handlePlayAll = () => {
        if (playlist?.songs?.length > 0) {
            playQueue(playlist.songs, 0);
        }
    };

    const handleEdit = () => {
        setEditing(true);
        setShowMenu(false);
    };

    const handleSaveEdit = async () => {
        try {
            await updatePlaylist(id, {
                name: editName,
                description: editDescription
            });
            setEditing(false);
            fetchPlaylist();
        } catch (error) {
            alert('Failed to update playlist: ' + error.message);
        }
    };

    const handleCoverUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const coverRef = ref(storage, `playlist-covers/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(coverRef, file);
            const coverUrl = await getDownloadURL(snapshot.ref);
            
            await updatePlaylist(id, { coverUrl });
            fetchPlaylist();
        } catch (error) {
            alert('Failed to upload cover: ' + error.message);
        }
    };

    const handleDelete = async () => {
        if (window.confirm(`Delete playlist "${playlist.name}"? This cannot be undone.`)) {
            try {
                await deletePlaylist(id);
                window.location.href = '/library';
            } catch (error) {
                alert('Failed to delete playlist: ' + error.message);
            }
        }
    };

    if (loading) return <div className="p-8 text-[#b3b3b3]">Loading...</div>;
    if (!playlist) return <div className="p-8 text-[#b3b3b3]">Playlist not found</div>;

    return (
        <div className="relative pb-32 bg-[#121212] min-h-full rounded-lg overflow-hidden">
            {/* Header */}
            <div className="relative h-[280px] w-full bg-gradient-to-b from-[#5038a0] to-[#121212] flex items-end p-8 gap-6">
                {/* Cover Image */}
                <div className="relative group">
                    {playlist.coverUrl ? (
                        <img 
                            src={playlist.coverUrl} 
                            alt={playlist.name} 
                            className="h-[192px] w-[192px] rounded-lg shadow-2xl object-cover"
                        />
                    ) : (
                        <div className="h-[192px] w-[192px] bg-gradient-to-br from-[#450af5] to-[#c4efd9] flex items-center justify-center rounded-lg shadow-2xl">
                            <span className="text-6xl text-white opacity-50">♪</span>
                        </div>
                    )}
                    <button
                        onClick={() => coverInputRef.current?.click()}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg"
                    >
                        <Upload className="text-white" size={32} />
                    </button>
                    <input
                        ref={coverInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleCoverUpload}
                        className="hidden"
                    />
                </div>

                {/* Playlist Info */}
                <div className="flex flex-col gap-2 flex-1">
                    <span className="uppercase text-xs font-bold tracking-wider text-white">Playlist</span>
                    {editing ? (
                        <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="text-6xl font-black text-white bg-transparent border-b-2 border-white outline-none"
                            autoFocus
                        />
                    ) : (
                        <h1 className="text-6xl font-black text-white leading-tight mb-4">{playlist.name}</h1>
                    )}
                    {editing ? (
                        <textarea
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            className="text-sm text-[#b3b3b3] bg-transparent border border-[#727272] rounded p-2 outline-none resize-none"
                            rows={2}
                            placeholder="Add a description..."
                        />
                    ) : (
                        playlist.description && (
                            <p className="text-sm text-[#b3b3b3]">{playlist.description}</p>
                        )
                    )}
                    <div className="text-sm font-bold text-white mt-2">
                        <span>{playlist.songs?.length || 0} songs</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10 px-8 py-6">
                {/* Toolbar */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={handlePlayAll}
                        disabled={!playlist.songs?.length}
                        className="bg-[#1ed760] text-black rounded-full p-[14px] hover:scale-105 active:scale-100 transition-transform shadow-lg hover:bg-[#3be477] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Play fill="currentColor" size={28} />
                    </button>

                    {editing ? (
                        <>
                            <button
                                onClick={handleSaveEdit}
                                className="bg-white text-black px-6 py-2 rounded-full font-bold hover:scale-105 transition-transform"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => {
                                    setEditing(false);
                                    setEditName(playlist.name);
                                    setEditDescription(playlist.description || '');
                                }}
                                className="border border-[#727272] text-white px-6 py-2 rounded-full font-bold hover:border-white transition-colors"
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <div className="relative">
                            <button
                                onClick={() => setShowMenu(!showMenu)}
                                className="text-[#b3b3b3] hover:text-white p-2"
                            >
                                <MoreHorizontal size={32} />
                            </button>
                            {showMenu && (
                                <div className="absolute left-0 mt-2 w-48 bg-[#282828] rounded-lg shadow-lg z-50 py-2 border border-[#3e3e3e]">
                                    <button
                                        onClick={handleEdit}
                                        className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#3e3e3e] transition-colors flex items-center gap-2"
                                    >
                                        <Pencil size={14} />
                                        Edit Details
                                    </button>
                                    <hr className="border-[#3e3e3e] my-2" />
                                    <button
                                        onClick={handleDelete}
                                        className="w-full text-left px-4 py-2 text-sm text-[#ff4444] hover:bg-[#3e3e3e] transition-colors flex items-center gap-2"
                                    >
                                        <Trash2 size={14} />
                                        Delete Playlist
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Songs */}
                {!playlist.songs || playlist.songs.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        <div className="text-6xl mb-4">🎵</div>
                        <h3 className="text-xl font-bold text-white">No songs yet</h3>
                        <p className="text-[#a7a7a7] mt-2">Add songs from your library using the 3-dot menu.</p>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {playlist.songs.map((song, index) => (
                            <SongRow
                                key={song.id}
                                song={song}
                                index={index}
                                onPlay={(_s, i) => playQueue(playlist.songs, i)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Playlist;
