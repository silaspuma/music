import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Clock, Headphones } from 'lucide-react';
import { getSongs } from '../services/musicService';
import { useNavigate } from 'react-router-dom';

const Stats = () => {
    const [stats, setStats] = useState({
        totalSongs: 0,
        totalPlays: 0,
        totalListeningTime: 0,
        topSongs: [],
        topArtists: [],
    });
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('all'); // all, month, week
    const navigate = useNavigate();

    useEffect(() => {
        loadStats();
    }, [timeRange]);

    const loadStats = async () => {
        try {
            const songs = await getSongs();
            
            // Calculate total stats
            const totalSongs = songs.length;
            const totalPlays = songs.reduce((sum, song) => sum + (song.playCount || 0), 0);
            const totalListeningTime = songs.reduce((sum, song) => {
                const plays = song.playCount || 0;
                const duration = song.duration || 0;
                return sum + (plays * duration);
            }, 0);

            // Top 10 songs by play count
            const topSongs = [...songs]
                .filter(s => s.playCount > 0)
                .sort((a, b) => (b.playCount || 0) - (a.playCount || 0))
                .slice(0, 10);

            // Top artists by total plays
            const artistMap = {};
            songs.forEach(song => {
                const artist = song.artist || 'Unknown';
                if (!artistMap[artist]) {
                    artistMap[artist] = { name: artist, plays: 0, songs: 0 };
                }
                artistMap[artist].plays += (song.playCount || 0);
                artistMap[artist].songs += 1;
            });

            const topArtists = Object.values(artistMap)
                .filter(a => a.plays > 0)
                .sort((a, b) => b.plays - a.plays)
                .slice(0, 10);

            setStats({
                totalSongs,
                totalPlays,
                totalListeningTime,
                topSongs,
                topArtists,
            });
        } catch (error) {
            console.error("Error loading stats:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDuration = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#1a1a1a] to-[#121212] pb-32">
            <div className="p-8">
                {/* Header */}
                <div className="flex items-end gap-6 mb-8">
                    <div className="w-56 h-56 bg-gradient-to-br from-purple-600 to-pink-600 rounded-md shadow-2xl flex items-center justify-center">
                        <BarChart3 size={96} className="text-white/80" />
                    </div>
                    <div className="flex flex-col justify-end pb-2">
                        <p className="text-sm font-bold">INSIGHTS</p>
                        <h1 className="text-7xl font-black my-4">Your Stats</h1>
                        <p className="text-sm text-[#b3b3b3] mt-2">
                            Your listening habits and favorites
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-[#b3b3b3]">Loading stats...</p>
                    </div>
                ) : (
                    <>
                        {/* Overview Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-[#1a1a1a] rounded-lg p-6 hover:bg-[#2a2a2a] transition">
                                <div className="flex items-center gap-3 mb-2">
                                    <Headphones className="text-[#1ed760]" size={24} />
                                    <h3 className="text-sm font-bold text-[#b3b3b3]">TOTAL PLAYS</h3>
                                </div>
                                <p className="text-4xl font-black">{stats.totalPlays.toLocaleString()}</p>
                            </div>

                            <div className="bg-[#1a1a1a] rounded-lg p-6 hover:bg-[#2a2a2a] transition">
                                <div className="flex items-center gap-3 mb-2">
                                    <Clock className="text-[#1ed760]" size={24} />
                                    <h3 className="text-sm font-bold text-[#b3b3b3]">LISTENING TIME</h3>
                                </div>
                                <p className="text-4xl font-black">{formatDuration(stats.totalListeningTime)}</p>
                            </div>

                            <div className="bg-[#1a1a1a] rounded-lg p-6 hover:bg-[#2a2a2a] transition">
                                <div className="flex items-center gap-3 mb-2">
                                    <TrendingUp className="text-[#1ed760]" size={24} />
                                    <h3 className="text-sm font-bold text-[#b3b3b3]">SONGS IN LIBRARY</h3>
                                </div>
                                <p className="text-4xl font-black">{stats.totalSongs}</p>
                            </div>
                        </div>

                        {/* Top Songs */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold mb-4">Top Songs</h2>
                            {stats.topSongs.length === 0 ? (
                                <p className="text-[#b3b3b3] text-center py-8">Start listening to see your top songs!</p>
                            ) : (
                                <div className="bg-[#1a1a1a] rounded-lg overflow-hidden">
                                    {stats.topSongs.map((song, index) => (
                                        <div 
                                            key={song.id}
                                            className="flex items-center gap-4 p-4 hover:bg-[#2a2a2a] transition cursor-pointer"
                                            onClick={() => navigate(`/library`)}
                                        >
                                            <span className="text-[#b3b3b3] text-lg font-bold w-8">{index + 1}</span>
                                            <img 
                                                src={song.imageUrl || 'https://via.placeholder.com/48'} 
                                                alt={song.title}
                                                className="w-12 h-12 rounded"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold truncate">{song.title}</p>
                                                <p className="text-sm text-[#b3b3b3] truncate">{song.artist}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-[#1ed760]">{song.playCount} plays</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Top Artists */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Top Artists</h2>
                            {stats.topArtists.length === 0 ? (
                                <p className="text-[#b3b3b3] text-center py-8">Start listening to see your top artists!</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {stats.topArtists.map((artist, index) => (
                                        <div 
                                            key={artist.name}
                                            className="bg-[#1a1a1a] rounded-lg p-4 hover:bg-[#2a2a2a] transition cursor-pointer flex items-center gap-4"
                                            onClick={() => navigate(`/artist/${encodeURIComponent(artist.name)}`)}
                                        >
                                            <span className="text-[#b3b3b3] text-xl font-bold w-8">{index + 1}</span>
                                            <div className="flex-1">
                                                <p className="font-bold text-lg">{artist.name}</p>
                                                <p className="text-sm text-[#b3b3b3]">{artist.plays} plays • {artist.songs} songs</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Stats;
