import { Music } from "lucide-react";
import MusicCard from "../components/MusicCard";
import SectionHeader from "../components/SectionHeader";
import { usePlayer } from "../context/usePlayer";

export default function LikedSongs() {
  const { favorites } = usePlayer();

  return (
    <div>
      <SectionHeader title="Liked Songs" />
      {favorites.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {favorites.map((track) => (
            <MusicCard key={track.id} track={track} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-text-secondary">
          <Music size={48} />
          <p className="mt-4 text-lg">You haven't liked any songs yet.</p>
        </div>
      )}
    </div>
  );
}
