import { useState } from 'react';
import { Settings as SettingsIcon, Palette, Download, Upload } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { getSongs } from '../services/musicService';
import { getPlaylists } from '../services/playlistService';
import CustomThemeModal from '../components/CustomThemeModal';

const Settings = () => {
    const { currentTheme, setCurrentTheme, themes, customTheme, saveCustomTheme } = useTheme();
    const [exportStatus, setExportStatus] = useState('');
    const [showCustomThemeModal, setShowCustomThemeModal] = useState(false);

    const handleExportData = async () => {
        try {
            setExportStatus('Exporting...');
            const songs = await getSongs();
            const playlists = await getPlaylists();
            
            const exportData = {
                version: '1.0',
                exportDate: new Date().toISOString(),
                songs: songs.map(s => ({
                    id: s.id,
                    title: s.title,
                    artist: s.artist,
                    album: s.album,
                    duration: s.duration,
                    imageUrl: s.imageUrl,
                    url: s.url,
                    playCount: s.playCount || 0,
                })),
                playlists: playlists.map(p => ({
                    id: p.id,
                    name: p.name,
                    description: p.description,
                    coverUrl: p.coverUrl,
                    songs: p.songs || [],
                })),
            };

            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `music-library-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
            
            setExportStatus('Exported successfully!');
            setTimeout(() => setExportStatus(''), 3000);
        } catch (error) {
            console.error('Export failed:', error);
            setExportStatus('Export failed');
            setTimeout(() => setExportStatus(''), 3000);
        }
    };

    const handleImportData = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.onchange = async (e) => {
            try {
                const file = e.target.files[0];
                if (!file) return;

                const text = await file.text();
                const data = JSON.parse(text);
                
                console.log('Import data:', data);
                alert(`Import successful!\n\nFound:\n- ${data.songs?.length || 0} songs\n- ${data.playlists?.length || 0} playlists\n\nNote: Import functionality requires Firebase write operations which would need to be implemented.`);
            } catch (error) {
                console.error('Import failed:', error);
                alert('Import failed: ' + error.message);
            }
        };
        input.click();
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#2a2a2a] to-[#121212] pb-32">
            <div className="p-8">
                {/* Header */}
                <div className="flex items-end gap-6 mb-8">
                    <div className="w-56 h-56 bg-gradient-to-br from-gray-600 to-gray-800 rounded-md shadow-2xl flex items-center justify-center">
                        <SettingsIcon size={96} className="text-white/80" />
                    </div>
                    <div className="flex flex-col justify-end pb-2">
                        <p className="text-sm font-bold">PREFERENCES</p>
                        <h1 className="text-7xl font-black my-4">Settings</h1>
                        <p className="text-sm text-[#b3b3b3] mt-2">
                            Customize your music experience
                        </p>
                    </div>
                </div>

                {/* Theme Settings */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Palette className="text-[#1ed760]" size={24} />
                        <h2 className="text-2xl font-bold">Theme</h2>
                    </div>
                    <div className="bg-[#1a1a1a] rounded-lg p-6">
                        <p className="text-[#b3b3b3] mb-4">Choose your preferred color scheme</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Object.keys(themes).map((themeKey) => {
                                const theme = themes[themeKey];
                                const isActive = currentTheme === themeKey;
                                return (
                                    <button
                                        key={themeKey}
                                        onClick={() => setCurrentTheme(themeKey)}
                                        className={`p-4 rounded-lg border-2 transition-all ${
                                            isActive 
                                                ? 'border-[#1ed760] bg-[#2a2a2a]' 
                                                : 'border-[#3a3a3a] hover:border-[#5a5a5a] bg-[#181818]'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3 mb-3">
                                            <div 
                                                className="w-12 h-12 rounded-full"
                                                style={{ background: theme.primary }}
                                            ></div>
                                            <div className="text-left">
                                                <p className="font-bold">{theme.name}</p>
                                                {isActive && (
                                                    <p className="text-xs text-[#1ed760]">Active</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <div 
                                                className="flex-1 h-8 rounded" 
                                                style={{ background: theme.bg }}
                                            ></div>
                                            <div 
                                                className="flex-1 h-8 rounded" 
                                                style={{ background: theme.bgLight }}
                                            ></div>
                                            <div 
                                                className="flex-1 h-8 rounded" 
                                                style={{ background: theme.bgLighter }}
                                            ></div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                        <button
                            onClick={() => setShowCustomThemeModal(true)}
                            className="mt-6 bg-gradient-to-r from-[#1ed760] to-[#1aa34a] hover:from-[#1fdf64] hover:to-[#1bb350] text-black font-bold py-2 px-6 rounded-full transition flex items-center gap-2"
                        >
                            <Palette size={16} />
                            Create Custom Theme
                        </button>
                        {customTheme && (
                            <div className="mt-4 p-3 bg-[#2a2a2a] rounded-lg">
                                <p className="text-sm text-[#b3b3b3]">
                                    Custom theme active: <span className="text-[#1ed760] font-bold">{customTheme.name}</span>
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Data Management */}
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <Download className="text-[#1ed760]" size={24} />
                        <h2 className="text-2xl font-bold">Data Management</h2>
                    </div>
                    <div className="bg-[#1a1a1a] rounded-lg p-6">
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-bold mb-2">Export Library</h3>
                                <p className="text-sm text-[#b3b3b3] mb-3">
                                    Download your songs and playlists as a JSON file. This includes metadata but not the actual audio files.
                                </p>
                                <button
                                    onClick={handleExportData}
                                    className="bg-[#1ed760] hover:bg-[#1fdf64] text-black font-bold py-2 px-4 rounded-full transition flex items-center gap-2"
                                >
                                    <Download size={16} />
                                    Export Data
                                </button>
                                {exportStatus && (
                                    <p className="text-sm text-[#1ed760] mt-2">{exportStatus}</p>
                                )}
                            </div>

                            <div className="border-t border-[#282828] pt-4">
                                <h3 className="font-bold mb-2">Import Library</h3>
                                <p className="text-sm text-[#b3b3b3] mb-3">
                                    Import a previously exported library file. Note: This will display the data but won't upload to our servers!
                                </p>
                                <button
                                    onClick={handleImportData}
                                    className="bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white font-bold py-2 px-4 rounded-full transition flex items-center gap-2"
                                >
                                    <Upload size={16} />
                                    Import Data
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* About Pumafy */}
                <div className="mt-8">
                    <h2 className="text-2xl font-bold mb-4">About Pumafy</h2>
                    <div className="bg-[#1a1a1a] rounded-lg p-6">
                        <div className="flex items-start gap-4">
                            <div className="text-5xl">🐆</div>
                            <div>
                                <h3 className="font-bold text-lg mb-2">Community Music Library</h3>
                                <p className="text-[#b3b3b3] mb-3">
                                    Pumafy is a community music library you can access from anywhere. 
                                    Upload your personal music collection, create playlists, track your listening habits, 
                                    and enjoy a beautiful, feature-rich music player.
                                </p>
                                <p className="text-sm text-[#b3b3b3]">
                                    Version 1.1.2 • Made with ❤️ by silas
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Custom Theme Modal */}
                {showCustomThemeModal && (
                    <CustomThemeModal
                        onClose={() => setShowCustomThemeModal(false)}
                        onSave={(theme) => {
                            saveCustomTheme(theme);
                            setShowCustomThemeModal(false);
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default Settings;
