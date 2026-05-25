import { Link, useParams } from 'react-router-dom'
import SectionHeader from '../components/SectionHeader'
import { coverGradient } from '../assets/coverFallback'
import { useAsync } from '../hooks/useAsync'
import { getArtist } from '../services/musicBrainzService'

export default function Artist() {
  const { id } = useParams()
  const { data: artist, loading, error } = useAsync(() => getArtist(id), [id], null)

  if (loading) return <div className="skeleton h-80 rounded-3xl" />
  if (error || !artist) return <p className="text-muted">Artist details could not be loaded.</p>

  return (
    <div className="space-y-8">
      <section className="glass-orbit relative overflow-hidden rounded-[2.5rem] p-8">
        <img src={coverGradient} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-200">{artist.type || 'Artist'}</p>
          <h1 className="mt-2 text-5xl font-black">{artist.name}</h1>
          <p className="mt-4 max-w-2xl text-muted">{artist.disambiguation || `${artist.country || 'Global'} artist profile powered by MusicBrainz.`}</p>
        </div>
      </section>
      <section>
        <SectionHeader title="Albums and Release Groups" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {(artist['release-groups'] || []).slice(0, 16).map((album) => (
            <Link key={album.id} to={`/album/${album.id}`} className="glass-orbit rounded-[1.5rem] p-4 hover:bg-white/10">
              <p className="font-black">{album.title}</p>
              <p className="mt-1 text-sm text-muted">{album['primary-type'] || 'Release'} {album['first-release-date'] || ''}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
