import { Link, NavLink } from 'react-router-dom'
import { LogOut, Orbit, User } from 'lucide-react'
import SearchBar from './SearchBar'
import { useAuth } from '../context/useAuth'

export default function Navbar() {
  const { user, signOut } = useAuth()

  return (
    <header className="sticky top-0 z-30 px-4 py-4 md:px-6">
        <div className="glass-orbit mx-auto flex max-w-7xl items-center gap-3 rounded-full px-3 py-2">
          <NavLink to="/" className="flex items-center gap-3 rounded-full pl-1 pr-3">
            <span className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-cyan-200 via-fuchsia-200 to-gold text-black shadow-[0_0_30px_rgba(125,249,255,0.24)]">
              <Orbit size={20} />
            </span>
            <span className="hidden leading-tight sm:block">
              <span className="block text-sm font-black">Music Duniya</span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-100/80">Neural Audio</span>
            </span>
          </NavLink>
          <div className="hidden min-w-0 flex-1 lg:block">
            <SearchBar />
          </div>
          {user ? (
            <div className="ml-auto flex items-center gap-2">
              <span className="hidden max-w-48 items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm font-semibold text-white sm:flex">
                <User size={16} />
                <span className="line-clamp-1">{user.email}</span>
              </span>
              <button onClick={signOut} className="grid size-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Sign out">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="ml-auto rounded-full bg-white px-4 py-2 text-sm font-black text-black shadow-[0_0_28px_rgba(255,255,255,0.18)]">
              Continue
            </Link>
          )}
        </div>
        <div className="mx-auto mt-3 max-w-7xl lg:hidden">
          <SearchBar />
        </div>
      </header>
  )
}
