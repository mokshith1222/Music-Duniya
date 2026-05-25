import { NavLink, useLocation } from 'react-router-dom'
import { Heart, Home, Library, Radio, Search, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

const links = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/library', label: 'Library', icon: Library },
  { to: '/radio', label: 'Radio', icon: Radio },
  { to: '/mood', label: 'AI Moods', icon: Sparkles },
  { to: '/liked', label: 'Liked', icon: Heart },
]

export default function Dock() {
  const location = useLocation()

  return (
    <motion.nav 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 20, stiffness: 100, delay: 0.5 }}
      className="fixed bottom-28 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-black/40 p-2 shadow-[0_30px_80px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-3xl saturate-[1.5]"
    >
      {links.map(({ to, label, icon: Icon }) => {
        const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to))
        return (
          <NavLink
            key={to}
            to={to}
            title={label}
            className="relative grid size-12 place-items-center rounded-full transition-colors hover:text-white group text-slate-400"
          >
            {isActive && (
              <motion.div
                layoutId="dock-indicator"
                className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400/20 to-fuchsia-400/20 border border-white/10 shadow-[0_0_20px_rgba(125,249,255,0.2)]"
                transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
              />
            )}
            <motion.div whileHover={{ y: -4, scale: 1.15 }} whileTap={{ scale: 0.9 }}>
              <Icon size={20} className={isActive ? "text-cyan-100 relative z-10" : "relative z-10"} />
            </motion.div>
            
            {/* Tooltip */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 scale-0 opacity-0 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100 rounded-md bg-black/80 px-2 py-1 text-xs font-semibold text-white backdrop-blur-md border border-white/10 whitespace-nowrap">
              {label}
            </div>
          </NavLink>
        )
      })}
    </motion.nav>
  )
}
