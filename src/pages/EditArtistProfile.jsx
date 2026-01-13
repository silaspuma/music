import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getOrCreateArtist, updateArtistProfile } from '../services/artistService';
import { getSongs } from '../services/musicService';
import { ArrowLeft, Save, User as UserIcon } from 'lucide-react';

const EditArtistProfile = () => {
    const { currentUser, userProfile } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [artistData, setArtistData] = useState(null);
    const [userArtistNames, setUserArtistNames] = useState([]);
    const [selectedArtist, setSelectedArtist] = useState('');
    const [formData, setFormData] = useState({
        displayName: '',
        bio: '',
        location: '',
        website: '',
        socialLinks: {
            instagram: '',
            twitter: '',
            youtube: '',
            spotify: ''
        }
    });

    useEffect(() => {
        if (!currentUser) {
            navigate('/');
            return;
        }
        loadUserArtists();
    }, [currentUser, navigate]);

    const loadUserArtists = async () => {
        setLoading(true);
        try {
            // Get all songs uploaded by this user
            const allSongs = await getSongs();
            const userSongs = allSongs.filter(s => s.uploadedBy === currentUser.uid);
            
            // Get unique artist names
            const artistNames = [...new Set(userSongs.map(s => s.artist))];
            setUserArtistNames(artistNames);
            
            if (artistNames.length > 0) {
                // Load first artist by default
                await selectArtist(artistNames[0]);
            }
        } catch (error) {
            console.error('Error loading artists:', error);
        }
        setLoading(false);
    };

    const selectArtist = async (artistName) => {
        setSelectedArtist(artistName);
        try {
            const artist = await getOrCreateArtist(artistName);
            setArtistData(artist);
            setFormData({
                displayName: artist.displayName || artistName,
                bio: artist.bio || '',
                location: artist.location || '',
                website: artist.website || '',
                socialLinks: {
                    instagram: artist.socialLinks?.instagram || '',
                    twitter: artist.socialLinks?.twitter || '',
                    youtube: artist.socialLinks?.youtube || '',
                    spotify: artist.socialLinks?.spotify || ''
                }
            });
        } catch (error) {
            console.error('Error loading artist:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const artistId = selectedArtist.toLowerCase().replace(/\s+/g, '-');
            await updateArtistProfile(artistId, formData);
            alert('Profile updated successfully!');
            navigate(`/artist/${encodeURIComponent(selectedArtist)}`);
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile');
        }
        setSaving(false);
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSocialChange = (platform, value) => {
        setFormData(prev => ({
            ...prev,
            socialLinks: { ...prev.socialLinks, [platform]: value }
        }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#121212]">
                <div className="text-[#a7a7a7]">Loading...</div>
            </div>
        );
    }

    if (userArtistNames.length === 0) {
        return (
            <div className="relative pb-32 bg-[#121212] min-h-full rounded-lg overflow-hidden">
                <div className="p-6 md:p-8">
                    <button onClick={() => navigate('/')} className="inline-flex items-center gap-2 text-[#b3b3b3] hover:text-white mb-6 transition-colors">
                        <ArrowLeft size={20} />
                        <span>Back</span>
                    </button>
                    <div className="py-12 text-center bg-[#181818] rounded-lg border-2 border-dashed border-[#282828]">
                        <UserIcon size={48} className="mx-auto mb-4 text-[#535353]" />
                        <p className="text-[#a7a7a7] mb-2">No artist profiles found</p>
                        <p className="text-sm text-[#535353]">Upload some songs first to create your artist profile</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative pb-32 bg-[#121212] min-h-full rounded-lg overflow-hidden">
            <div className="p-6 md:p-8">
                {/* Header */}
                <button onClick={() => navigate('/')} className="inline-flex items-center gap-2 text-[#b3b3b3] hover:text-white mb-6 transition-colors">
                    <ArrowLeft size={20} />
                    <span>Back</span>
                </button>

                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">Edit Artist Profile</h1>
                    <p className="text-[#b3b3b3]">Customize your artist information and social links</p>
                </div>

                {/* Artist Selector */}
                {userArtistNames.length > 1 && (
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-[#b3b3b3] mb-2">Select Artist Profile</label>
                        <select
                            value={selectedArtist}
                            onChange={(e) => selectArtist(e.target.value)}
                            className="w-full max-w-md bg-[#282828] border border-[#3a3a3a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#1ed760]"
                        >
                            {userArtistNames.map(name => (
                                <option key={name} value={name}>{name}</option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Edit Form */}
                <form onSubmit={handleSubmit} className="max-w-2xl">
                    <div className="bg-[#181818] rounded-lg p-6 space-y-6">
                        {/* Artist Name (Read-only) */}
                        <div>
                            <label className="block text-sm font-bold text-[#b3b3b3] mb-2">
                                Artist Name (Username)
                            </label>
                            <input
                                type="text"
                                value={selectedArtist}
                                disabled
                                className="w-full bg-[#282828] border border-[#3a3a3a] rounded-lg px-4 py-3 text-[#666] cursor-not-allowed"
                            />
                            <p className="text-xs text-[#666] mt-1">This cannot be changed</p>
                        </div>

                        {/* Display Name */}
                        <div>
                            <label className="block text-sm font-bold text-[#b3b3b3] mb-2">
                                Display Name
                            </label>
                            <input
                                type="text"
                                value={formData.displayName}
                                onChange={(e) => handleInputChange('displayName', e.target.value)}
                                placeholder="How you want to be displayed"
                                className="w-full bg-[#282828] border border-[#3a3a3a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#1ed760]"
                            />
                        </div>

                        {/* Bio */}
                        <div>
                            <label className="block text-sm font-bold text-[#b3b3b3] mb-2">
                                Bio
                            </label>
                            <textarea
                                value={formData.bio}
                                onChange={(e) => handleInputChange('bio', e.target.value)}
                                placeholder="Tell your fans about yourself..."
                                rows={4}
                                maxLength={500}
                                className="w-full bg-[#282828] border border-[#3a3a3a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#1ed760] resize-none"
                            />
                            <p className="text-xs text-[#666] mt-1">{formData.bio.length}/500 characters</p>
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-sm font-bold text-[#b3b3b3] mb-2">
                                Location
                            </label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => handleInputChange('location', e.target.value)}
                                placeholder="City, State/Country"
                                className="w-full bg-[#282828] border border-[#3a3a3a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#1ed760]"
                            />
                        </div>

                        {/* Website */}
                        <div>
                            <label className="block text-sm font-bold text-[#b3b3b3] mb-2">
                                Website
                            </label>
                            <input
                                type="url"
                                value={formData.website}
                                onChange={(e) => handleInputChange('website', e.target.value)}
                                placeholder="https://yourwebsite.com"
                                className="w-full bg-[#282828] border border-[#3a3a3a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#1ed760]"
                            />
                        </div>

                        {/* Social Links */}
                        <div>
                            <h3 className="text-lg font-bold text-white mb-4">Social Links</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-[#b3b3b3] mb-2">Instagram</label>
                                    <input
                                        type="text"
                                        value={formData.socialLinks.instagram}
                                        onChange={(e) => handleSocialChange('instagram', e.target.value)}
                                        placeholder="@username"
                                        className="w-full bg-[#282828] border border-[#3a3a3a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#1ed760]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-[#b3b3b3] mb-2">Twitter/X</label>
                                    <input
                                        type="text"
                                        value={formData.socialLinks.twitter}
                                        onChange={(e) => handleSocialChange('twitter', e.target.value)}
                                        placeholder="@username"
                                        className="w-full bg-[#282828] border border-[#3a3a3a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#1ed760]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-[#b3b3b3] mb-2">YouTube</label>
                                    <input
                                        type="text"
                                        value={formData.socialLinks.youtube}
                                        onChange={(e) => handleSocialChange('youtube', e.target.value)}
                                        placeholder="Channel URL"
                                        className="w-full bg-[#282828] border border-[#3a3a3a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#1ed760]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-[#b3b3b3] mb-2">Spotify</label>
                                    <input
                                        type="text"
                                        value={formData.socialLinks.spotify}
                                        onChange={(e) => handleSocialChange('spotify', e.target.value)}
                                        placeholder="Artist URL"
                                        className="w-full bg-[#282828] border border-[#3a3a3a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#1ed760]"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-6 flex gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="px-8 py-3 bg-[#282828] hover:bg-[#3a3a3a] text-white font-semibold rounded-full transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-8 py-3 bg-[#1ed760] hover:bg-[#1fdf64] text-black font-semibold rounded-full transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save size={20} />
                            {saving ? 'Saving...' : 'Save Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditArtistProfile;
