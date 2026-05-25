import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BrainCircuit, Disc3, Play, Radar, Sparkles } from 'lucide-react';
import { useRef } from 'react';
import LoadingSkeleton from '../components/LoadingSkeleton';
import AlbumCard from '../components/AlbumCard';
import ArtistCard from '../components/ArtistCard';
import SectionHeader from '../components/SectionHeader';
import { usePlayer } from '../context/usePlayer';
import { useAsync } from '../hooks/useAsync';
import { getNewReleases, searchArtistsByGenre } from '../services/musicbrainzApi';
import { searchYouTubeSongs } from '../services/youtubeApi';
import { coverFallback } from '../assets/coverFallback';

const aiCards = [
  ['Neural Mix', 'A live taste model tuned to your recent plays.', 'from-cyan-400/10 to-transparent', 'shadow-[0_0_30px_rgba(34,211,238,0.1)]'],
  ['Mood Radar', 'Detects late-night focus, city walks, and high-energy sessions.', 'from-fuchsia-400/10 to-transparent', 'shadow-[0_0_30px_rgba(232,121,249,0.1)]'],
  ['Duniya Flow', 'Blends indie, radio, and underground signals into one stream.', 'from-amber-300/10 to-transparent', 'shadow-[0_0_30px_rgba(252,211,77,0.1)]'],
];

export default function Home() {
  const { playTrack } = usePlayer();
  const newReleases = useAsync(() => getNewReleases(6), [], []);
  const popArtists = useAsync(() => searchArtistsByGenre('pop', 6), [], []);
  const electronicArtists = useAsync(() => searchArtistsByGenre('electronic', 6), [], []);

  const handlePlayAlbum = async (album) => {
    // To play an album, we'll find the first song on YouTube and play it.
    // A more robust implementation would fetch album details first.
    const artistName = album['artist-credit']?.[0]?.name || 'Unknown';
    const youtubeQuery = `${album.title} ${artistName}`;
    const youtubeResults = await searchYouTubeSongs(youtubeQuery, 1);
    const youtubeTrack = youtubeResults[0];

    if (youtubeTrack) {
      const normalizedTrack = {
        id: album.id,
        title: youtubeTrack.title,
        artist: artistName,
        album: album.title,
        cover: album.coverArt || coverFallback(album.id),
        audio: `https://www.youtube.com/watch?v=${youtubeTrack.id}`,
        source: 'YouTube',
        videoId: youtubeTrack.id,
        raw: album,
      };
      playTrack(normalizedTrack, [normalizedTrack]);
    }
  };
  
  const heroAlbum = newReleases.data?.[0];

  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacityParallax = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  return (
    <div className="space-y-24 pb-20 pt-4" ref={ref}>
      <section className="relative grid min-h-[55vh] gap-12 lg:grid-cols-[1fr_0.8fr] lg:items-center">
        
        {/* Left Side: Hero Text */}
        <motion.div 
          style={{ y: yParallax, opacity: opacityParallax }}
          className="relative z-10"
        >
          <motion.div 
            initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }} 
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} 
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-white/80 shadow-[0_0_20px_rgba(255,255,255,0.05)] backdrop-blur-md"
          >
            <Sparkles size={12} className="text-cyan-300" /> Duniya OS v2.0
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl text-4xl font-black leading-[1.1] tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-white/60 md:text-5xl lg:text-6xl"
          >
            Music that feels alive.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-xl text-base leading-relaxed text-white/60 font-medium"
          >
            Experience a cinematic universe of sound. Duniya maps your emotional state, curates the unseen, and visualizes the rhythm of your life in real-time.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <motion.button 
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.9)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => heroAlbum && handlePlayAlbum(heroAlbum)} 
              className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-8 text-xs font-bold uppercase tracking-widest text-black shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all"
            >
              <Play size={16} fill="currentColor" /> Enter Universe
            </motion.button>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link to="/search" className="inline-flex h-12 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 text-xs font-bold uppercase tracking-widest text-white/80 backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/20 hover:text-white">
                <Radar size={16} /> Explore Signals
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right Side: Hero Card */}
        <motion.div 
          style={{ y: yParallax, opacity: opacityParallax }}
          className="relative hidden lg:block"
        >
          {heroAlbum ? (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
              <AlbumCard album={heroAlbum} isHero />
            </motion.div>
          ) : (
            <div className="aspect-[3/4] w-full rounded-[2.5rem] skeleton" />
          )}
        </motion.div>
      </section>

      <section>
        <SectionHeader title="New Releases" link="/search?q=new" />
        {newReleases.loading ? <LoadingSkeleton type="album" count={6} /> : (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 xl:grid-cols-6">
            {newReleases.data.map((album, i) => (
              <motion.div key={album.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <AlbumCard album={album} />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <section>
        <SectionHeader title="Top Pop Artists" link="/search?q=pop" />
        {popArtists.loading ? <LoadingSkeleton type="artist" count={6} /> : (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 xl:grid-cols-6">
            {popArtists.data.map((artist, i) => (
              <motion.div key={artist.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <ArtistCard artist={artist} />
              </motion.div>
            ))}
          </div>
        )}
      </section>
      
      <section>
        <SectionHeader title="Electronic Scene" link="/search?q=electronic" />
        {electronicArtists.loading ? <LoadingSkeleton type="artist" count={6} /> : (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 xl:grid-cols-6">
            {electronicArtists.data.map((artist, i) => (
              <motion.div key={artist.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <ArtistCard artist={artist} />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <section className="relative">
        <SectionHeader title="AI Curated" />
        <div className="grid gap-8 md:grid-cols-3">
          {aiCards.map(([title, desc, gradient, shadow], i) => (
            <motion.div 
              key={title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-3xl p-8 bg-gradient-to-br ${gradient} border border-white/10 ${shadow}`}
            >
              <div className="mb-4 grid place-items-center size-12 rounded-full bg-white/10 border border-white/10">
                {i === 0 && <BrainCircuit className="text-cyan-300" />}
                {i === 1 && <Radar className="text-fuchsia-300" />}
                {i === 2 && <Disc3 className="text-amber-300" />}
              </div>
              <h3 className="font-bold text-lg text-white">{title}</h3>
              <p className="mt-1 text-sm text-white/60">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
