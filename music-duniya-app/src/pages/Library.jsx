import { Heart, ListMusic, History, Folder, Pin } from "lucide-react";
import { Link } from "react-router-dom";
import SectionHeader from "../components/SectionHeader";

const libraryItems = [
  {
    name: "Liked Songs",
    icon: <Heart size={24} />,
    path: "/liked",
  },
  {
    name: "Favorites",
    icon: <ListMusic size={24} />,
    path: "/favorites",
  },
  {
    name: "Recently Played",
    icon: <History size={24} />,
    path: "/history",
  },
  {
    name: "Playlists",
    icon: <Folder size={24} />,
    path: "/playlists",
  },
  {
    name: "Pinned",
    icon: <Pin size={24} />,
    path: "/pinned",
  },
];

export default function Library() {
  return (
    <div>
      <SectionHeader title="Library" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {libraryItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className="bg-surface rounded-lg p-4 flex flex-col items-center justify-center hover:bg-primary/20 transition-colors"
          >
            {item.icon}
            <span className="mt-2 text-sm">{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
