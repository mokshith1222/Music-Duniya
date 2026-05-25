import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize, Minimize } from 'lucide-react';
import { getLyrics } from '../services/lyricsApi';
import { usePlayer } from '../context/usePlayer';
import { coverFallback } from '../assets/coverFallback';

// Helper to parse LRC format
const parseLRC = (lrc) => {
  if (!lrc) return [];
  const lines = lrc.split('\n');
  const result = [];
  for (const line of lines) {
    const match = line.match(/\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/);
    if (match) {
      const [, min, sec, ms, text] = match;
      const time = parseInt(min, 10) * 60 + parseInt(sec, 10) + parseInt(ms, 10) / 1000;
      result.push({ time, text: text.trim() });
    }
  }
  return result;
};

export default function LyricsModal({ track, onClose }) {
  const [lyrics, setLyrics] = useState({ synced: [], plain: '' });
  const [loading, setLoading] = useState(true);
  const [currentLineIndex, setCurrentLineIndex] = useState(-1);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { currentTime } = usePlayer();
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchLyrics = async () => {
      setLoading(true);
      try {
        const data = await getLyrics({ 
          trackName: track.title, 
          artistName: track.artist, 
          albumName: track.album,
          duration: track.duration, // Assuming track object has duration
        });
        setLyrics({
          synced: parseLRC(data?.syncedLyrics),
          plain: data?.plainLyrics || 'Lyrics were not found for this track.',
        });
      } catch {
        setLyrics({ synced: [], plain: 'Could not load lyrics.' });
      } finally {
        setLoading(false);
      }
    };
    fetchLyrics();
  }, [track]);

  useEffect(() => {
    if (lyrics.synced.length === 0) return;
    
    let newIndex = -1;
    for (let i = 0; i < lyrics.synced.length; i++) {
      if (currentTime >= lyrics.synced[i].time) {
        newIndex = i;
      } else {
        break;
      }
    }

    if (newIndex !== currentLineIndex) {
      setCurrentLineIndex(newIndex);
    }
  }, [currentTime, lyrics.synced, currentLineIndex]);

  useEffect(() => {
    if (currentLineIndex > -1 && scrollRef.current) {
      const activeLine = scrollRef.current.children[currentLineIndex];
      if (activeLine) {
        activeLine.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  }, [currentLineIndex]);

  const imageUrl = track.cover || coverFallback(track.id);

  const containerVariants = {
    initial: { opacity: 0, backdropFilter: 'blur(0px)' },
    animate: { opacity: 1, backdropFilter: 'blur(20px)' },
    exit: { opacity: 0, backdropFilter: 'blur(0px)' },
  };

  const modalVariants = {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.95, opacity: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img src={imageUrl} className="h-full w-full object-cover scale-110 blur-2xl brightness-50" alt="" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      </div>

      <motion.div
        variants={modalVariants}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className={`relative flex flex-col overflow-hidden transition-all duration-500 ${isFullScreen ? 'w-full h-full rounded-none' : 'w-full max-w-4xl h-[80vh] rounded-3xl glass-orbit'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 text-white flex-shrink-0">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">Karaoke Mode</p>
            <h2 className="text-xl font-black">{track.title} - {track.artist}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsFullScreen(!isFullScreen)} className="grid size-10 place-items-center rounded-full bg-white/10 hover:bg-white/20 transition-colors" aria-label="Toggle fullscreen">
              {isFullScreen ? <Minimize size={18} /> : <Maximize size={18} />}
            </button>
            <button onClick={onClose} className="grid size-10 place-items-center rounded-full bg-white/10 hover:bg-white/20 transition-colors" aria-label="Close lyrics">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Lyrics View */}
        <div className="flex-grow overflow-auto p-8 text-center" ref={scrollRef}>
          {loading ? (
            <p className="text-2xl font-bold text-white/50 animate-pulse">Loading Lyrics...</p>
          ) : lyrics.synced.length > 0 ? (
            lyrics.synced.map((line, index) => (
              <motion.p
                key={line.time + index}
                animate={{
                  opacity: index === currentLineIndex ? 1 : (index < currentLineIndex ? 0.3 : 0.5),
                  scale: index === currentLineIndex ? 1.1 : 1,
                  y: index < currentLineIndex ? -5 : 0,
                }}
                transition={{ duration: 0.4, type: 'spring' }}
                className={`font-black transition-colors duration-300
                  ${isFullScreen ? 'text-4xl md:text-6xl' : 'text-3xl'}
                  ${index === currentLineIndex 
                    ? 'text-cyan-300 text-shadow-[0_0_20px_rgba(56,189,248,0.8)]' 
                    : 'text-white/70'
                  }`
                }
                style={{
                  marginBottom: isFullScreen ? '2rem' : '1.5rem',
                  lineHeight: 1.2,
                }}
              >
                {line.text || '♪'}
              </motion.p>
            ))
          ) : (
            <pre className="whitespace-pre-wrap font-sans text-lg leading-8 text-white/60">
              {lyrics.plain}
            </pre>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
