import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Disc3, Heart, ListMusic, Mic2, Pause, Play, SkipBack, SkipForward, Volume2 } from 'lucide-react'
import { coverGradient } from '../assets/coverFallback'
import { useEffect, useState } from 'react'
import { usePlayer } from '../context/usePlayer'

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function MusicUniverseMode({ 
  currentTrack, 
  isPlaying, 
  togglePlay, 
  playNext, 
  playPrev, 
  onClose,
  isFavorite,
  toggleFavorite
}) {
  const { audioRef } = usePlayer()
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const audio = audioRef?.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    
    // Set initial values
    setCurrentTime(audio.currentTime)
    setDuration(audio.duration || 0)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
    }
  }, [audioRef])

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <motion.div 
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-[100] flex flex-col overflow-hidden bg-black selection:bg-white/20"
    >
      {/* Dynamic Ambient Background */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          animate={{
            scale: [1, 1.1, 1],
            opacity: isPlaying ? [0.3, 0.5, 0.3] : 0.2,
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-cover bg-center blur-[120px] saturate-200"
          style={{ backgroundImage: `url(${currentTrack?.cover || coverGradient})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-[#020308] opacity-80" />
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-6">
        <button 
          onClick={onClose}
          className="grid size-12 place-items-center rounded-full bg-white/5 backdrop-blur-md transition hover:bg-white/15"
        >
          <ChevronDown size={24} className="text-white" />
        </button>
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">Playing from Universe</p>
          <p className="text-sm font-semibold text-white/90">Duniya Flow</p>
        </div>
        <button className="grid size-12 place-items-center rounded-full bg-white/5 backdrop-blur-md transition hover:bg-white/15">
          <ListMusic size={20} className="text-white" />
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center p-6 lg:flex-row lg:justify-around">
        {/* Cover Art */}
        <motion.div 
          layoutId="player-cover"
          className="relative aspect-square w-full max-w-[22rem] shrink-0 md:max-w-[28rem]"
        >
          <motion.div
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className={`absolute inset-0 rounded-full border border-white/10 ${isPlaying ? 'shadow-[0_0_80px_rgba(255,255,255,0.15)]' : ''} bg-black/40 backdrop-blur-3xl`}
          />
          <img 
            src={currentTrack?.cover || coverGradient} 
            alt="Cover" 
            className={`absolute inset-2 h-[calc(100%-1rem)] w-[calc(100%-1rem)] rounded-full object-cover transition-all duration-700 ${isPlaying ? 'scale-100 opacity-100' : 'scale-95 opacity-80'}`} 
          />
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="size-16 rounded-full border-2 border-white/20 bg-black/50 backdrop-blur-md" />
          </div>
        </motion.div>

        {/* Controls and Info */}
        <div className="mt-8 flex w-full max-w-lg flex-col items-center text-center lg:mt-0 lg:items-start lg:text-left">
          <div className="flex w-full items-center justify-between">
            <div className="flex-1">
              <motion.h2 layoutId="player-title" className="text-3xl font-black text-white md:text-5xl line-clamp-2">
                {currentTrack?.title || 'Unknown Signal'}
              </motion.h2>
              <motion.p layoutId="player-artist" className="mt-2 text-lg text-white/60 line-clamp-1">
                {currentTrack?.artist || 'Music Duniya AI'}
              </motion.p>
            </div>
            <button onClick={() => toggleFavorite(currentTrack)} className="ml-4 text-white/60 hover:text-coral transition-colors">
              <Heart size={32} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Scrubber */}
          <div className="mt-10 w-full group">
            <div 
              className="relative h-2 w-full overflow-hidden rounded-full bg-white/10 cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const percent = (e.clientX - rect.left) / rect.width
                if (audioRef.current && duration) {
                  audioRef.current.currentTime = percent * duration
                }
              }}
            >
              <motion.div 
                className="absolute bottom-0 left-0 top-0 bg-gradient-to-r from-cyan-300 to-fuchsia-400 group-hover:from-cyan-200 group-hover:to-fuchsia-300 transition-all"
                style={{ width: `${progressPercent}%` }}
                layoutId="player-progress"
              />
            </div>
            <div className="mt-2 flex justify-between text-xs font-medium text-white/40">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="mt-8 flex w-full items-center justify-center gap-8 lg:justify-start">
            <button onClick={playPrev} className="text-white/60 hover:text-white transition-colors">
              <SkipBack size={32} />
            </button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={togglePlay} 
              className="grid size-20 place-items-center rounded-full bg-white text-black shadow-[0_0_40px_rgba(255,255,255,0.4)] transition-all hover:shadow-[0_0_60px_rgba(255,255,255,0.6)]"
            >
              {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
            </motion.button>
            <button onClick={playNext} className="text-white/60 hover:text-white transition-colors">
              <SkipForward size={32} />
            </button>
          </div>

          {/* Bottom actions */}
          <div className="mt-12 flex w-full items-center justify-between text-white/40">
            <Volume2 size={20} className="hover:text-white transition-colors cursor-pointer" />
            <div className="flex gap-4">
              <Mic2 size={20} className="hover:text-white transition-colors cursor-pointer" />
              <Disc3 size={20} className="hover:text-white transition-colors cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
