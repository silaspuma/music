import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Search, Library, PlusSquare, Heart, Music } from 'lucide-react';
import { createPlaylist, getPlaylists } from '../services/playlistService';

const Sidebar = () => {
    const [playlists, setPlaylists] = useState([]);
    const location = useLocation();

    useEffect(() => {
        fetchPlaylists();
    }, []);

    const fetchPlaylists = async () => {
        const data = await getPlaylists();
        setPlaylists(data);
    };

    const handleCreatePlaylist = async () => {
        const name = prompt("Enter playlist name:");
        if (name) {
            await createPlaylist(name);
            fetchPlaylists();
        }
    };

    return (
        <div className="w-[300px] bg-black h-full flex flex-col pt-6 pb-2 text-[#b3b3b3] gap-y-2 sticky top-0">
            {/* Logo Area */}
            <div className="text-white mb-6 px-6 flex items-center gap-2">
                <div className="bg-white text-black rounded-full p-1"><Music size={24} fill="currentColor" /></div>
                <h1 className="text-2xl font-bold tracking-tight">WebTunes</h1>
            </div>

            {/* Main Nav */}
            <div className="flex flex-col px-3">
                <NavItem to="/" icon={<Home size={28} />} label="Home" active={location.pathname === '/'} />
                <NavItem to="/search" icon={<Search size={28} />} label="Search" active={location.pathname === '/search'} />
                <NavItem to="/library" icon={<Library size={28} />} label="Your Library" active={location.pathname === '/library'} />
            </div>

            <div className="mt-6 pt-2 px-3 flex flex-col">
                <div className="mb-2">
                    <button
                        onClick={handleCreatePlaylist}
                        className="flex items-center gap-x-4 px-4 py-3 rounded-md hover:text-white transition-colors text-sm font-bold text-[#b3b3b3] w-full text-left group"
                    >
                        <div className="bg-[#b3b3b3] group-hover:bg-white transition-colors rounded-[2px] p-1 text-black">
                            <PlusSquare size={14} fill="currentColor" />
                        </div>
                        Create Playlist
                    </button>
                    <button className="flex items-center gap-x-4 px-4 py-3 rounded-md hover:text-white transition-colors text-sm font-bold text-[#b3b3b3] w-full text-left group">
                        <div className="bg-gradient-to-br from-[#450af5] to-[#c4efd9] rounded-[2px] p-1 text-white opacity-70 group-hover:opacity-100 transition-opacity">
                            <Heart size={14} fill="currentColor" />
                        </div>
                        Liked Songs
                    </button>
                </div>
            </div>

            <div className="mx-6 border-t border-[#282828] mb-2"></div>

            {/* Playlists Scroll Area */}
            <div className="flex-1 overflow-y-auto px-6 custom-scrollbar pb-8">
                <div className="flex flex-col gap-3">
                    {playlists.map(playlist => (
                        <div key={playlist.id} className="text-sm hover:text-white cursor-pointer truncate font-normal">
                            {playlist.name}
                        </div>
                    ))}
                    {/* Fake playlists for visual fill */}
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="text-sm hover:text-white cursor-pointer truncate font-normal opacity-0 animate-pulse">Loading...</div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const NavItem = ({ to, icon, label, active }) => (
    <NavLink
        to={to}
        className={`flex items-center gap-x-4 px-4 py-3 rounded-md transition-all font-bold text-md ${active ? 'text-white' : 'text-[#b3b3b3] hover:text-white'
            }`}
    >
        {React.cloneElement(icon, {
            fill: active ? "currentColor" : "none", // Apple/Spotify style: filled when active
            strokeWidth: active ? 0 : 2
        })}
        <span>{label}</span>
    </NavLink>
);

export default Sidebar;
