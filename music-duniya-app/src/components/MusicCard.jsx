import { motion } from 'framer-motion'
import { Heart, ListPlus, Play } from 'lucide-react'
import { coverGradient } from '../assets/coverFallback'
import { usePlayer } from '../context/usePlayer'

export default function MusicCard({ track, tracks = [] }) {
  const { playTrack, addToQueue, toggleFavorite, favorites } = usePlayer()
  const isFavorite = favorites.some((item) => item.id === track.id)

  return (
    <motion.article
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="relative group rounded-[1.25rem] border border-white/5 bg-white/[0.02] p-2.5 backdrop-blur-md transition-all duration-500 hover:border-white/15 hover:bg-white/[0.04] hover:shadow-[0_20px_40px_rgba(0,0,0,0.4),0_0_20px_rgba(125,249,255,0.05)]"
    >
      {/* Background glow effect on hover */}
      <div className="absolute inset-0 -z-10 rounded-[1.25rem] bg-gradient-to-br from-cyan-400/0 via-fuchsia-400/0 to-amber-400/0 opacity-0 blur-xl transition-all duration-700 group-hover:from-cyan-400/10 group-hover:via-fuchsia-400/5 group-hover:opacity-100" />
      
      <div className="relative overflow-hidden rounded-xl bg-black/40">
        <img 
          src={track.cover || coverGradient} 
          alt="" 
          className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:brightness-110" 
          loading="lazy" 
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100 bg-black/20 backdrop-blur-[2px]">
          <motion.button
            whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(255,255,255,0.3)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => playTrack(track, tracks)}
            className="grid size-12 place-items-center rounded-full bg-white text-black shadow-xl"
            aria-label={`Play ${track.title}`}
          >
            <Play size={20} fill="currentColor" className="ml-1" />
          </motion.button>
        </div>
      </div>
      
      <div className="mt-3 px-1 min-w-0">
        <h3 className="line-clamp-1 text-sm font-bold text-white/90 group-hover:text-white transition-colors">{track.title}</h3>
        <p className="line-clamp-1 mt-0.5 text-[11px] font-medium text-white/40 group-hover:text-white/60 transition-colors">{track.artist}</p>
      </div>
      
      <div className="mt-3 flex gap-2 px-1 pb-0.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <button 
          onClick={() => toggleFavorite(track)} 
          className="grid size-8 place-items-center rounded-full bg-white/5 text-white/60 transition-colors hover:text-white hover:bg-white/10" 
          aria-label="Favorite"
        >
          <Heart size={14} fill={isFavorite ? 'currentColor' : 'none'} className={isFavorite ? 'text-coral' : ''} />
        </button>
        <button 
          onClick={() => addToQueue(track)} 
          className="grid size-8 place-items-center rounded-full bg-white/5 text-white/60 transition-colors hover:text-white hover:bg-white/10" 
          aria-label="Add to queue"
        >
          <ListPlus size={14} />
        </button>
      </div>
    </motion.article>
  )
}
