import React, { useRef, useState, useEffect } from 'react';
import { usePlayer } from '../contexts/PlayerContext';
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle, Mic2, ListMusic, MonitorSpeaker, Maximize2, Heart } from 'lucide-react';

const Player = () => {
    const { currentSong, isPlaying, togglePlay, playNext, playPrevious, volume, setVolume, audioRef, seek } = usePlayer();
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isHoveringSeek, setIsHoveringSeek] = useState(false);

    useEffect(() => {
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

    const formatTime = (time) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleSeek = (e) => {
        const newTime = Number(e.target.value);
        seek(newTime);
        setCurrentTime(newTime);
    };

    // Calculate progress percentage for linear-gradient fill
    const progressPercent = duration ? (currentTime / duration) * 100 : 0;
    const volumePercent = volume * 100;

    if (!currentSong) return null;

    return (
        <div className="h-[90px] bg-[#181818] border-t border-[#282828] text-white px-4 flex items-center justify-between fixed bottom-0 w-full z-50">

            {/* Left: Song Info */}
            <div className="flex items-center w-[30%] min-w-[180px]">
                <div className="relative group">
                    {currentSong.imageUrl ? (
                        <img src={currentSong.imageUrl} alt="Cover" className="h-14 w-14 shadow-lg rounded-md mr-4" />
                    ) : (
                        <div className="h-14 w-14 bg-[#282828] mr-4 flex items-center justify-center rounded-md">
                            <span className="text-xs text-gray-500">♫</span>
                        </div>
                    )}
                </div>
                <div className="flex flex-col justify-center overflow-hidden mr-4">
                    <span className="text-sm font-medium hover:underline cursor-pointer truncate text-white">{currentSong.title}</span>
                    <span className="text-xs text-[#b3b3b3] hover:underline cursor-pointer hover:text-white truncate">{currentSong.artist}</span>
                </div>
                <button className="text-[#b3b3b3] hover:text-white transition-colors"><Heart size={16} /></button>
            </div>

            {/* Center: Controls */}
            <div className="flex flex-col items-center max-w-[40%] w-full">
                <div className="flex items-center gap-x-6 mb-2">
                    <button className="text-[#b3b3b3] hover:text-white transition-colors btn-scale"><Shuffle size={16} /></button>
                    <button className="text-[#b3b3b3] hover:text-white transition-colors btn-scale" onClick={playPrevious}><SkipBack size={20} fill="currentColor" /></button>
                    <button
                        className="bg-white rounded-full p-2 text-black hover:scale-105 transition-transform btn-scale"
                        onClick={togglePlay}
                    >
                        {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
                    </button>
                    <button className="text-[#b3b3b3] hover:text-white transition-colors btn-scale" onClick={playNext}><SkipForward size={20} fill="currentColor" /></button>
                    <button className="text-[#b3b3b3] hover:text-white transition-colors btn-scale"><Repeat size={16} /></button>
                </div>

                <div className="w-full flex items-center gap-x-2 text-xs text-[#a7a7a7] font-medium group"
                    onMouseEnter={() => setIsHoveringSeek(true)}
                    onMouseLeave={() => setIsHoveringSeek(false)}>
                    <span className="min-w-[40px] text-right">{formatTime(currentTime)}</span>
                    <div className="relative w-full h-[4px] rounded-full flex items-center">
                        <input
                            type="range"
                            min={0}
                            max={duration || 100}
                            value={currentTime}
                            onChange={handleSeek}
                            className="absolute w-full h-full opacity-0 cursor-pointer z-20"
                        />
                        {/* Background Track */}
                        <div className="absolute w-full h-full bg-[#4d4d4d] rounded-full z-0"></div>
                        {/* Progress Fill */}
                        <div
                            className={`absolute h-full bg-white group-hover:bg-[#1ed760] rounded-full z-10 pointer-events-none transition-colors duration-100`}
                            style={{ width: `${progressPercent}%` }}
                        ></div>
                        {/* Thumb (Only visible on hover via CSS) */}
                        <div
                            className={`absolute h-3 w-3 bg-white rounded-full shadow-md z-10 pointer-events-none transition-opacity duration-100 ${isHoveringSeek ? 'opacity-100' : 'opacity-0'}`}
                            style={{ left: `${progressPercent}%`, transform: 'translateX(-50%)' }}
                        ></div>
                    </div>
                    <span className="min-w-[40px]">{formatTime(duration)}</span>
                </div>
            </div>

            {/* Right: Volume & Extras */}
            <div className="flex items-center justify-end w-[30%] min-w-[180px] gap-x-3">
                <button className="text-[#b3b3b3] hover:text-white"><Mic2 size={16} /></button>
                <button className="text-[#b3b3b3] hover:text-white"><ListMusic size={16} /></button>
                <button className="text-[#b3b3b3] hover:text-white"><MonitorSpeaker size={16} /></button>
                <div className="flex items-center gap-x-2 w-32 group">
                    <Volume2 size={20} className="text-[#b3b3b3] group-hover:text-white" />
                    <div className="relative w-full h-[4px] rounded-full flex items-center">
                        <input
                            type="range"
                            min={0}
                            max={1}
                            step={0.01}
                            value={volume}
                            onChange={(e) => setVolume(Number(e.target.value))}
                            className="absolute w-full h-full opacity-0 cursor-pointer z-20"
                        />
                        <div className="absolute w-full h-full bg-[#4d4d4d] rounded-full z-0"></div>
                        <div
                            className="absolute h-full bg-white group-hover:bg-[#1ed760] rounded-full z-10 pointer-events-none"
                            style={{ width: `${volumePercent}%` }}
                        ></div>
                    </div>
                </div>
                <button className="text-[#b3b3b3] hover:text-white"><Maximize2 size={16} /></button>
            </div>

        </div>
    );
};

export default Player;
