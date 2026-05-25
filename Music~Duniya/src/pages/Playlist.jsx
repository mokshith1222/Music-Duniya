import MusicCard from '../components/MusicCard'
import SectionHeader from '../components/SectionHeader'
import { usePlayer } from '../context/usePlayer'

export default function Playlist() {
  const { playlists } = usePlayer()
  const playlist = playlists[0]
  return (
    <div className="space-y-6">
      <section className="glass-orbit rounded-[2.5rem] p-8">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-200">Playlist</p>
        <h1 className="mt-2 text-5xl font-black">{playlist.name}</h1>
        <p className="mt-3 text-muted">{playlist.tracks.length} saved tracks</p>
      </section>
      <SectionHeader title="Tracks" />
      {playlist.tracks.length ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">{playlist.tracks.map((track) => <MusicCard key={track.id} track={track} tracks={playlist.tracks} />)}</div>
      ) : (
        <p className="glass-orbit rounded-[2rem] p-6 text-muted">Add tracks from the home, search, or Jamendo pages to start this playlist.</p>
      )}
    </div>
  )
}
