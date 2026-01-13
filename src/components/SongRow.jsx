import React, { useState, useEffect } from 'react';
import { Play, Pause, Heart, MoreHorizontal, Copy, ListPlus } from 'lucide-react';
import { usePlayer } from '../contexts/PlayerContext';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { deleteSong } from '../services/musicService';
import { isFavorite, toggleFavorite } from '../utils/favorites';
import { formatPlayCount } from '../utils/playCount';
import VerifiedBadge from './VerifiedBadge';

const SongRow = ({ song, index, onPlay, onDelete }) => {
    const { currentSong, isPlaying, togglePlay, playNextInQueue } = usePlayer();
    const { isAdmin, currentUser } = useAuth();
    const isCurrent = currentSong?.id === song.id;
    const isPlayingCurrent = isCurrent && isPlaying;
    const [hover, setHover] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

    // Check if current user can delete this song
    const canDelete = isAdmin() || (song.uploadedBy === currentUser?.uid);

    useEffect(() => {
        // Check if song is liked from localStorage
        setIsLiked(isFavorite(song.id));
    }, [song.id]);

    const handlePlayClick = () => {
        if (isCurrent) {
            togglePlay();
        } else {
            onPlay(song, index);
        }
    };

    const handleFavorite = () => {
        const newState = toggleFavorite(song.id);
        setIsLiked(newState);
    };

    const handleDelete = async () => {
        if (window.confirm(`Delete "${song.title}"? This cannot be undone.`)) {
            try {
                await deleteSong(song.id, song.url, song.imageUrl);
                alert(`"${song.title}" deleted!`);
                setShowMenu(false);
                if (onDelete) onDelete(song.id);
            } catch (error) {
                alert(`Failed to delete song: ${error.message}`);
            }
        }
    };

    const handleShare = () => {
        const shareText = `Check out ${song.title} by ${song.artist}`;
        if (navigator.share) {
            navigator.share({
                title: song.title,
                text: shareText,
                url: window.location.href
            }).catch(err => console.log('Share cancelled:', err));
        } else {
            navigator.clipboard.writeText(shareText);
            alert('Copied to clipboard!');
        }
        setShowMenu(false);
    };

    const handleGoToArtist = () => {
        setShowMenu(false);
    };

    const handleGoToAlbum = () => {
        setShowMenu(false);
    };

    const formatDuration = (seconds) => {
        if (!seconds) return "-:-";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div
            className={`group grid grid-cols-[16px_1fr_0.5fr_minmax(60px,1fr)] sm:grid-cols-[16px_4fr_3fr_minmax(120px,1fr)] gap-2 sm:gap-4 px-2 sm:px-4 py-2 sm:py-3 h-auto sm:h-[56px] rounded-[4px] items-center transition-colors text-xs sm:text-base relative ${isCurrent ? 'bg-[#2a2a2a]/30' : 'hover:bg-[#2a2a2a]'}`}
            onDoubleClick={handlePlayClick}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => {
                setHover(false);
                setShowMenu(false);
            }}
        >
            {/* Index / Play Button */}
            <div className="flex justify-center items-center text-[#b3b3b3] text-md w-[16px]">
                {hover || isCurrent ? (
                    <button className="text-white" onClick={handlePlayClick}>
                        {isPlayingCurrent ? <Pause size={14} sm:size={16} fill="currentColor" /> : <Play size={14} sm:size={16} fill="currentColor" />}
                    </button>
                ) : (
                    <span className="font-normal text-md tabular-nums text-xs sm:text-base">{index + 1}</span>
                )}
            </div>

            {/* Title & Artist */}
            <div className="flex items-center gap-2 sm:gap-4 overflow-hidden min-w-0">
                {song.imageUrl ? (
                    <img src={song.imageUrl} alt={song.title} className="h-8 sm:h-10 w-8 sm:w-10 rounded-[2px] sm:rounded-[4px] object-cover shadow-sm flex-shrink-0" />
                ) : (
                    <div className="h-8 sm:h-10 w-8 sm:w-10 bg-[#333] flex items-center justify-center rounded-[2px] sm:rounded-[4px] flex-shrink-0">
                        <span className="text-[8px] sm:text-[10px] text-gray-500">♪</span>
                    </div>
                )}
                <div className="flex flex-col truncate pr-1 sm:pr-2 min-w-0">
                    <span className={`text-xs sm:text-[16px] font-normal truncate mb-[1px] sm:mb-[2px] ${isCurrent ? 'text-[#ff6b1a]' : 'text-white'}`}>{song.title}</span>
                    <div className="flex items-center gap-2 text-xs">
                        <Link
                            to={`/artist/${encodeURIComponent(song.artist)}`}
                            className="text-[#b3b3b3] hover:text-white hover:underline transition-colors truncate flex items-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {song.artist}
                            <VerifiedBadge artistName={song.artist} size={14} />
                        </Link>
                        {song.uploaderUsername && (
                            <>
                                <span className="text-[#666]">•</span>
                                <Link
                                    to={`/user/${encodeURIComponent(song.uploaderUsername)}`}
                                    className="text-[#888] hover:text-white hover:underline transition-colors truncate"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    by {song.uploaderUsername}
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Album - hidden on mobile */}
            <div className="hidden sm:flex items-center text-sm text-[#b3b3b3] hover:text-white hover:underline transition-colors cursor-pointer truncate">
                <Link
                    to={`/album/${encodeURIComponent(song.album)}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {song.album}
                </Link>
            </div>

            {/* Action Area (Play Count + Duration + Heart + More) */}
            <div className="flex items-center justify-end gap-x-1 sm:gap-x-4 flex-shrink-0">
                <span className="text-xs sm:text-sm text-[#b3b3b3] font-normal min-w-[40px] text-right hidden sm:block">
                    {formatPlayCount(song.playCount || 0)}
                </span>
                <button
                    onClick={handleFavorite}
                    className={`transition-colors hidden sm:block ${isLiked ? 'text-[#ff6b1a]' : 'text-[#b3b3b3] hover:text-white'} ${hover ? 'visible' : 'invisible'}`}
                >
                    <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
                </button>
                <span className="text-xs sm:text-sm text-[#b3b3b3] font-normal tabular-nums min-w-[35px] sm:min-w-[40px] text-right">{formatDuration(song.duration)}</span>
                
                {/* More Options Menu */}
                <div className={`relative hidden sm:block ${hover ? 'visible' : 'invisible'}`}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowMenu(!showMenu);
                        }}
                        className="text-[#b3b3b3] hover:text-white transition-colors p-1"
                    >
                        <MoreHorizontal size={16} />
                    </button>
                    
                    {showMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-[#282828] rounded-lg shadow-lg z-50 py-2 border border-[#3e3e3e]">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    playNextInQueue(song);
                                    setShowMenu(false);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#3e3e3e] transition-colors flex items-center gap-2"
                            >
                                <ListPlus size={14} />
                                Play Next
                            </button>
                            
                            <button
                                onClick={handleFavorite}
                                className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#3e3e3e] transition-colors flex items-center gap-2"
                            >
                                <Heart size={14} fill={isLiked ? 'currentColor' : 'none'} />
                                {isLiked ? 'Remove from Favorites' : 'Add to Favorites'}
                            </button>
                            
                            <Link
                                to={`/artist/${encodeURIComponent(song.artist)}`}
                                onClick={handleGoToArtist}
                                className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#3e3e3e] transition-colors block"
                            >
                                Go to Artist
                            </Link>
                            <Link
                                to={`/album/${encodeURIComponent(song.album)}`}
                                onClick={handleGoToAlbum}
                                className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#3e3e3e] transition-colors block"
                            >
                                Go to Album
                            </Link>
                            <button
                                onClick={handleShare}
                                className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#3e3e3e] transition-colors flex items-center gap-2"
                            >
                                <Copy size={14} />
                                Share
                            </button>
                            {canDelete && (
                                <>
                                    <hr className="border-[#3e3e3e] my-2" />
                                    <button
                                        onClick={handleDelete}
                                        className="w-full text-left px-4 py-2 text-sm text-[#ff4444] hover:bg-[#3e3e3e] transition-colors"
                                    >
                                        Delete Song
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SongRow;
