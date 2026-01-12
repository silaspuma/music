import React from 'react';
import { usePlayer } from '../contexts/PlayerContext';
import { X, GripVertical, Play } from 'lucide-react';

const QueueView = ({ isOpen, onClose }) => {
    const { queue, currentIndex, currentSong, playSong, removeFromQueue, clearQueue, reorderQueue } = usePlayer();

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/50 z-40"
                onClick={onClose}
            ></div>

            {/* Slide-in Panel */}
            <div className="fixed right-0 top-0 bottom-0 w-[400px] bg-[#181818] z-50 shadow-2xl flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-[#282828] flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">Queue</h2>
                    <button 
                        onClick={onClose}
                        className="text-[#b3b3b3] hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Currently Playing */}
                {currentSong && (
                    <div className="p-4 border-b border-[#282828]">
                        <span className="text-xs font-bold text-[#b3b3b3] uppercase tracking-wider">Now Playing</span>
                        <div className="flex items-center gap-3 mt-2 bg-[#2a2a2a] p-3 rounded-lg">
                            {currentSong.imageUrl ? (
                                <img src={currentSong.imageUrl} alt="" className="h-12 w-12 rounded" />
                            ) : (
                                <div className="h-12 w-12 bg-[#333] rounded flex items-center justify-center">
                                    <span className="text-xs text-gray-500">♪</span>
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-white truncate">{currentSong.title}</div>
                                <div className="text-xs text-[#b3b3b3] truncate">{currentSong.artist}</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Next Up */}
                <div className="flex-1 overflow-y-auto p-4">
                    {queue.length > currentIndex + 1 ? (
                        <>
                            <span className="text-xs font-bold text-[#b3b3b3] uppercase tracking-wider mb-3 block">Next Up ({queue.length - currentIndex - 1})</span>
                            <div className="flex flex-col gap-1">
                                {queue.slice(currentIndex + 1).map((song, idx) => (
                                    <div 
                                        key={`${song.id}-${idx}`}
                                        className="group flex items-center gap-3 p-2 rounded hover:bg-[#2a2a2a] cursor-pointer"
                                        onClick={() => playSong(song)}
                                    >
                                        <button className="text-[#b3b3b3] opacity-0 group-hover:opacity-100 transition-opacity">
                                            <GripVertical size={16} />
                                        </button>
                                        {song.imageUrl ? (
                                            <img src={song.imageUrl} alt="" className="h-10 w-10 rounded" />
                                        ) : (
                                            <div className="h-10 w-10 bg-[#333] rounded flex items-center justify-center flex-shrink-0">
                                                <span className="text-xs text-gray-500">♪</span>
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm text-white truncate">{song.title}</div>
                                            <div className="text-xs text-[#b3b3b3] truncate">{song.artist}</div>
                                        </div>
                                        <button 
                                            className="text-[#b3b3b3] hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeFromQueue?.(currentIndex + 1 + idx);
                                            }}
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center text-[#b3b3b3] py-10">
                            <div className="text-4xl mb-2">🎵</div>
                            <p>Queue is empty</p>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                {queue.length > 0 && (
                    <div className="p-4 border-t border-[#282828]">
                        <button 
                            onClick={clearQueue}
                            className="w-full py-2 text-sm font-bold text-white bg-transparent border border-[#727272] rounded-full hover:border-white transition-colors"
                        >
                            Clear Queue
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default QueueView;
