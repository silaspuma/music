import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Player from './components/Player';
import InstallPWA from './components/InstallPWA';
import { PlayerProvider } from './contexts/PlayerContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Search from './pages/Search';
import Library from './pages/Library';
import Artist from './pages/Artist';
import Album from './pages/Album';
import LikedSongs from './pages/LikedSongs';
import User from './pages/User';
import ManageArtists from './pages/ManageArtists';
import EditArtistProfile from './pages/EditArtistProfile';
import { Menu, X } from 'lucide-react';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser } = useAuth();

  // Show landing page for non-logged-in users
  if (!currentUser) {
    return <Landing />;
  }

  return (
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
              <Route path="/artist/:name" element={<Artist />} />
              <Route path="/album/:name" element={<Album />} />
              <Route path="/user/:username" element={<User />} />
              <Route path="/manage-artists" element={<ManageArtists />} />
              <Route path="/edit-artist-profile" element={<EditArtistProfile />} />
            </Routes>
          </div>
        </div>

        {/* Player Footer */}
        <Player />
        
        {/* PWA Install Prompt */}
        <InstallPWA />
      </div>
    </PlayerProvider>
  );
}

export default App;
