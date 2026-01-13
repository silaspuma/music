import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award } from 'lucide-react';
import { getLeaderboard } from '../services/userService';
import { useAuth } from '../contexts/AuthContext';

const Leaderboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();

    useEffect(() => {
        loadLeaderboard();
    }, []);

    const loadLeaderboard = async () => {
        try {
            setLoading(true);
            const leaderboardData = await getLeaderboard(50);
            setUsers(leaderboardData);
        } catch (error) {
            console.error('Error loading leaderboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const getRankIcon = (rank) => {
        switch (rank) {
            case 1:
                return <Trophy className="text-yellow-400" size={24} />;
            case 2:
                return <Medal className="text-gray-400" size={24} />;
            case 3:
                return <Award className="text-orange-600" size={24} />;
            default:
                return <span className="text-[#a7a7a7] font-bold text-lg w-6 text-center">{rank}</span>;
        }
    };

    const getRankBadge = (rank) => {
        switch (rank) {
            case 1:
                return 'bg-gradient-to-r from-yellow-500 to-yellow-600';
            case 2:
                return 'bg-gradient-to-r from-gray-400 to-gray-500';
            case 3:
                return 'bg-gradient-to-r from-orange-500 to-orange-600';
            default:
                return 'bg-[#282828]';
        }
    };

    return (
        <div className="relative pb-32 bg-[#121212] min-h-full rounded-lg overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute top-0 left-0 w-full h-[280px] bg-gradient-to-b from-[#ff6b1a] to-[#121212] z-0 pointer-events-none"></div>

            <div className="relative z-10 p-4 sm:p-6 md:p-8">
                <div className="flex items-center gap-4 mb-8">
                    <div className="bg-gradient-to-br from-[#ff6b1a] to-[#ff8c42] p-4 rounded-lg shadow-xl">
                        <Trophy size={48} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold mb-2 tracking-tight">Leaderboard</h1>
                        <p className="text-sm text-[#b3b3b3]">Top listeners by total minutes streamed</p>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-[#b3b3b3]">Loading leaderboard...</p>
                    </div>
                ) : users.length === 0 ? (
                    <div className="bg-[#181818] border-2 border-dashed border-[#ff6b1a] rounded-lg p-6 mb-8">
                        <h3 className="text-lg font-bold text-white mb-2">🎵 Start Listening!</h3>
                        <p className="text-sm text-[#a7a7a7]">
                            No listening data yet. Sign in and start playing music to appear on the leaderboard!
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Leaderboard */}
                        <div className="space-y-3">
                            {users.map((user) => (
                                <div
                                    key={user.id}
                                    className={`flex items-center gap-4 p-4 rounded-lg transition-colors ${
                                        user.rank <= 3 ? getRankBadge(user.rank) : 'bg-[#181818] hover:bg-[#282828]'
                                    } ${currentUser?.uid === user.id ? 'ring-2 ring-[#1ed760]' : ''}`}
                                >
                                    {/* Rank */}
                                    <div className="flex items-center justify-center w-10">
                                        {getRankIcon(user.rank)}
                                    </div>

                                    {/* Avatar Placeholder */}
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center font-bold text-white text-lg flex-shrink-0">
                                        {user.username[0].toUpperCase()}
                                    </div>

                                    {/* Username */}
                                    <div className="flex-1 min-w-0">
                                        <p className={`font-bold truncate ${user.rank <= 3 ? 'text-white' : 'text-white'}`}>
                                            {user.username}
                                            {currentUser?.uid === user.id && (
                                                <span className="ml-2 text-xs text-[#1ed760]">(You)</span>
                                            )}
                                        </p>
                                        <p className={`text-sm ${user.rank <= 3 ? 'text-white/80' : 'text-[#a7a7a7]'}`}>
                                            {Math.round(user.listeningMinutes).toLocaleString()} minutes
                                        </p>
                                    </div>

                                    {/* Badge for top 3 */}
                                    {user.rank <= 3 && (
                                        <div className="text-xs font-bold text-white/90 bg-white/20 px-3 py-1 rounded-full">
                                            TOP {user.rank}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;
