import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSongs } from '../services/musicService';
import SongRow from '../components/SongRow';
import { usePlayer } from '../contexts/PlayerContext';
import { Play } from 'lucide-react';
// import ColorThief from 'colorthief' // We would use this for dynamic colors in full implementation

const Artist = () => {
    const { name } = useParams();
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { playSong } = usePlayer();

    useEffect(() => {
        const fetchArtistSongs = async () => {
            setLoading(true);
            const allSongs = await getSongs();
            const decodedName = decodeURIComponent(name);
            const artistSongs = allSongs.filter(s => s.artist === decodedName);
            setSongs(artistSongs);
            setLoading(false);
        };
        fetchArtistSongs();
    }, [name]);

    const handlePlayAll = () => {
        if (songs.length > 0) {
            playSong(songs[0]);
        }
    };

    if (loading) return <div className="p-8 text-[#b3b3b3]">Loading...</div>;

    const artistImage = songs.length > 0 ? songs[0].imageUrl : null;

    return (
        <div className="relative pb-32 bg-[#121212] min-h-full rounded-lg overflow-hidden">

            {/* Header Image / Gradient */}
            <div className="relative h-[300px] w-full bg-gradient-to-b from-[#535353] to-[#121212] flex items-end p-8">
                {artistImage && (
                    <div className="absolute inset-0 z-0 opacity-30">
                        <img src={artistImage} alt="" className="w-full h-full object-cover blur-3xl" />
                    </div>
                )}

                <div className="relative z-10 flex flex-col gap-y-4">
                    <span className="flex items-center gap-2 text-sm font-bold tracking-widest text-white uppercase"><span className="bg-[#3d91f4] text-white p-[2px] rounded-full inline-flex items-center justify-center w-6 h-6"><svg role="img" height="12" width="12" viewBox="0 0 16 16" fill="currentColor"><path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path></svg></span>Verified Artist</span>
                    <h1 className="text-[96px] font-black tracking-tighter text-white leading-none mb-2 drop-shadow-lg">{decodeURIComponent(name)}</h1>
                    <div className="text-md font-medium text-white drop-shadow-md">
                        <span>{songs.length.toLocaleString()} monthly listeners (fake)</span>
                    </div>
                </div>
            </div>

            <div className="relative z-10 p-8 pt-6 bg-gradient-to-b from-[#121212]/20 to-[#121212]">
                <div className="mb-8">
                    <button onClick={handlePlayAll} className="bg-[#1ed760] text-black rounded-full p-[14px] hover:scale-105 active:scale-100 transition-transform shadow-lg hover:bg-[#3be477]">
                        <Play fill="currentColor" size={28} />
                    </button>
                    <button className="ml-8 text-white text-sm font-bold border border-[#727272] hover:border-white rounded-[4px] px-4 py-1.5 uppercase tracking-widest transition-colors">Follow</button>
                </div>

                <h2 className="text-2xl font-bold mb-4 text-white">Popular</h2>
                <div className="flex flex-col">
                    {songs.map((song, index) => (
                        <SongRow
                            key={song.id}
                            song={song}
                            index={index}
                            onPlay={(s) => playSong(s)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Artist;
