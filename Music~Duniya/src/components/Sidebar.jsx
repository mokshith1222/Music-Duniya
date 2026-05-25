import { NavLink } from 'react-router-dom'
import { Heart, Home, ListMusic, Radio, Search, Sparkles, Star } from 'lucide-react'

const links = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/playlist/daily', label: 'Playlist', icon: ListMusic },
  { to: '/radio', label: 'Radio', icon: Radio },
  { to: '/jamendo', label: 'Jamendo', icon: Sparkles },
  { to: '/favorites', label: 'Favorites', icon: Heart },
]

export default function Sidebar() {
  return (
    <aside className="glass fixed left-4 top-4 z-30 hidden h-[calc(100svh-112px)] w-64 rounded-2xl p-4 lg:block">
      <NavLink to="/" className="mb-8 flex items-center gap-3 px-2">
        <span className="grid size-11 place-items-center rounded-xl bg-neon text-black">
          <Star size={22} fill="currentColor" />
        </span>
        <span>
          <span className="block text-lg font-black">Music Duniya</span>
          <span className="text-xs uppercase tracking-[0.2em] text-muted">Premium</span>
        </span>
      </NavLink>
      <nav className="space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                isActive ? 'bg-white text-black' : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <p className="text-sm font-bold">AI Recommendations</p>
        <p className="mt-2 text-xs leading-5 text-muted">
          Personal taste graphs and Supabase profiles are ready for the next phase.
        </p>
      </div>
    </aside>
  )
}
