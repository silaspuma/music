import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Player from './components/Player';
import { PlayerProvider } from './contexts/PlayerContext';
import Home from './pages/Home';
import Search from './pages/Search';
import Library from './pages/Library';
import Artist from './pages/Artist';
import Album from './pages/Album';

function App() {
  return (
    <Router>
      <PlayerProvider>
        <div className="flex flex-col h-screen bg-black text-white">
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 bg-[#121212] overflow-y-auto m-2 rounded-lg relative no-scrollbar">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/library" element={<Library />} />
                <Route path="/artist/:name" element={<Artist />} />
                <Route path="/album/:name" element={<Album />} />
              </Routes>
            </div>
          </div>

          {/* Player Footer */}
          <Player />
        </div>
      </PlayerProvider>
    </Router>
  );
}

export default App;
