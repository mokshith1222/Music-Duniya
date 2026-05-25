import { Radio as RadioIcon, Search } from 'lucide-react'
import { useState } from 'react'
import SectionHeader from '../components/SectionHeader'
import { coverGradient } from '../assets/coverFallback'
import { usePlayer } from '../context/usePlayer'
import { useAsync } from '../hooks/useAsync'
import { getTopStations, searchStations } from '../services/radioService'

export default function Radio() {
  const [query, setQuery] = useState('')
  const { playTrack } = usePlayer()
  const stations = useAsync(() => (query ? searchStations(query) : getTopStations()), [query], [])

  const playStation = (station) =>
    playTrack({
      id: station.stationuuid,
      title: station.name,
      artist: `${station.country || 'Live'} Radio`,
      cover: station.favicon || coverGradient,
      audio: station.url_resolved || station.url,
      source: 'Radio Browser',
    })

  return (
    <div className="space-y-6">
      <SectionHeader kicker="Live worldwide" title="Radio" />
      <div className="relative max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search radio stations" className="h-12 w-full rounded-full border border-white/10 bg-white/10 pl-12 pr-4 outline-none focus:border-cyan-200/70" />
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {stations.data.map((station) => (
          <button key={station.stationuuid} onClick={() => playStation(station)} className="glass-orbit flex items-center gap-4 rounded-[1.6rem] p-4 text-left hover:bg-white/10">
            <img src={station.favicon || coverGradient} alt="" className="size-14 rounded-xl object-cover" />
            <span className="min-w-0 flex-1">
              <span className="line-clamp-1 block font-black">{station.name}</span>
              <span className="line-clamp-1 block text-sm text-muted">{station.country || 'Global'} · {station.tags || 'Live stream'}</span>
            </span>
            <RadioIcon size={20} className="text-cyan-200" />
          </button>
        ))}
      </div>
    </div>
  )
}
