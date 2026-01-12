import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Library, PlusSquare, Heart } from 'lucide-react';
import { createPlaylist, getPlaylists } from '../services/playlistService';

const Sidebar = () => {
    const [playlists, setPlaylists] = useState([]);

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
        <div className="w-64 bg-black h-full flex flex-col p-6 text-gray-400 gap-y-4">
            {/* Logo Area */}
            <div className="text-white mb-4 px-2">
                <h1 className="text-2xl font-bold tracking-tighter">WebTunes</h1>
            </div>

            {/* Main Nav */}
            <div className="flex flex-col gap-y-2">
                <NavItem to="/" icon={<Home size={24} />} label="Home" />
                <NavItem to="/search" icon={<Search size={24} />} label="Search" />
                <NavItem to="/library" icon={<Library size={24} />} label="Your Library" />
            </div>

            <div className="mt-6 border-t border-[#282828] pt-4 flex flex-col gap-y-2">
                <button
                    onClick={handleCreatePlaylist}
                    className="flex items-center gap-x-4 px-2 py-2 hover:text-white transition-colors text-sm font-semibold text-gray-400 w-full text-left"
                >
                    <div className="bg-gray-300 rounded-sm p-1 text-black">
                        <PlusSquare size={16} fill="currentColor" />
                    </div>
                    Create Playlist
                </button>
                <button className="flex items-center gap-x-4 px-2 py-2 hover:text-white transition-colors text-sm font-semibold text-gray-400">
                    <div className="bg-gradient-to-br from-indigo-700 to-blue-300 rounded-sm p-1 text-white opacity-70">
                        <Heart size={16} fill="currentColor" />
                    </div>
                    Liked Songs
                </button>
            </div>

            {/* Playlists Scroll Area */}
            <div className="flex-1 overflow-y-auto mt-2 border-t border-[#282828] pt-4 custom-scrollbar">
                {playlists.map(playlist => (
                    <div key={playlist.id} className="px-2 py-1 text-sm hover:text-white cursor-pointer truncate">
                        {playlist.name}
                    </div>
                ))}
            </div>
        </div>
    );
};

const NavItem = ({ to, icon, label }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `flex items-center gap-x-4 px-2 py-2 rounded-md transition-all font-semibold ${isActive ? 'text-white' : 'hover:text-white'
            }`
        }
    >
        {icon}
        <span>{label}</span>
    </NavLink>
);

export default Sidebar;
