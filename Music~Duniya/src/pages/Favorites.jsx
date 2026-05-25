import MusicCard from '../components/MusicCard'
import SectionHeader from '../components/SectionHeader'
import { usePlayer } from '../context/usePlayer'

export default function Favorites() {
  const { favorites } = usePlayer()
  return (
    <div className="space-y-6">
      <SectionHeader kicker="Your library" title="Favorites" />
      {favorites.length ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">{favorites.map((track) => <MusicCard key={track.id} track={track} tracks={favorites} />)}</div>
      ) : (
        <p className="glass-orbit rounded-[2rem] p-6 text-muted">Tap the heart on a song to save it here.</p>
      )}
    </div>
  )
}
