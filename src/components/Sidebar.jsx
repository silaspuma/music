import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Search, Library, PlusSquare, Heart, Music, Clock, BarChart3, Settings } from 'lucide-react';
import { createPlaylist, getPlaylists } from '../services/playlistService';

const Sidebar = ({ onNavigate }) => {
    const [playlists, setPlaylists] = useState([]);
    const [playlistError, setPlaylistError] = useState(false);
    const location = useLocation();

    useEffect(() => {
        fetchPlaylists();
    }, []);

    const fetchPlaylists = async () => {
        try {
            const data = await getPlaylists();
            setPlaylists(data);
            setPlaylistError(false);
        } catch (error) {
            console.error('Failed to load playlists:', error);
            setPlaylistError(true);
            setPlaylists([]);
        }
    };

    const handleCreatePlaylist = async () => {
        const name = prompt("Enter playlist name:");
        if (name) {
            const description = prompt("Enter playlist description (optional):") || '';
            await createPlaylist(name, description);
            fetchPlaylists();
        }
    };

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
                <NavItem to="/" icon={<Home size={26} />} label="Home" active={location.pathname === '/'} onNavigate={onNavigate} />
                <NavItem to="/search" icon={<Search size={26} />} label="Search" active={location.pathname === '/search'} onNavigate={onNavigate} />
                <NavItem to="/library" icon={<Library size={26} />} label="Your Library" active={location.pathname === '/library'} onNavigate={onNavigate} />
            </div>

            <div className="mt-4 pt-1 px-3 flex flex-col">
                <div className="mb-2">
                    <button
                        onClick={handleCreatePlaylist}
                        className="flex items-center gap-x-4 px-4 py-3 rounded-md hover:text-white transition-colors text-sm font-bold text-[#b3b3b3] w-full text-left group"
                    >
                        <div className="bg-[#b3b3b3] group-hover:bg-white transition-colors rounded-[3px] p-1 text-black">
                            <PlusSquare size={14} fill="currentColor" />
                        </div>
                        Create Playlist
                    </button>
                    <NavItem 
                        to="/liked" 
                        icon={<div className="bg-gradient-to-br from-[#450af5] to-[#c4efd9] rounded-[3px] p-1 text-white"><Heart size={14} fill="currentColor" /></div>} 
                        label="Liked Songs" 
                        active={location.pathname === '/liked'} 
                        onNavigate={onNavigate} 
                    />
                    <NavItem 
                        to="/recently-played" 
                        icon={<div className="bg-[#b3b3b3] rounded-[3px] p-1 text-black"><Clock size={14} /></div>} 
                        label="Recently Played" 
                        active={location.pathname === '/recently-played'} 
                        onNavigate={onNavigate} 
                    />
                    <NavItem 
                        to="/stats" 
                        icon={<div className="bg-[#b3b3b3] rounded-[3px] p-1 text-black"><BarChart3 size={14} /></div>} 
                        label="Your Stats" 
                        active={location.pathname === '/stats'} 
                        onNavigate={onNavigate} 
                    />
                    <NavItem 
                        to="/settings" 
                        icon={<div className="bg-[#b3b3b3] rounded-[3px] p-1 text-black"><Settings size={14} /></div>} 
                        label="Settings" 
                        active={location.pathname === '/settings'} 
                        onNavigate={onNavigate} 
                    />
                </div>
            </div>

            <div className="mx-6 border-t border-[#282828] mb-1"></div>

            {/* Playlists Scroll Area */}
            <div className="flex-1 overflow-y-auto px-6 custom-scrollbar pb-8">
                <div className="flex flex-col gap-3">
                    {playlistError ? (
                        <div className="text-xs text-[#a7a7a7] italic">Unable to load playlists</div>
                    ) : playlists.length === 0 ? (
                        <div className="text-xs text-[#727272] italic">No playlists yet</div>
                    ) : (
                        playlists.map(playlist => (
                            <NavLink
                                key={playlist.id}
                                to={`/playlist/${playlist.id}`}
                                onClick={() => onNavigate?.()}
                                className={({ isActive }) => `text-sm hover:text-white cursor-pointer truncate font-normal block py-1 ${isActive ? 'text-white' : 'text-[#b3b3b3]'}`}
                            >
                                {playlist.name}
                            </NavLink>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

const NavItem = ({ to, icon, label, active, onNavigate }) => (
    <NavLink
        to={to}
        onClick={() => onNavigate?.()}
        className={`relative flex items-center gap-x-4 px-4 py-3 rounded-md transition-all font-bold text-md ${active ? 'text-white' : 'text-[#b3b3b3] hover:text-white'} `}
    >
        {active && <span className="absolute left-0 h-7 w-[3px] rounded-full bg-white" aria-hidden />}
        {React.cloneElement(icon, {
            fill: active ? "currentColor" : "none", // Apple/Spotify style: filled when active
            strokeWidth: active ? 0 : 2
        })}
        <span>{label}</span>
    </NavLink>
);

export default Sidebar;
