import React, { useState, useEffect } from 'react';
import { getSongs } from '../services/musicService';
import { getAllArtists, setArtistVerification, getOrCreateArtist, updateArtistStats } from '../services/artistService';
import { getArtistTotalPlays, formatPlayCount } from '../utils/playCount';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, ShieldCheck, Music, ArrowLeft, RefreshCw } from 'lucide-react';

const ManageArtists = () => {
    const [artists, setArtists] = useState([]);
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const { isAdmin } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAdmin()) {
            navigate('/');
            return;
        }
        fetchData();
    }, [isAdmin, navigate]);

    const fetchData = async () => {
        setLoading(true);
        const [allSongs, allArtists] = await Promise.all([
            getSongs(),
            getAllArtists()
        ]);
        setSongs(allSongs);
        setArtists(allArtists);
        setLoading(false);
    };

    const syncArtists = async () => {
        setSyncing(true);
        try {
            // Get unique artist names from songs
            const uniqueArtists = [...new Set(songs.map(s => s.artist))];
            
            // Create or update each artist
            for (const artistName of uniqueArtists) {
                await getOrCreateArtist(artistName);
                
                // Calculate stats
                const artistSongs = songs.filter(s => s.artist === artistName);
                const totalPlays = getArtistTotalPlays(artistSongs);
                await updateArtistStats(artistName, artistSongs.length, totalPlays);
            }
            
            // Refresh artists list
            const updatedArtists = await getAllArtists();
            setArtists(updatedArtists);
            alert('Artists synced successfully!');
        } catch (error) {
            console.error('Error syncing artists:', error);
            alert('Failed to sync artists');
        }
        setSyncing(false);
    };

    const toggleVerification = async (artistId, currentStatus) => {
        try {
            await setArtistVerification(artistId, !currentStatus);
            setArtists(artists.map(a => 
                a.id === artistId ? { ...a, verified: !currentStatus } : a
            ));
        } catch (error) {
            alert('Failed to update verification status');
        }
    };

    const getArtistStats = (artistName) => {
        const artistSongs = songs.filter(s => s.artist === artistName);
        const totalPlays = getArtistTotalPlays(artistSongs);
        return {
            songCount: artistSongs.length,
            totalPlays,
            imageUrl: artistSongs[0]?.imageUrl
        };
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#121212]">
                <div className="text-[#a7a7a7]">Loading artists...</div>
            </div>
        );
    }

    return (
        <div className="relative pb-32 bg-[#121212] min-h-full rounded-lg overflow-hidden">
            <div className="p-6 md:p-8">
                {/* Header */}
                <div className="mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 text-[#b3b3b3] hover:text-white mb-6 transition-colors">
                        <ArrowLeft size={20} />
                        <span>Back to Stream</span>
                    </Link>
                    
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">Manage Artists</h1>
                            <p className="text-[#b3b3b3]">Verify artists to give them a verified badge</p>
                        </div>
                        <button
                            onClick={syncArtists}
                            disabled={syncing}
                            className="bg-[#1ed760] text-black px-6 py-3 rounded-full font-semibold hover:scale-105 transition-transform flex items-center gap-2 disabled:opacity-50"
                        >
                            <RefreshCw size={20} className={syncing ? 'animate-spin' : ''} />
                            {syncing ? 'Syncing...' : 'Sync Artists'}
                        </button>
                    </div>

                    <div className="bg-[#181818] rounded-lg p-4 border border-[#282828]">
                        <p className="text-sm text-[#b3b3b3]">
                            <strong>Total Artists:</strong> {artists.length} | 
                            <strong className="ml-4">Verified:</strong> {artists.filter(a => a.verified).length}
                        </p>
                    </div>
                </div>

                {/* Artists List */}
                <div className="space-y-2">
                    {artists.length === 0 ? (
                        <div className="py-12 text-center bg-[#181818] rounded-lg border-2 border-dashed border-[#282828]">
                            <Music size={48} className="mx-auto mb-4 text-[#535353]" />
                            <p className="text-[#a7a7a7] mb-2">No artists found</p>
                            <p className="text-sm text-[#535353]">Click "Sync Artists" to create artist profiles from songs</p>
                        </div>
                    ) : (
                        artists.map((artist) => {
                            const stats = getArtistStats(artist.name);
                            return (
                                <div
                                    key={artist.id}
                                    className="flex items-center gap-4 p-4 bg-[#181818] hover:bg-[#282828] rounded-lg transition-all"
                                >
                                    {/* Artist Image */}
                                    <div className="w-16 h-16 bg-[#282828] rounded-full overflow-hidden flex-shrink-0">
                                        {stats.imageUrl ? (
                                            <img src={stats.imageUrl} alt={artist.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Music size={24} className="text-[#535353]" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Artist Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Link
                                                to={`/artist/${encodeURIComponent(artist.name)}`}
                                                className="text-lg font-semibold text-white hover:underline truncate"
                                            >
                                                {artist.name}
                                            </Link>
                                            {artist.verified && (
                                                <ShieldCheck size={20} className="text-[#3d91f4] flex-shrink-0" />
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-[#b3b3b3]">
                                            <span>{stats.songCount} songs</span>
                                            <span>•</span>
                                            <span>{formatPlayCount(stats.totalPlays)} plays</span>
                                        </div>
                                    </div>

                                    {/* Verification Toggle */}
                                    <button
                                        onClick={() => toggleVerification(artist.id, artist.verified)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all ${
                                            artist.verified
                                                ? 'bg-[#3d91f4] text-white hover:bg-[#5da3f5]'
                                                : 'bg-[#282828] text-[#b3b3b3] hover:bg-[#3a3a3a] hover:text-white'
                                        }`}
                                    >
                                        {artist.verified ? (
                                            <>
                                                <ShieldCheck size={18} />
                                                Verified
                                            </>
                                        ) : (
                                            <>
                                                <Shield size={18} />
                                                Verify
                                            </>
                                        )}
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageArtists;
