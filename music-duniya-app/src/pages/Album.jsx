import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import SectionHeader from '../components/SectionHeader'
import { coverGradient } from '../assets/coverFallback'
import { useAsync } from '../hooks/useAsync'
import { getReleaseGroup } from '../services/musicBrainzService'
import { getReleaseGroupCover } from '../services/coverArtService'

export default function Album() {
  const { id } = useParams()
  const { data: album, loading, error } = useAsync(() => getReleaseGroup(id), [id], null)
  const [cover, setCover] = useState(coverGradient)

  useEffect(() => {
    getReleaseGroupCover(id).then(setCover).catch(() => setCover(coverGradient))
  }, [id])

  if (loading) return <div className="skeleton h-80 rounded-3xl" />
  if (error || !album) return <p className="text-muted">Album details could not be loaded.</p>

  return (
    <div className="space-y-8">
      <section className="glass-orbit grid gap-6 rounded-[2.5rem] p-6 md:grid-cols-[240px_1fr]">
        <img src={cover} alt="" className="aspect-square rounded-2xl object-cover" />
        <div className="self-end">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-200">{album['primary-type'] || 'Album'}</p>
          <h1 className="mt-2 text-4xl font-black md:text-6xl">{album.title}</h1>
          <p className="mt-4 text-muted">{album['artist-credit']?.map((item) => item.name).join(', ') || 'Various artists'} · {album['first-release-date'] || 'Release date unknown'}</p>
        </div>
      </section>
      <section>
        <SectionHeader title="Releases" />
        <div className="space-y-2">
          {(album.releases || []).map((release, index) => (
            <div key={release.id} className="glass flex items-center justify-between rounded-2xl p-4">
              <span className="font-semibold">{index + 1}. {release.title}</span>
              <span className="text-sm text-muted">{release.date || release.country || 'MusicBrainz'}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
