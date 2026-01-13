import React from 'react';
import { Trophy, Medal, Award } from 'lucide-react';

const Leaderboard = () => {
    // Placeholder until authentication is implemented
    const mockUsers = [
        { id: 1, username: 'MusicLover123', minutes: 2847, rank: 1 },
        { id: 2, username: 'JazzFan', minutes: 2456, rank: 2 },
        { id: 3, username: 'RockStar', minutes: 2201, rank: 3 },
        { id: 4, username: 'PopQueen', minutes: 1998, rank: 4 },
        { id: 5, username: 'IndieVibes', minutes: 1756, rank: 5 },
    ];

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

                {/* Auth Notice */}
                <div className="bg-[#181818] border-2 border-dashed border-[#ff6b1a] rounded-lg p-6 mb-8">
                    <h3 className="text-lg font-bold text-white mb-2">🔒 Coming Soon</h3>
                    <p className="text-sm text-[#a7a7a7]">
                        The leaderboard will be available once user accounts are implemented. 
                        Sign in to track your listening time and compete with others!
                    </p>
                </div>

                {/* Mock Leaderboard */}
                <div className="space-y-3">
                    {mockUsers.map((user) => (
                        <div
                            key={user.id}
                            className={`flex items-center gap-4 p-4 rounded-lg transition-colors ${
                                user.rank <= 3 ? getRankBadge(user.rank) : 'bg-[#181818] hover:bg-[#282828]'
                            }`}
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
                                </p>
                                <p className={`text-sm ${user.rank <= 3 ? 'text-white/80' : 'text-[#a7a7a7]'}`}>
                                    {user.minutes.toLocaleString()} minutes
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

                {/* Footer Note */}
                <div className="mt-8 text-center text-sm text-[#a7a7a7]">
                    <p>Preview data shown • Actual leaderboard requires authentication</p>
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
