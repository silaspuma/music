import React, { useState } from 'react';
import { Play, Pause, Heart, MoreHorizontal } from 'lucide-react';
import { usePlayer } from '../contexts/PlayerContext';
import { Link } from 'react-router-dom';

const SongRow = ({ song, index, onPlay }) => {
    const { currentSong, isPlaying, togglePlay } = usePlayer();
    const isCurrent = currentSong?.id === song.id;
    const isPlayingCurrent = isCurrent && isPlaying;
    const [hover, setHover] = useState(false);

    const handlePlayClick = () => {
        if (isCurrent) {
            togglePlay();
        } else {
            onPlay(song, index);
        }
    };

    const formatDuration = (seconds) => {
        if (!seconds) return "-:-";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div
            className={`group grid grid-cols-[16px_4fr_3fr_minmax(120px,1fr)] gap-4 px-4 h-[56px] rounded-[4px] items-center transition-colors ${isCurrent ? 'bg-[#2a2a2a]/30' : 'hover:bg-[#2a2a2a]'}`}
            onDoubleClick={handlePlayClick}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            {/* Index / Play Button */}
            <div className="flex justify-center items-center text-[#b3b3b3] text-md w-[16px]">
                {hover || isCurrent ? (
                    <button className="text-white" onClick={handlePlayClick}>
                        {isPlayingCurrent ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
                    </button>
                ) : (
                    <span className="font-normal text-md tabular-nums">{index + 1}</span>
                )}
            </div>

            {/* Title & Artist */}
            <div className="flex items-center gap-4 overflow-hidden">
                {song.imageUrl ? (
                    <img src={song.imageUrl} alt={song.title} className="h-10 w-10 rounded-[4px] object-cover shadow-sm" />
                ) : (
                    <div className="h-10 w-10 bg-[#333] flex items-center justify-center rounded-[4px]">
                        <span className="text-[10px] text-gray-500">♪</span>
                    </div>
                )}
                <div className="flex flex-col truncate pr-2">
                    <span className={`text-[16px] font-normal truncate mb-[2px] ${isCurrent ? 'text-[#1ed760]' : 'text-white'}`}>{song.title}</span>
                    <Link
                        to={`/artist/${encodeURIComponent(song.artist)}`}
                        className="text-sm text-[#b3b3b3] hover:text-white hover:underline transition-colors truncate"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {song.artist}
                    </Link>
                </div>
            </div>

            {/* Album */}
            <div className="flex items-center text-sm text-[#b3b3b3] hover:text-white hover:underline transition-colors cursor-pointer truncate">
                <Link
                    to={`/album/${encodeURIComponent(song.album)}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {song.album}
                </Link>
            </div>

            {/* Action Area (Duration + Heart + More) */}
            <div className="flex items-center justify-end gap-x-4">
                <button className={`text-[#b3b3b3] hover:text-white ${hover ? 'visible' : 'invisible'}`}><Heart size={16} /></button>
                <span className="text-sm text-[#b3b3b3] font-normal tabular-nums min-w-[40px] text-right">{formatDuration(song.duration)}</span>
                <button className={`text-[#b3b3b3] hover:text-white ${hover ? 'visible' : 'invisible'}`}><MoreHorizontal size={16} /></button>
            </div>
        </div>
    );
};

export default SongRow;
