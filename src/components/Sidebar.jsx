import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Search, Library, Heart, Settings, LogIn, Users, Trophy } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

const Sidebar = ({ onNavigate }) => {
    const [showAuthModal, setShowAuthModal] = useState(false);
    const location = useLocation();
    const { currentUser, userProfile, logout, isAdmin } = useAuth();

    return (
        <div className="w-[320px] bg-[#000000e6] h-full flex flex-col pt-6 pb-3 text-[#b3b3b3] gap-y-3 sticky top-0 border-r border-[#181818]">
            {/* Logo Area */}
            <div className="text-white mb-6 px-6 flex items-center gap-3">
                <div className="relative h-10 w-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center shadow-lg">
                    <span className="text-2xl">🐆</span>
                </div>
                <h1 className="text-2xl font-black tracking-tight">Pumafy</h1>
            </div>

            {/* Main Nav */}
            <div className="flex flex-col px-3 gap-1">
                <NavItem to="/" icon={<Library size={26} />} label="All Songs" onNavigate={onNavigate} />
                <NavItem to="/search" icon={<Search size={26} />} label="Search" onNavigate={onNavigate} />
                <NavItem to="/leaderboard" icon={<Trophy size={26} />} label="Leaderboard" onNavigate={onNavigate} />
            </div>

            <div className="mt-4 pt-1 px-3 flex flex-col">
                <div className="mb-2">
                    <NavItem 
                        to="/liked" 
                        icon={<div className="bg-gradient-to-br from-[#ff6b1a] to-[#ff8c42] rounded-[3px] p-1 text-white"><Heart size={14} fill="currentColor" /></div>} 
                        label="Liked Songs"
                        onNavigate={onNavigate} 
                    />
                    <NavItem 
                        to="/settings" 
                        icon={<div className="bg-[#b3b3b3] rounded-[3px] p-1 text-black"><Settings size={14} /></div>} 
                        label="Settings"
                        onNavigate={onNavigate} 
                    />
                    {isAdmin() && (
                        <NavItem 
                            to="/currently-playing" 
                            icon={<div className="bg-gradient-to-br from-green-600 to-green-700 rounded-[3px] p-1 text-white"><Users size={14} /></div>} 
                            label="Currently Playing"
                            onNavigate={onNavigate} 
                        />
                    )}
                </div>
            </div>

            <div className="mx-6 border-t border-[#282828] mb-1"></div>

            {/* User Profile / Login Section */}
            <div className="px-6 pb-3">
                {currentUser ? (
                    <div className="flex items-center gap-3 p-3 bg-[#181818] rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center font-bold text-white flex-shrink-0">
                            {userProfile?.username?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">{userProfile?.username || 'User'}</p>
                            <p className="text-xs text-[#a7a7a7]">{Number(userProfile?.listeningMinutes || 0).toFixed(2)} min listened</p>
                        </div>
                        <button
                            onClick={logout}
                            className="text-[#a7a7a7] hover:text-white transition-colors"
                            title="Log out"
                        >
                            <LogIn size={18} className="rotate-180" />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setShowAuthModal(true)}
                        className="w-full flex items-center gap-3 p-3 bg-[#181818] hover:bg-[#282828] rounded-lg transition-colors"
                    >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ff6b1a] to-[#ff8c42] flex items-center justify-center flex-shrink-0">
                            <LogIn size={20} className="text-white" />
                        </div>
                        <div className="flex-1 text-left">
                            <p className="text-sm font-bold text-white">Log in</p>
                            <p className="text-xs text-[#a7a7a7]">Track your stats</p>
                        </div>
                    </button>
                )}
            </div>

            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
        </div>
    );
};

const NavItem = ({ to, icon, label, onNavigate }) => (
    <NavLink
        to={to}
        onClick={() => onNavigate?.()}
        className={({ isActive: isNavActive }) => `relative flex items-center gap-x-4 px-4 py-3 rounded-md transition-all font-bold text-md ${isNavActive ? 'text-white' : 'text-[#b3b3b3] hover:text-white'}`}
    >
        {({ isActive: isNavActive }) => (
            <>
                {isNavActive && <span className="absolute left-0 h-7 w-[3px] rounded-full bg-white" aria-hidden />}
                {React.cloneElement(icon, {
                    fill: isNavActive ? "currentColor" : "none", // Apple/Spotify style: filled when active
                    strokeWidth: isNavActive ? 0 : 2
                })}
                <span>{label}</span>
            </>
        )}
    </NavLink>
);

export default Sidebar;
