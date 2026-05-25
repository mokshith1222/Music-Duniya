import { useMemo, useRef, useState } from 'react'
import { PlayerContext } from './playerContextCore'
import { normalizeTrack } from './playerUtils'

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
  const audioRef = useRef(null)
  const [currentTrack, setCurrentTrack] = useState(() => storage.get('md_current', null))
  const [isPlaying, setIsPlaying] = useState(false)
  const [queue, setQueue] = useState(() => storage.get('md_queue', []))
  const [recentlyPlayed, setRecentlyPlayed] = useState(() => storage.get('md_recent', []))
  const [favorites, setFavorites] = useState(() => storage.get('md_favorites', []))
  const [playlists, setPlaylists] = useState(() => storage.get('md_playlists', [{ id: 'daily', name: 'Daily Duniya', tracks: [] }]))

  const persist = (key, value) => storage.set(key, value)

  const playTrack = (input, list = []) => {
    const track = normalizeTrack(input)
    if (!track) return
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

  const playSong = (song) => {
    playTrack(song, [song])
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

  const value = useMemo(
    () => ({
      audioRef,
      currentTrack,
      isPlaying,
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
      setIsPlaying,
      playSong,
    }),
    [currentTrack, isPlaying, queue, recentlyPlayed, favorites, playlists],
  )

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
}
