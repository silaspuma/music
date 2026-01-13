import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase.config';
import { usePlayer } from '../contexts/PlayerContext';
import { User as UserIcon, Music2, Play, Calendar, ArrowLeft } from 'lucide-react';

const User = () => {
    const { username } = useParams();
    const [userSongs, setUserSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userStats, setUserStats] = useState(null);
    const { playQueue } = usePlayer();

    useEffect(() => {
        const fetchUserSongs = async () => {
            try {
                const songsRef = collection(db, 'songs');
                const q = query(
                    songsRef,
                    where('uploaderUsername', '==', username),
                    orderBy('createdAt', 'desc')
                );
                const querySnapshot = await getDocs(q);
                const songs = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                
                setUserSongs(songs);
                
                // Calculate stats
                if (songs.length > 0) {
                    const firstSong = songs[songs.length - 1];
                    const joinDate = firstSong.createdAt?.toDate ? 
                        firstSong.createdAt.toDate() : 
                        new Date();
                    
                    setUserStats({
                        totalUploads: songs.length,
                        joinedDate: joinDate,
                        email: firstSong.uploaderEmail
                    });
                }
                
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user songs:', error);
                setLoading(false);
            }
        };
        
        fetchUserSongs();
    }, [username]);

    const handlePlayAll = () => {
        if (userSongs.length > 0) {
            playQueue(userSongs, 0);
        }
    };

    const handlePlaySong = (index) => {
        playQueue(userSongs, index);
    };

    const formatDate = (date) => {
        return new Intl.DateTimeFormat('en-US', {
            month: 'long',
            year: 'numeric'
        }).format(date);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#121212]">
                <div className="text-[#a7a7a7]">Loading profile...</div>
            </div>
        );
    }

    return (
        <div className="relative pb-32 bg-gradient-to-b from-[#535353] to-[#121212] min-h-full">
            <div className="p-6 md:p-8">
                {/* Back Button */}
                <Link to="/" className="inline-flex items-center gap-2 text-[#b3b3b3] hover:text-white mb-6 transition-colors">
                    <ArrowLeft size={20} />
                    <span>Back to Stream</span>
                </Link>

                {/* Profile Header */}
                <div className="flex flex-col md:flex-row items-start md:items-end gap-6 mb-8">
                    {/* Avatar */}
                    <div className="w-48 h-48 bg-gradient-to-br from-[#ff6b1a] to-[#1ed760] rounded-full flex items-center justify-center shadow-2xl flex-shrink-0">
                        <UserIcon size={80} className="text-white" />
                    </div>

                    {/* Profile Info */}
                    <div className="flex-1">
                        <p className="text-sm font-semibold mb-2">PROFILE</p>
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">{username}</h1>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                            <span className="flex items-center gap-2">
                                <Music2 size={16} />
                                {userStats?.totalUploads || 0} {userStats?.totalUploads === 1 ? 'upload' : 'uploads'}
                            </span>
                            {userStats?.joinedDate && (
                                <>
                                    <span className="text-[#666]">•</span>
                                    <span className="flex items-center gap-2">
                                        <Calendar size={16} />
                                        Joined {formatDate(userStats.joinedDate)}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Play All Button */}
                {userSongs.length > 0 && (
                    <div className="mb-6">
                        <button
                            onClick={handlePlayAll}
                            className="bg-[#1ed760] text-black px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform flex items-center gap-2"
                        >
                            <Play size={20} fill="currentColor" />
                            Play All
                        </button>
                    </div>
                )}

                {/* Uploads Section */}
                <div className="bg-[#121212]/40 rounded-lg p-6">
                    <h2 className="text-2xl font-bold mb-6">Uploads</h2>
                    
                    {userSongs.length === 0 ? (
                        <div className="py-12 text-center">
                            <Music2 size={48} className="mx-auto mb-4 text-[#535353]" />
                            <p className="text-[#a7a7a7]">No uploads yet</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {userSongs.map((song, index) => (
                                <div
                                    key={song.id}
                                    className="group flex items-center gap-4 p-3 hover:bg-[#282828] rounded-lg transition-all cursor-pointer"
                                    onClick={() => handlePlaySong(index)}
                                >
                                    {/* Index / Play Button */}
                                    <div className="flex justify-center items-center text-[#b3b3b3] w-8">
                                        <span className="group-hover:hidden">{index + 1}</span>
                                        <Play size={16} className="hidden group-hover:block text-white" fill="currentColor" />
                                    </div>

                                    {/* Album Cover */}
                                    <div className="w-12 h-12 bg-[#282828] rounded overflow-hidden flex-shrink-0">
                                        {song.imageUrl ? (
                                            <img src={song.imageUrl} alt={song.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Music2 size={20} className="text-[#535353]" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Song Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-white truncate">{song.title}</h3>
                                        <Link
                                            to={`/artist/${encodeURIComponent(song.artist)}`}
                                            className="text-sm text-[#b3b3b3] hover:underline"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {song.artist}
                                        </Link>
                                    </div>

                                    {/* Album & Duration */}
                                    <div className="hidden md:flex items-center gap-8 text-sm text-[#b3b3b3]">
                                        <Link
                                            to={`/album/${encodeURIComponent(song.album)}`}
                                            className="w-48 truncate hover:underline"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {song.album}
                                        </Link>
                                        <span className="w-16 text-right">{song.duration}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default User;
