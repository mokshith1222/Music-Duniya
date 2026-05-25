import { useState } from 'react'
import LoadingSkeleton from '../components/LoadingSkeleton'
import MusicCard from '../components/MusicCard'
import SectionHeader from '../components/SectionHeader'
import { normalizeTrack } from '../context/playerUtils'
import { useAsync } from '../hooks/useAsync'
import { getJamendoTracks } from '../services/jamendoService'

export default function Jamendo() {
  const [query, setQuery] = useState('')
  const tracksQuery = query.trim()
  const { data, loading } = useAsync(() => getJamendoTracks({ query: tracksQuery, limit: 24 }), [tracksQuery], [])
  const tracks = data.map((track) =>
    normalizeTrack({
      ...track,
      artist: track.artist_name,
      album: track.album_name,
      cover: track.album_image,
      audio: track.audio,
      source: 'Jamendo',
    }),
  )

  return (
    <div className="space-y-6">
      <SectionHeader kicker="Jamendo API" title="Independent Songs" />
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search Jamendo songs" className="h-12 w-full max-w-xl rounded-full border border-white/10 bg-white/10 px-5 outline-none focus:border-cyan-200/70" />
      {loading ? <LoadingSkeleton /> : <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">{tracks.map((track) => <MusicCard key={track.id} track={track} tracks={tracks} />)}</div>}
    </div>
  )
}
