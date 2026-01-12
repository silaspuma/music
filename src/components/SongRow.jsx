import React from 'react';
import { Play, Pause, Clock3, Heart, MoreHorizontal } from 'lucide-react';
import { usePlayer } from '../contexts/PlayerContext';
import { Link } from 'react-router-dom';

const SongRow = ({ song, index, onPlay }) => {
    const { currentSong, isPlaying, togglePlay } = usePlayer();
    const isCurrent = currentSong?.id === song.id;
    const isPlayingCurrent = isCurrent && isPlaying;

    const handlePlayClick = () => {
        if (isCurrent) {
            togglePlay();
        } else {
            onPlay(song);
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
            className={`group grid grid-cols-[auto_1fr_1fr_auto_auto] gap-4 px-4 py-2 rounded-md items-center hover:bg-[#2a2a2a] transition-colors ${isCurrent ? 'text-green-500' : 'text-gray-400'}`}
            onDoubleClick={handlePlayClick}
        >
            {/* Index / Play Button */}
            <div className="w-5 flex justify-center text-sm font-medium">
                <span className="group-hover:hidden">{isCurrent && isPlaying ? <img src="https://open.spotifycdn.com/cdn/images/equaliser-animated-green.f93a2ef4.gif" className="h-4" alt="playing" /> : index + 1}</span>
                <button className="hidden group-hover:block text-white" onClick={handlePlayClick}>
                    {isPlayingCurrent ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
                </button>
            </div>

            {/* Title & Artist */}
            <div className="flex items-center gap-3 overflow-hidden">
                {song.imageUrl ? (
                    <img src={song.imageUrl} alt={song.title} className="h-10 w-10 rounded-sm object-cover" />
                ) : (
                    <div className="h-10 w-10 bg-[#333] flex items-center justify-center rounded-sm">
                        <span className="text-[10px] text-gray-500">♪</span>
                    </div>
                )}
                <div className="flex flex-col truncate">
                    <span className={`text-sm font-bold truncate ${isCurrent ? 'text-green-500' : 'text-white'}`}>{song.title}</span>
                    <Link
                        to={`/artist/${encodeURIComponent(song.artist)}`}
                        className="text-xs group-hover:text-white transition-colors truncate hover:underline"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {song.artist}
                    </Link>
                </div>
            </div>

            {/* Album */}
            <div className="flex items-center text-sm group-hover:text-white transition-colors cursor-pointer truncate">
                <Link
                    to={`/album/${encodeURIComponent(song.album)}`}
                    className="hover:underline"
                    onClick={(e) => e.stopPropagation()}
                >
                    {song.album}
                </Link>
            </div>

            {/* Added Date / Heart */}
            <div className="flex items-center">
                <button className="invisible group-hover:visible hover:text-white"><Heart size={16} /></button>
            </div>

            {/* Duration */}
            <div className="flex items-center justify-end text-sm font-medium w-12">
                {formatDuration(song.duration)}
            </div>

            <button className="invisible group-hover:visible hover:text-white ml-4"><MoreHorizontal size={16} /></button>
        </div>
    );
};

export default SongRow;
