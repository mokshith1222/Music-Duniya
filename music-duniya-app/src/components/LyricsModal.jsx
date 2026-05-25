import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { getLyrics } from '../services/lyricsService'

export default function LyricsModal({ track, onClose }) {
  const [lyrics, setLyrics] = useState('')
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const loadLyrics = async () => {
    setLoading(true)
    try {
      const data = await getLyrics({ trackName: track.title, artistName: track.artist, albumName: track.album })
      setLyrics(data.syncedLyrics || data.plainLyrics || 'Lyrics were not found for this track.')
    } catch {
      setLyrics('Lyrics were not found for this track.')
    } finally {
      setLoaded(true)
      setLoading(false)
    }
  }

  useEffect(() => {
    // Lyrics are fetched lazily when the modal opens for the current track.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!loaded && !loading) loadLyrics()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track.id])

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="glass max-h-[82svh] w-full max-w-2xl overflow-hidden rounded-3xl">
        <div className="flex items-center justify-between border-b border-white/10 p-5">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-neon">Lyrics</p>
            <h2 className="text-xl font-black">{track.title}</h2>
          </div>
          <button onClick={onClose} className="grid size-10 place-items-center rounded-full bg-white/10 hover:bg-white/20" aria-label="Close lyrics">
            <X size={18} />
          </button>
        </div>
        <pre className="max-h-[60svh] whitespace-pre-wrap overflow-auto p-5 font-sans text-sm leading-7 text-slate-200">
          {loading ? 'Loading lyrics...' : lyrics}
        </pre>
      </motion.div>
    </div>
  )
}
