import { useEffect, useState } from 'react'
import { Heart, ListMusic, Mic2, Pause, Play, SkipForward, Volume2, Expand } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { coverGradient } from '../assets/coverFallback'
import { usePlayer } from '../context/usePlayer'
import LyricsModal from './LyricsModal'
import MusicUniverseMode from './MusicUniverseMode'

export default function Player() {
  const { audioRef, currentTrack, isPlaying, setIsPlaying, togglePlay, playNext, playPrev, queue, toggleFavorite, favorites } = usePlayer()
  const [showLyrics, setShowLyrics] = useState(false)
  const [isUniverseMode, setIsUniverseMode] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack?.audio) return
    audio.src = currentTrack.audio
    if (isPlaying) audio.play().catch(() => setIsPlaying(false))
  }, [currentTrack])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack?.audio) return
    if (isPlaying) audio.play().catch(() => setIsPlaying(false))
    else audio.pause()
  }, [isPlaying, currentTrack])

  const isFavorite = currentTrack && favorites.some((item) => item.id === currentTrack.id)

  return (
    <>
      <AnimatePresence>
        {!isUniverseMode && (
          <motion.footer 
            layoutId="player-container"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-4 left-0 right-0 z-50 px-4 flex justify-center"
          >
            <motion.div 
              whileHover={{ scale: 1.01 }}
              onClick={(e) => {
                if (e.target.closest('button')) return;
                setIsUniverseMode(true);
              }}
              className="glass-orbit relative flex w-full max-w-3xl items-center gap-4 rounded-full p-2 pr-4 shadow-[0_20px_60px_rgba(0,0,0,0.6)] cursor-pointer group overflow-hidden"
            >
              {/* Dynamic pulse background when playing */}
              {isPlaying && (
                <motion.div 
                  layoutId="player-progress"
                  animate={{ opacity: [0.1, 0.2, 0.1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-fuchsia-400/20 pointer-events-none"
                />
              )}

              <div className="flex min-w-0 flex-1 items-center gap-3">
                <motion.img 
                  layoutId="player-cover"
                  src={currentTrack?.cover || coverGradient} 
                  alt="" 
                  className={`size-12 rounded-full object-cover shadow-[0_0_20px_rgba(125,249,255,0.15)] ${isPlaying ? 'animate-[spin_10s_linear_infinite]' : ''}`} 
                />
                <div className="min-w-0">
                  <motion.p layoutId="player-title" className="line-clamp-1 text-sm font-bold text-white group-hover:text-cyan-200 transition-colors">
                    {currentTrack?.title || 'Choose a track'}
                  </motion.p>
                  <motion.p layoutId="player-artist" className="line-clamp-1 text-xs text-muted">
                    {currentTrack?.artist || 'Music Duniya radio is standing by'}
                  </motion.p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="hidden h-8 items-end gap-1 px-4 md:flex" aria-hidden="true">
                  {[12, 24, 16, 28, 14, 22].map((height, index) => (
                    <span 
                      key={height + index} 
                      className={`w-1 rounded-full bg-gradient-to-t from-cyan-400 to-fuchsia-400 transition-all ${isPlaying ? 'animate-[wavePulse_1s_ease-in-out_infinite]' : 'opacity-30'}`} 
                      style={{ height: isPlaying ? height : 6, animationDelay: `${index * 0.1}s` }} 
                    />
                  ))}
                </div>
                
                {currentTrack && (
                  <button onClick={(e) => { e.stopPropagation(); toggleFavorite(currentTrack); }} className="p-2 text-slate-300 hover:text-coral transition-colors">
                    <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
                  </button>
                )}
                <button 
                  onClick={(e) => { e.stopPropagation(); togglePlay(); }} 
                  className="grid size-10 place-items-center rounded-full bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform" 
                  aria-label="Play or pause"
                >
                  {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); playNext(); }} 
                  className="p-2 text-slate-300 hover:text-white transition-colors" 
                  aria-label="Next"
                >
                  <SkipForward size={18} />
                </button>
                <button 
                  onClick={() => setIsUniverseMode(true)}
                  className="p-2 text-slate-400 hover:text-white ml-2 transition-colors opacity-0 group-hover:opacity-100 hidden sm:block"
                >
                  <Expand size={16} />
                </button>
              </div>
            </motion.div>
          </motion.footer>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isUniverseMode && (
          <MusicUniverseMode 
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            togglePlay={togglePlay}
            playNext={playNext}
            playPrev={playPrev}
            onClose={() => setIsUniverseMode(false)}
            isFavorite={isFavorite}
            toggleFavorite={toggleFavorite}
          />
        )}
      </AnimatePresence>

      <audio ref={audioRef} onEnded={playNext} />
      {showLyrics && currentTrack && <LyricsModal track={currentTrack} onClose={() => setShowLyrics(false)} />}
    </>
  )
}
