import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { BrainCircuit, Disc3, Play, Radar, Sparkles } from 'lucide-react'
import { useRef } from 'react'
import LoadingSkeleton from '../components/LoadingSkeleton'
import MusicCard from '../components/MusicCard'
import SectionHeader from '../components/SectionHeader'
import { coverGradient } from '../assets/coverFallback'
import { normalizeTrack } from '../context/playerUtils'
import { usePlayer } from '../context/usePlayer'
import { useAsync } from '../hooks/useAsync'
import { getTrendingTracks } from '../services/audiusService'
import { getJamendoTracks } from '../services/jamendoService'

const aiCards = [
  ['Neural Mix', 'A live taste model tuned to your recent plays.', 'from-cyan-400/10 to-transparent', 'shadow-[0_0_30px_rgba(34,211,238,0.1)]'],
  ['Mood Radar', 'Detects late-night focus, city walks, and high-energy sessions.', 'from-fuchsia-400/10 to-transparent', 'shadow-[0_0_30px_rgba(232,121,249,0.1)]'],
  ['Duniya Flow', 'Blends indie, radio, and underground signals into one stream.', 'from-amber-300/10 to-transparent', 'shadow-[0_0_30px_rgba(252,211,77,0.1)]'],
]

export default function Home() {
  const { playTrack, recentlyPlayed } = usePlayer()
  const trending = useAsync(() => getTrendingTracks(12), [], [])
  const jamendo = useAsync(() => getJamendoTracks({ limit: 8 }), [], [])
  const tracks = trending.data.map(normalizeTrack).filter(Boolean)
  const indie = jamendo.data.map((track) =>
    normalizeTrack({ ...track, artist: track.artist_name, cover: track.album_image, audio: track.audio, source: 'Jamendo' }),
  )
  const heroTrack = tracks[0] || indie[0]
  const carousel = [...tracks, ...indie].slice(0, 8)

  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, 100])
  const opacityParallax = useTransform(scrollYProgress, [0, 0.4], [1, 0])

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
              onClick={() => heroTrack && playTrack(heroTrack, carousel)} 
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

        {/* Right Side: Abstract Visuals / Hero Art */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative min-h-[350px] w-full max-w-[400px] justify-self-center lg:justify-self-end perspective-[1000px]"
        >
          <motion.div 
            animate={{ rotateY: [0, 3, -3, 0], rotateX: [0, -3, 3, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-[2.5rem] border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent p-6 shadow-2xl backdrop-blur-3xl preserve-3d flex items-center justify-center"
          >
            {/* Inner glowing rings */}
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }} className="absolute left-1/2 top-1/2 size-[18rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5 border-t-cyan-400/20 shadow-[0_0_40px_rgba(34,211,238,0.05)] pointer-events-none" />
            <motion.div animate={{ rotate: -360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }} className="absolute left-1/2 top-1/2 size-[12rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5 border-b-fuchsia-400/20 shadow-[0_0_30px_rgba(232,121,249,0.05)] pointer-events-none" />
            
            {/* Center Record / Art */}
            <div className="relative z-10">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="relative grid size-40 place-items-center overflow-hidden rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.4),0_0_20px_rgba(125,249,255,0.1)] group cursor-pointer"
                onClick={() => heroTrack && playTrack(heroTrack, carousel)}
              >
                <img src={heroTrack?.cover || coverGradient} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/30 transition-opacity duration-300 group-hover:opacity-10" />
                <motion.div 
                  animate={{ rotate: 360 }} 
                  transition={{ duration: 10, repeat: Infinity, ease: 'linear' }} 
                  className="relative grid size-14 place-items-center rounded-full border border-white/20 bg-black/40 backdrop-blur-md"
                >
                  <Disc3 className="text-white/80" size={20} />
                </motion.div>
              </motion.div>
            </div>

            {/* Floating Glass Panels */}
            <motion.div 
              animate={{ y: [0, -10, 0] }} 
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} 
              className="absolute -left-6 top-10 rounded-xl border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-xl translate-z-[40px] shadow-2xl pointer-events-none"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-3 items-end gap-[2px]">
                  {[40, 80, 50, 100].map((h, i) => <span key={i} className="w-[2px] bg-cyan-300 rounded-full animate-[wavePulse_1s_ease-in-out_infinite]" style={{ height: `${h}%`, animationDelay: `${i*0.1}s` }} />)}
                </div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-white/70">Live</p>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 12, 0] }} 
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }} 
              className="absolute -right-4 bottom-10 rounded-xl border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-xl translate-z-[60px] shadow-2xl pointer-events-none"
            >
              <div className="flex gap-2 items-center">
                <BrainCircuit size={14} className="text-fuchsia-300 shrink-0" />
                <p className="text-[10px] font-bold text-white/80">Neural Match 98%</p>
              </div>
            </motion.div>

          </motion.div>
        </motion.div>
      </section>

      {/* Dynamic Carousel */}
      <section>
        <SectionHeader kicker="The Orbit" title="Top Signals" />
        <div className="flex gap-4 overflow-x-auto pb-6 pt-2 px-1 snap-x hide-scrollbar">
          {carousel.map((track, index) => (
            <motion.button
              key={track.id}
              onClick={() => playTrack(track, carousel)}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.04, type: 'spring', damping: 20 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="relative min-w-[180px] shrink-0 snap-start rounded-[1.5rem] border border-white/5 bg-white/[0.02] p-3 text-left backdrop-blur-md transition-all hover:bg-white/[0.04] hover:border-white/10 hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)] group"
            >
              <div className="overflow-hidden rounded-xl">
                <img src={track.cover || coverGradient} alt="" className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="mt-3 px-1">
                <p className="line-clamp-1 text-sm font-bold text-white/90 group-hover:text-white transition-colors">{track.title}</p>
                <p className="mt-0.5 line-clamp-1 text-xs font-medium text-white/40">{track.artist}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* AI Cards */}
      <section className="grid gap-4 md:grid-cols-3">
        {aiCards.map(([title, text, color, shadow], i) => (
          <motion.div 
            key={title} 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            whileHover={{ y: -4, scale: 1.01 }} 
            className={`relative overflow-hidden rounded-[2rem] border border-white/5 bg-gradient-to-br bg-white/[0.02] p-6 backdrop-blur-xl transition-all hover:border-white/10 ${shadow} group cursor-default`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
            <Sparkles className="relative z-10 text-white/50 transition-colors duration-300 group-hover:text-white/80" size={20} />
            <h3 className="relative z-10 mt-6 text-xl font-bold text-white/90 transition-colors group-hover:text-white">{title}</h3>
            <p className="relative z-10 mt-2 text-sm leading-relaxed text-white/40 transition-colors group-hover:text-white/60">{text}</p>
          </motion.div>
        ))}
      </section>

      {/* Independent Catalog */}
      <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div>
          <SectionHeader kicker="Underground" title="Indie Futures" action={<Link className="text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors" to="/jamendo">Explore</Link>} />
          {jamendo.loading ? <LoadingSkeleton count={6} /> : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {indie.slice(0, 8).map((track, i) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <MusicCard track={track} tracks={indie} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-5 backdrop-blur-xl"
        >
          <SectionHeader title="Recent Echoes" />
          <div className="mt-2 space-y-1">
            {recentlyPlayed.length === 0 && <p className="text-xs text-white/30 p-4 text-center">No recent signals detected.</p>}
            {recentlyPlayed.slice(0, 6).map((track, i) => (
              <motion.button 
                key={track.id} 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                onClick={() => playTrack(track)} 
                className="group flex w-full items-center gap-3 rounded-xl p-2 transition-all"
              >
                <div className="relative size-12 shrink-0 overflow-hidden rounded-lg">
                  <img src={track.cover || coverGradient} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" />
                  <div className="absolute inset-0 grid place-items-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <Play size={12} className="text-white ml-0.5" fill="currentColor" />
                  </div>
                </div>
                <div className="flex-1 text-left min-w-0">
                  <span className="line-clamp-1 text-sm font-bold text-white/90 group-hover:text-white transition-colors">{track.title}</span>
                  <span className="line-clamp-1 text-[10px] font-medium text-white/40">{track.artist}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  )
}
