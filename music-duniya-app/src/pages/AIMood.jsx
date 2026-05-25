import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import MusicCard from "../components/MusicCard";
import SectionHeader from "../components/SectionHeader";
import { getMoodPlaylist } from "../services/openrouterService";
import { usePlayer } from "../context/usePlayer";
import { searchYouTubeSongs } from "../services/youtubeApi";
import { normalizeTrack } from "../context/playerUtils";

const moods = ["Focus", "Heartbreak", "Gym", "Rain", "Devotional", "Night Drive"];

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function AIMood() {
  const query = useQuery();
  const [selectedMood, setSelectedMood] = useState(query.get("mood") || null);
  const [playlist, setPlaylist] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { playTrack } = usePlayer();

  useEffect(() => {
    const moodFromQuery = query.get("mood");
    if (moodFromQuery) {
      handleMoodClick(moodFromQuery);
    }
  }, [query]);

  const handleMoodClick = async (mood) => {
    setSelectedMood(mood);
    setIsLoading(true);
    setPlaylist([]);
    try {
      const aiPlaylist = await getMoodPlaylist(mood);
      if (aiPlaylist) {
        const searchPromises = aiPlaylist.map(song => searchYouTubeSongs(`${song.title} ${song.artist}`, 1));
        const searchResults = await Promise.all(searchPromises);
        const tracks = searchResults.flat().map(normalizeTrack);
        setPlaylist(tracks);
      }
    } catch (error) {
      console.error("Failed to generate playlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <SectionHeader title="AI Moods" />
      <div className="flex flex-wrap gap-4 mb-8">
        {moods.map((mood) => (
          <button
            key={mood}
            onClick={() => handleMoodClick(mood)}
            className={`px-4 py-2 rounded-full transition-colors ${
              selectedMood === mood
                ? "bg-cyan-400 text-black"
                : "bg-white/10 hover:bg-white/20"
            }`}
          >
            {mood}
          </button>
        ))}
      </div>

      {isLoading && <p className="text-white/50">Generating {selectedMood} playlist...</p>}

      {playlist.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {playlist.map((track) => (
            <MusicCard key={track.id} track={track} tracks={playlist} />
          ))}
        </div>
      )}
    </div>
  );
}
