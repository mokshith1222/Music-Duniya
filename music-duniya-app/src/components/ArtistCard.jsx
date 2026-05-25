import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';
import { coverFallback } from '../assets/coverFallback';

export default function ArtistCard({ artist }) {
  // Artists don't have images from MusicBrainz, so we generate a fallback gradient
  const imageUrl = coverFallback(artist.id);

  return (
    <Link to={`/artist/${artist.id}`}>
      <motion.div 
        className="group relative aspect-[3/4] rounded-3xl overflow-hidden"
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-110"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-5">
          <div className="grid place-items-center size-16 rounded-full bg-white/10 backdrop-blur-md border border-white/10 mb-3">
            <User className="text-white/70" size={32} />
          </div>
          <h3 className="font-bold text-xl text-white">{artist.name}</h3>
          <p className="text-sm text-white/60 capitalize">{artist.type || 'Artist'}</p>
        </div>
      </motion.div>
    </Link>
  );
}
