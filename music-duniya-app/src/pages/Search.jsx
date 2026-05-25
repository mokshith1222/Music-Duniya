import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { Disc3, Flame, Music, Sparkles, User } from 'lucide-react';
import LoadingSkeleton from '../components/LoadingSkeleton';
import MusicCard from '../components/MusicCard';
import AlbumCard from '../components/AlbumCard';
import SearchBar from '../components/SearchBar';
import SectionHeader from '../components/SectionHeader';
import { useAsync } from '../hooks/useAsync';
import { searchArtists, searchAlbums, searchSongs } from '../services/musicbrainzApi';
import { searchYouTubeSongs } from '../services/youtubeApi';
import { usePlayer } from '../context/usePlayer';

const categories = [
  { name: 'Telugu Mass', color: 'from-orange-500/20 to-transparent' },
  { name: 'Hindi Hits', color: 'from-rose-500/20 to-transparent' },
  { name: 'English Pop', color: 'from-blue-500/20 to-transparent' },
  { name: 'Anime OST', color: 'from-fuchsia-500/20 to-transparent' },
  { name: 'Lofi Chill', color: 'from-cyan-500/20 to-transparent' },
  { name: 'EDM Drops', color: 'from-emerald-500/20 to-transparent' },
];

// Normalization function for MusicBrainz song to be used by the player
const normalizeMbSongForPlayer = async (mbSong) => {
  if (!mbSong) return null;
  const artistName = mbSong['artist-credit']?.[0]?.name || 'Unknown Artist';
  const youtubeQuery = `${mbSong.title} ${artistName}`;
  const youtubeResults = await searchYouTubeSongs(youtubeQuery, 1);
  const youtubeTrack = youtubeResults[0];

  return {
    id: mbSong.id,
    title: mbSong.title,
    artist: artistName,
    album: mbSong.releases?.[0]?.title || 'Single',
    cover: mbSong.coverArt,
    // The audio URL needs to be handled differently for YouTube
    // We store the videoId and source to be handled by the player component
    audio: `https://www.youtube.com/watch?v=${youtubeTrack?.id}`,
    source: 'YouTube',
    videoId: youtubeTrack?.id,
    raw: mbSong,
  };
};


export default function Search() {
  const [params, setParams] = useSearchParams();
  const query = params.get('q');
  const { playTrack } = usePlayer();

  const { data: artists, loading: artistsLoading } = useAsync(() => query ? searchArtists(query, 8) : [], [query], []);
  const { data: albums, loading: albumsLoading } = useAsync(() => query ? searchAlbums(query, 6) : [], [query], []);
  const { data: songs, loading: songsLoading } = useAsync(() => query ? searchSongs(query, 12) : [], [query], []);

  const handleCategoryClick = (cat) => {
    setParams({ q: cat });
  };

  const handlePlaySong = async (song) => {
    const fullTrack = await normalizeMbSongForPlayer(song);
    if (fullTrack) {
      playTrack(fullTrack, [fullTrack]); // Player expects a playlist
    } else {
      // Handle case where no YouTube video was found
      console.error("Could not find a playable version for this song.");
    }
  };

  const isLoading = artistsLoading || albumsLoading || songsLoading;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-16 pb-32 pt-8"
    >
      {/* Search Header */}
      <section className="relative z-20 flex flex-col items-center justify-center space-y-8 text-center pt-8 pb-12">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-3xl"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-200/20 bg-cyan-200/5 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-cyan-200 backdrop-blur-md">
            <Sparkles size={14} /> Neural Search Engine
          </div>
          <h1 className="mb-10 text-4xl font-black text-white md:text-6xl">What's your frequency?</h1>

          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-full bg-cyan-400/20 blur-3xl" />
            <SearchBar initial={query || ''} />
          </div>
        </motion.div>
      </section>

      {/* Categories Grid */}
      {!query && (
        <section>
          <SectionHeader kicker="Explore" title="Dimensions" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {categories.map((cat, i) => (
              <motion.button
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCategoryClick(cat.name)}
                className={`relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br ${cat.color} p-6 text-left backdrop-blur-md transition-colors hover:border-white/20 hover:bg-white/10`}
              >
                <div className="absolute -right-4 -top-4 opacity-10">
                  <Disc3 size={100} />
                </div>
                <h3 className="relative z-10 text-lg font-black text-white">{cat.name}</h3>
              </motion.button>
            ))}
          </div>
        </section>
      )}

      {/* Results */}
      {query && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-16"
        >
          <div className="flex items-center gap-3 mb-8">
            <SectionHeader kicker="Signals acquired" title={`Results for "${query}"`} />
            {isLoading && <div className="size-5 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />}
          </div>

          {/* Songs Section */}
          <section>
            <SectionHeader icon={<Music />} title="Song Matches" />
            {songsLoading ? (
              <LoadingSkeleton type="music" count={12} />
            ) : songs && songs.length > 0 ? (
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 xl:grid-cols-6">
                {songs.map((song, i) => (
                  <motion.div
                    key={song.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    {/* We pass a handler to MusicCard to deal with the async normalization */}
                    <MusicCard track={song} onPlay={() => handlePlaySong(song)} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex h-40 flex-col items-center justify-center rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-md">
                <p className="text-lg font-bold text-white/50">No songs found.</p>
              </div>
            )}
          </section>

          {/* Albums Section */}
          <section>
            <SectionHeader icon={<Disc3 />} title="Album Matches" />
            {albumsLoading ? (
              <LoadingSkeleton type="album" count={6} />
            ) : albums && albums.length > 0 ? (
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 xl:grid-cols-6">
                {albums.map((album, i) => (
                  <motion.div
                    key={album.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <AlbumCard album={album} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex h-40 flex-col items-center justify-center rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-md">
                <p className="text-lg font-bold text-white/50">No albums found.</p>
              </div>
            )}
          </section>

          {/* Artists Section */}
          <section>
            <SectionHeader icon={<User />} title="Artist Matches" />
            {artistsLoading ? (
              <LoadingSkeleton type="artist" count={8} />
            ) : artists && artists.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {artists.map((artist, i) => (
                  <motion.div
                    key={artist.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link to={`/artist/${artist.id}`} className="group relative flex items-center gap-4 overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-4 backdrop-blur-md transition-all hover:bg-white/10 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                      <div className="grid size-16 place-items-center rounded-full bg-gradient-to-br from-cyan-400/20 to-fuchsia-400/20 text-white shadow-inner group-hover:from-cyan-400/40 group-hover:to-fuchsia-400/40">
                        <Flame size={24} />
                      </div>
                      <div>
                        <p className="font-black text-lg text-white group-hover:text-cyan-200 transition-colors">{artist.name}</p>
                        <p className="text-xs font-medium uppercase tracking-wider text-white/40">{artist.country || artist.type || 'Artist'}</p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex h-40 flex-col items-center justify-center rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-md">
                <p className="text-lg font-bold text-white/50">No artists found.</p>
              </div>
            )}
          </section>
        </motion.div>
      )}
    </motion.div>
  );
}
    </motion.div>
  )
}
