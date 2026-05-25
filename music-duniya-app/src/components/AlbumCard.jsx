import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Disc3, Music } from 'lucide-react';
import { coverFallback } from '../assets/coverFallback';

export default function AlbumCard({ album }) {
  const imageUrl = album.coverArt || coverFallback(album.id);
  const artistName = album['artist-credit']?.[0]?.name || 'Unknown Artist';

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      className="group relative"
    >
      <Link to={`/album/${album.id}`} className="block space-y-3">
        <div className="relative aspect-square w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-lg transition-all group-hover:shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
          <img
            src={imageUrl}
            alt={album.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-4 left-4">
            <h3 className="font-black text-lg text-white drop-shadow-md">{album.title}</h3>
          </div>
          <div className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-black/30 backdrop-blur-md transition-colors group-hover:bg-cyan-500">
            <Disc3 size={20} className="text-white" />
          </div>
        </div>
        <div className="px-2">
          <p className="truncate font-bold text-white/90">{album.title}</p>
          <p className="text-sm text-white/50">{artistName}</p>
        </div>
      </Link>
    </motion.div>
  );
}
