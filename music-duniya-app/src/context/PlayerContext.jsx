import { useMemo, useRef, useState } from 'react'
import { PlayerContext } from './playerContextCore'
import { normalizeTrack } from './playerUtils'
import YouTube from 'react-youtube';

const storage = {
  get(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? fallback
    } catch {
      return fallback
    }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  },
}

export function PlayerProvider({ children }) {
  const htmlPlayerRef = useRef(null);
  const [youtubePlayer, setYoutubePlayer] = useState(null);
  
  const [currentTrack, setCurrentTrack] = useState(() => storage.get('md_current', null));
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [queue, setQueue] = useState(() => storage.get('md_queue', []));
  const [recentlyPlayed, setRecentlyPlayed] = useState(() => storage.get('md_recent', []));
  const [favorites, setFavorites] = useState(() => storage.get('md_favorites', []));
  const [playlists, setPlaylists] = useState(() => storage.get('md_playlists', [{ id: 'daily', name: 'Daily Duniya', tracks: [] }]));

  const persist = (key, value) => storage.set(key, value);

  useEffect(() => {
    const player = htmlPlayerRef.current;
    if (!player) return;

    const handleTimeUpdate = () => setCurrentTime(player.currentTime);
    const handleDurationChange = () => setDuration(player.duration);

    player.addEventListener('timeupdate', handleTimeUpdate);
    player.addEventListener('durationchange', handleDurationChange);

    return () => {
      player.removeEventListener('timeupdate', handleTimeUpdate);
      player.removeEventListener('durationchange', handleDurationChange);
    };
  }, []);

  useEffect(() => {
    if (!youtubePlayer || !isPlaying) return;

    const interval = setInterval(() => {
      if (youtubePlayer && typeof youtubePlayer.getCurrentTime === 'function') {
        const time = youtubePlayer.getCurrentTime();
        const dur = youtubePlayer.getDuration();
        setCurrentTime(time);
        if (dur) setDuration(dur);
      }
    }, 250); // Poll every 250ms

    return () => clearInterval(interval);
  }, [youtubePlayer, isPlaying]);

  const playTrack = (input, list = []) => {
    const track = normalizeTrack(input)
    if (!track) return
    
    // If the player is currently playing, stop it before changing the track
    if (isPlaying) {
      if (currentTrack?.source === 'YouTube' && youtubePlayer) {
        youtubePlayer.stopVideo();
      } else if (htmlPlayerRef.current) {
        htmlPlayerRef.current.pause();
      }
    }

    const nextQueue = list.map(normalizeTrack).filter(Boolean).filter((item) => item.id !== track.id)
    const nextRecent = [track, ...recentlyPlayed.filter((item) => item.id !== track.id)].slice(0, 12)
    
    setCurrentTrack(track)
    setQueue(nextQueue)
    setRecentlyPlayed(nextRecent)
    setIsPlaying(true)

    persist('md_current', track)
    persist('md_queue', nextQueue)
    persist('md_recent', nextRecent)
  }

  const togglePlay = () => {
    if (!currentTrack) return
    setIsPlaying((value) => !value)
  }

  const playNext = () => {
    const [next, ...rest] = queue
    if (next) {
      setQueue(rest)
      playTrack(next, rest)
      persist('md_queue', rest)
    } else {
      setIsPlaying(false)
    }
  }

  const addToQueue = (input) => {
    const track = normalizeTrack(input)
    if (!track) return
    const nextQueue = [...queue, track]
    setQueue(nextQueue)
    persist('md_queue', nextQueue)
  }

  const toggleFavorite = (input) => {
    const track = normalizeTrack(input)
    const exists = favorites.some((item) => item.id === track.id)
    const next = exists ? favorites.filter((item) => item.id !== track.id) : [track, ...favorites]
    setFavorites(next)
    persist('md_favorites', next)
  }

  const addToPlaylist = (playlistId, input) => {
    const track = normalizeTrack(input)
    const next = playlists.map((playlist) =>
      playlist.id === playlistId && !playlist.tracks.some((item) => item.id === track.id)
        ? { ...playlist, tracks: [track, ...playlist.tracks] }
        : playlist,
    )
    setPlaylists(next)
    persist('md_playlists', next)
  }

  useEffect(() => {
    if (!currentTrack) return;

    if (currentTrack.source === 'YouTube') {
      if (htmlPlayerRef.current) htmlPlayerRef.current.pause();
      if (youtubePlayer) {
        if (isPlaying) {
          youtubePlayer.playVideo();
        } else {
          youtubePlayer.pauseVideo();
        }
      }
    } else {
      if (youtubePlayer) youtubePlayer.stopVideo();
      if (htmlPlayerRef.current) {
        if (isPlaying) {
          htmlPlayerRef.current.play().catch(() => setIsPlaying(false));
        } else {
          htmlPlayerRef.current.pause();
        }
      }
    }
  }, [isPlaying, currentTrack, youtubePlayer]);

  useEffect(() => {
    if (currentTrack && htmlPlayerRef.current && currentTrack.source !== 'YouTube') {
      htmlPlayerRef.current.src = currentTrack.audio;
      if (isPlaying) {
        htmlPlayerRef.current.play().catch(() => setIsPlaying(false));
      }
    }
  }, [currentTrack]);


  const value = useMemo(
    () => ({
      htmlPlayerRef,
      youtubePlayer,
      setYoutubePlayer,
      currentTrack,
      isPlaying,
      setIsPlaying,
      currentTime,
      duration,
      queue,
      recentlyPlayed,
      favorites,
      playlists,
      playTrack,
      togglePlay,
      playNext,
      addToQueue,
      toggleFavorite,
      addToPlaylist,
    }),
    [currentTrack, isPlaying, queue, recentlyPlayed, favorites, playlists, youtubePlayer, currentTime, duration]
  );

  const youtubeOptions = {
    height: '0',
    width: '0',
    playerVars: {
      autoplay: 0,
      controls: 0,
      rel: 0,
      showinfo: 0,
    },
  };

  const handleYoutubeReady = (event) => {
    setYoutubePlayer(event.target);
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
      <audio ref={htmlPlayerRef} onEnded={playNext} />
      {currentTrack?.source === 'YouTube' && (
        <YouTube
          videoId={currentTrack.videoId}
          opts={youtubeOptions}
          onReady={handleYoutubeReady}
          onEnd={playNext}
          className="hidden"
        />
      )}
    </PlayerContext.Provider>
  );
}
