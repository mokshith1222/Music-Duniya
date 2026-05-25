import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Tag, Globe } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import { useAsync } from '../hooks/useAsync';
import { getArtistDetails } from '../services/musicbrainzApi';
import LoadingSkeleton from '../components/LoadingSkeleton';
import AlbumCard from '../components/AlbumCard';
import { coverFallback } from '../assets/coverFallback';

export default function Artist() {
  const { id } = useParams();
  const { data: artist, loading, error } = useAsync(() => getArtistDetails(id), [id]);

  if (loading) {
    return (
      <div className="space-y-12">
        <div className="skeleton h-60 rounded-3xl" />
        <LoadingSkeleton type="album" count={8} />
      </div>
    );
  }

  if (error || !artist) {
    return <p className="text-center text-lg text-white/50">Artist details could not be loaded.</p>;
  }

  const imageUrl = coverFallback(artist.id); // Artists don't have a primary image, so we generate one

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

        <motion.div 
          layoutId={`artist-image-${artist.id}`}
          className="relative grid place-items-center size-48 md:size-60 rounded-full bg-gradient-to-br from-cyan-500/20 to-fuchsia-500/20 shadow-2xl border-2 border-white/10 flex-shrink-0"
        >
          <User size={80} className="text-white/50" />
        </motion.div>
        
        <div className="relative z-10 text-center md:text-left">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-200">{artist.type || 'Artist'}</p>
          <h1 className="mt-2 text-5xl md:text-7xl font-black text-white">{artist.name}</h1>
          <p className="mt-4 max-w-2xl text-white/60">{artist.disambiguation}</p>
          <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-4 text-sm">
            {artist.country && (
              <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
                <Globe size={14} />
                <span>{artist.country}</span>
              </div>
            )}
            {(artist.tags || []).slice(0, 4).map(tag => (
              <div key={tag.name} className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
                <Tag size={14} />
                <span className="capitalize">{tag.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section>
        <SectionHeader title="Releases" />
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 xl:grid-cols-6">
          {(artist.releases || []).map((album, i) => (
            <motion.div
              key={album.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <AlbumCard album={album} />
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
