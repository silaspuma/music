import React, { useRef } from 'react';
import { usePlayer } from '../contexts/PlayerContext';
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle } from 'lucide-react';

const Player = () => {
    const { currentSong, isPlaying, togglePlay, playNext, playPrevious, volume, setVolume, audioRef, seek } = usePlayer();

    // Format time helper
    const formatTime = (time) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    // Create local state for current time progress if needed for smoother UI
    // For now, we rely on standard audio events or a requestAnimationFrame loop?
    // Let's use a simplistic onTimeUpdate approach in the context or here.
    // Actually context doesn't expose currentTime reactively to avoid re-renders. 
    // We can use a ref or local state updated by an interval here.

    const [currentTime, setCurrentTime] = React.useState(0);
    const [duration, setDuration] = React.useState(0);

    React.useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => setDuration(audio.duration);

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', updateDuration);

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', updateDuration);
        }
    }, [audioRef]);

    const handleSeek = (e) => {
        const newTime = Number(e.target.value);
        seek(newTime);
        setCurrentTime(newTime);
    };

    if (!currentSong) return null; // Or play a simplified state

    return (
        <div className="h-24 bg-[#181818] border-t border-[#282828] text-white px-4 flex items-center justify-between z-50">

            {/* Left: Song Info */}
            <div className="flex items-center w-[30%] min-w-[180px]">
                {currentSong.imageUrl ? (
                    <img src={currentSong.imageUrl} alt="Cover" className="h-14 w-14 shadow-lg rounded-sm mr-4" />
                ) : (
                    <div className="h-14 w-14 bg-[#282828] mr-4 flex items-center justify-center rounded-sm">
                        <span className="text-xs text-gray-500">Music</span>
                    </div>
                )}
                <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-semibold hover:underline cursor-pointer truncate">{currentSong.title}</span>
                    <span className="text-xs text-gray-400 hover:underline cursor-pointer hover:text-white truncate">{currentSong.artist}</span>
                </div>
            </div>

            {/* Center: Controls */}
            <div className="flex flex-col items-center max-w-[40%] w-full">
                <div className="flex items-center gap-x-6 mb-2">
                    <button className="text-gray-400 hover:text-white transition"><Shuffle size={16} /></button>
                    <button className="text-gray-400 hover:text-white transition" onClick={playPrevious}><SkipBack size={20} fill="currentColor" /></button>
                    <button
                        className="bg-white rounded-full p-2 text-black hover:scale-105 transition-transform"
                        onClick={togglePlay}
                    >
                        {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
                    </button>
                    <button className="text-gray-400 hover:text-white transition" onClick={playNext}><SkipForward size={20} fill="currentColor" /></button>
                    <button className="text-gray-400 hover:text-white transition"><Repeat size={16} /></button>
                </div>
                <div className="w-full flex items-center gap-x-2 text-xs text-gray-400 font-medium">
                    <span>{formatTime(currentTime)}</span>
                    <input
                        type="range"
                        min={0}
                        max={duration || 100}
                        value={currentTime}
                        onChange={handleSeek}
                        className="w-full h-1 bg-[#4d4d4d] rounded-lg appearance-none cursor-pointer hover:bg-green-500 accent-white"
                    />
                    <span>{formatTime(duration)}</span>
                </div>
            </div>

            {/* Right: Volume */}
            <div className="flex items-center justify-end w-[30%] min-w-[180px] gap-x-2">
                {/* <Mic2 size={16} className="text-gray-400" />
         <ListMusic size={16} className="text-gray-400" />
         <MonitorSpeaker size={16} className="text-gray-400" /> */}
                <Volume2 size={20} className="text-gray-400" />
                <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="w-24 h-1 bg-[#4d4d4d] rounded-lg accent-white cursor-pointer"
                />
            </div>

        </div>
    );
};

export default Player;
