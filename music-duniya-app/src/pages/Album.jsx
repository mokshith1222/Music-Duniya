import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Music, Play, Tag } from 'lucide-react';
import { useAsync } from '../hooks/useAsync';
import { getAlbumDetails } from '../services/musicbrainzApi';
import { searchYouTubeSongs } from '../services/youtubeApi';
import { usePlayer } from '../context/usePlayer';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { coverFallback } from '../assets/coverFallback';

// Helper to format duration from ms to mm:ss
const formatDuration = (ms) => {
  if (!ms) return '?:??';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export default function Album() {
  const { id } = useParams();
  const { data: album, loading, error } = useAsync(() => getAlbumDetails(id), [id]);
  const { playTrack } = usePlayer();

  const handlePlaySong = async (song, allSongs) => {
    const artistName = song['artist-credit']?.[0]?.name || album['artist-credit']?.[0]?.name || 'Unknown';
    const youtubeQuery = `${song.title} ${artistName}`;
    const youtubeResults = await searchYouTubeSongs(youtubeQuery, 1);
    const youtubeTrack = youtubeResults[0];

    if (youtubeTrack) {
      const normalizedTrack = {
        id: song.id,
        title: song.title,
        artist: artistName,
        album: album.title,
        cover: album.coverArt || coverFallback(album.id),
        audio: `https://www.youtube.com/watch?v=${youtubeTrack.id}`,
        source: 'YouTube',
        videoId: youtubeTrack.id,
        raw: song,
      };
      
      const playlist = allSongs.map(s => ({...normalizedTrack, id: s.id, title: s.title}));
      playTrack(normalizedTrack, playlist);
    } else {
      console.error("Could not find a playable version for this song.");
    }
  };

  if (loading) {
    return (
      <div className="space-y-12">
        <div className="skeleton h-60 rounded-3xl" />
        <div className="space-y-2">
          {Array.from({ length: 10 }).map((_, i) => <div key={i} className="skeleton h-16 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (error || !album) {
    return <p className="text-center text-lg text-white/50">Album details could not be loaded.</p>;
  }

  const imageUrl = album.coverArt || coverFallback(album.id);
  const artistName = album['artist-credit']?.[0]?.name || 'Unknown Artist';
  const allTracks = album.media?.flatMap(m => m.tracks) || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-16 pb-24"
    >
      <section className="relative flex flex-col md:flex-row items-center gap-8 rounded-[2.5rem] bg-white/5 p-8 backdrop-blur-lg border border-white/10 overflow-hidden">
        <div 
          className="absolute inset-0 z-0 opacity-20"
          style={{ backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <motion.img
          layoutId={`album-cover-${album.id}`}
          src={imageUrl}
          alt={album.title}
          className="relative z-10 w-48 h-48 md:w-60 md:h-60 object-cover rounded-3xl shadow-2xl border-2 border-white/10 flex-shrink-0"
        />
        
        <div className="relative z-10 text-center md:text-left">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-200">{album['release-group']?.['primary-type'] || 'Album'}</p>
          <h1 className="mt-2 text-5xl md:text-7xl font-black text-white">{album.title}</h1>
          <p className="mt-4 text-xl font-bold text-white/80">{artistName}</p>
          <p className="text-sm text-white/60">{album.date?.split('-')[0]} · {allTracks.length} songs</p>
          <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-4 text-sm">
            {(album.tags || []).slice(0, 4).map(tag => (
              <div key={tag.name} className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
                <Tag size={14} />
                <span className="capitalize">{tag.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section>
        <div className="px-4 mb-4 grid grid-cols-[2rem_1fr_auto] md:grid-cols-[2rem_1fr_1fr_auto] gap-4 text-sm font-medium text-white/50 border-b border-white/10 pb-2">
          <span className="text-center">#</span>
          <span>Title</span>
          <span className="hidden md:block">Album</span>
          <Clock size={16} />
        </div>

        <div className="space-y-2">
          {allTracks.map((track, index) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              className="group grid grid-cols-[2rem_1fr_auto] md:grid-cols-[2rem_1fr_1fr_auto] items-center gap-4 p-3 rounded-2xl hover:bg-white/10 transition-colors"
            >
              <div className="relative flex items-center justify-center">
                <span className="text-white/50 group-hover:hidden">{index + 1}</span>
                <button onClick={() => handlePlaySong(track, allTracks)} className="absolute inset-0 grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play size={16} className="text-white" fill="currentColor" />
                </button>
              </div>
              <div>
                <p className="font-bold text-white">{track.title}</p>
                <p className="text-sm text-white/60 md:hidden">{artistName}</p>
              </div>
              <p className="hidden md:block text-white/60">{album.title}</p>
              <p className="text-sm text-white/50">{formatDuration(track.length)}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
