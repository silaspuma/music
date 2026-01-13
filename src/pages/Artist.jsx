import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSongs } from '../services/musicService';
import { getOrCreateArtist } from '../services/artistService';
import { getArtistTotalPlays, formatPlayCount } from '../utils/playCount';
import { useAuth } from '../contexts/AuthContext';
import SongRow from '../components/SongRow';
import { usePlayer } from '../contexts/PlayerContext';
import { Play, Shuffle, Edit, Globe, Instagram, Twitter, Youtube, Music2 } from 'lucide-react';

const Artist = () => {
    const { name } = useParams();
    const [songs, setSongs] = useState([]);
    const [totalPlays, setTotalPlays] = useState(0);
    const [artistData, setArtistData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [canEdit, setCanEdit] = useState(false);
    const { playQueue } = usePlayer();
    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchArtistSongs = async () => {
            setLoading(true);
            const allSongs = await getSongs();
            const decodedName = decodeURIComponent(name);
            const artistSongs = allSongs.filter(s => s.artist === decodedName);
            
            // Sort by play count (most popular first)
            const sortedSongs = artistSongs.sort((a, b) => (b.playCount || 0) - (a.playCount || 0));
            setSongs(sortedSongs);
            
            // Calculate total plays
            const plays = getArtistTotalPlays(sortedSongs);
            setTotalPlays(plays);
            
            // Get artist data (including verification status)
            const artist = await getOrCreateArtist(decodedName);
            setArtistData(artist);
            
            // Check if current user can edit (has uploaded songs as this artist)
            if (currentUser) {
                const userUploadedAsArtist = artistSongs.some(s => s.uploadedBy === currentUser.uid);
                setCanEdit(userUploadedAsArtist);
            }
            
            setLoading(false);
        };
        fetchArtistSongs();
    }, [name, currentUser]);

    const handlePlayAll = () => {
        if (songs.length > 0) {
            playQueue(songs, 0);
        }
    };

    const handleShuffle = () => {
        if (songs.length > 0) {
            const shuffled = [...songs].sort(() => Math.random() - 0.5);
            playQueue(shuffled, 0);
        }
    };

    if (loading) return <div className="p-8 text-[#b3b3b3]">Loading...</div>;

    const artistImage = songs.length > 0 ? songs[0].imageUrl : null;

    return (
        <div className="relative pb-32 bg-[#121212] min-h-full rounded-lg overflow-hidden">

            {/* Header Image / Gradient */}
            <div className="relative h-[200px] sm:h-[250px] md:h-[300px] w-full bg-gradient-to-b from-[#535353] to-[#121212] flex items-end p-4 sm:p-6 md:p-8">
                {artistImage && (
                    <div className="absolute inset-0 z-0 opacity-30">
                        <img src={artistImage} alt="" className="w-full h-full object-cover blur-3xl" />
                    </div>
                )}

                <div className="relative z-10 flex flex-col gap-y-2 sm:gap-y-3 md:gap-y-4">
                    {artistData?.verified && (
                        <span className="flex items-center gap-2 text-xs font-bold tracking-widest text-white uppercase">
                            <span className="bg-[#3d91f4] text-white p-[2px] rounded-full inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6">
                                <svg role="img" height="12" width="12" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path>
                                </svg>
                            </span>
                            Verified Artist
                        </span>
                    )}
                    <h1 className="text-4xl sm:text-6xl md:text-[96px] font-black tracking-tighter text-white leading-none mb-1 sm:mb-2 drop-shadow-lg">
                        {artistData?.displayName || decodeURIComponent(name)}
                    </h1>
                    <div className="text-sm sm:text-md font-medium text-white drop-shadow-md">
                        <span>{formatPlayCount(totalPlays)} total plays</span>
                    </div>
                </div>
            </div>

            <div className="relative z-10 p-4 sm:p-6 md:p-8 pt-4 md:pt-6 bg-gradient-to-b from-[#121212]/20 to-[#121212]">
                {/* Bio Section */}
                {(artistData?.bio || artistData?.location || canEdit) && (
                    <div className="mb-8 bg-[#181818] rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                            <h2 className="text-xl font-bold text-white">About</h2>
                            {canEdit && (
                                <Link
                                    to="/edit-artist-profile"
                                    className="flex items-center gap-2 text-sm bg-[#282828] hover:bg-[#3a3a3a] px-4 py-2 rounded-full transition-colors"
                                >
                                    <Edit size={16} />
                                    Edit Profile
                                </Link>
                            )}
                        </div>
                        {artistData?.bio && (
                            <p className="text-[#b3b3b3] mb-4 whitespace-pre-wrap">{artistData.bio}</p>
                        )}
                        {artistData?.location && (
                            <p className="text-sm text-[#b3b3b3] mb-4">📍 {artistData.location}</p>
                        )}
                        {/* Social Links */}
                        {(artistData?.website || artistData?.socialLinks?.instagram || artistData?.socialLinks?.twitter || 
                          artistData?.socialLinks?.youtube || artistData?.socialLinks?.spotify) && (
                            <div className="flex flex-wrap gap-3 mt-4">
                                {artistData.website && (
                                    <a
                                        href={artistData.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 bg-[#282828] hover:bg-[#3a3a3a] px-4 py-2 rounded-full text-sm transition-colors"
                                    >
                                        <Globe size={16} />
                                        Website
                                    </a>
                                )}
                                {artistData.socialLinks?.instagram && (
                                    <a
                                        href={`https://instagram.com/${artistData.socialLinks.instagram.replace('@', '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 bg-[#282828] hover:bg-[#3a3a3a] px-4 py-2 rounded-full text-sm transition-colors"
                                    >
                                        <Instagram size={16} />
                                        Instagram
                                    </a>
                                )}
                                {artistData.socialLinks?.twitter && (
                                    <a
                                        href={`https://twitter.com/${artistData.socialLinks.twitter.replace('@', '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 bg-[#282828] hover:bg-[#3a3a3a] px-4 py-2 rounded-full text-sm transition-colors"
                                    >
                                        <Twitter size={16} />
                                        Twitter
                                    </a>
                                )}
                                {artistData.socialLinks?.youtube && (
                                    <a
                                        href={artistData.socialLinks.youtube}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 bg-[#282828] hover:bg-[#3a3a3a] px-4 py-2 rounded-full text-sm transition-colors"
                                    >
                                        <Youtube size={16} />
                                        YouTube
                                    </a>
                                )}
                                {artistData.socialLinks?.spotify && (
                                    <a
                                        href={artistData.socialLinks.spotify}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 bg-[#282828] hover:bg-[#3a3a3a] px-4 py-2 rounded-full text-sm transition-colors"
                                    >
                                        <Music2 size={16} />
                                        Spotify
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                )}

                <div className="mb-8 flex items-center gap-4">{canEdit && !artistData?.bio && !artistData?.location && (
                    <Link
                        to="/edit-artist-profile"
                        className="flex items-center gap-2 text-sm bg-[#282828] hover:bg-[#3a3a3a] px-4 py-2 rounded-full transition-colors"
                    >
                        <Edit size={16} />
                        Edit Profile
                    </Link>
                )}
                    <button onClick={handlePlayAll} className="bg-[#ff6b1a] text-black rounded-full p-[14px] hover:scale-105 active:scale-100 transition-transform shadow-lg hover:bg-[#ff8c42]">
                        <Play fill="currentColor" size={28} />
                    </button>
                    <button onClick={handleShuffle} className="text-[#b3b3b3] hover:text-white hover:scale-105 transition-all">
                        <Shuffle size={32} />
                    </button>
                </div>

                <h2 className="text-2xl font-bold mb-4 text-white">Popular</h2>
                <div className="flex flex-col">
                    {songs.map((song, index) => (
                        <SongRow
                            key={song.id}
                            song={song}
                            index={index}
                            onPlay={(_s, i) => playQueue(songs, i)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Artist;
