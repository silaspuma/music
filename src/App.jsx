import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Player from './components/Player';
import InstallPWA from './components/InstallPWA';
import { PlayerProvider } from './contexts/PlayerContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import Search from './pages/Search';
import Library from './pages/Library';
import Artist from './pages/Artist';
import Album from './pages/Album';
import Playlist from './pages/Playlist';
import LikedSongs from './pages/LikedSongs';
import Leaderboard from './pages/Leaderboard';
import Settings from './pages/Settings';
import { Menu, X } from 'lucide-react';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <PlayerProvider>
          <div className="flex flex-col h-screen bg-black text-white">
            <div className="flex flex-1 overflow-hidden relative">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden absolute top-4 left-4 z-50 p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar - Slide out on mobile */}
            <div
              className={`fixed lg:relative w-[320px] h-full bg-[#000000e6] lg:bg-black transform transition-transform duration-300 z-40 lg:z-0 ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
              }`}
            >
              <Sidebar onNavigate={() => setSidebarOpen(false)} />
            </div>

            {/* Overlay on mobile when sidebar is open */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 bg-black/50 lg:hidden z-30"
                onClick={() => setSidebarOpen(false)}
              ></div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 bg-[#121212] overflow-y-auto m-2 lg:m-2 rounded-lg relative no-scrollbar">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/library" element={<Library />} />
                <Route path="/liked" element={<LikedSongs />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/artist/:name" element={<Artist />} />
                <Route path="/album/:name" element={<Album />} />
                <Route path="/playlist/:id" element={<Playlist />} />
              </Routes>
            </div>
          </div>

          {/* Player Footer */}
          <Player />
          
          {/* PWA Install Prompt */}
          <InstallPWA />
        </div>
      </PlayerProvider>
      </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
