import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { motion } from 'framer-motion'

export default function SearchBar({ initial = '' }) {
  const [query, setQuery] = useState(initial)
  const [isFocused, setIsFocused] = useState(false)
  const navigate = useNavigate()

  const submit = (event) => {
    event.preventDefault()
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <form onSubmit={submit} className="relative w-full">
      <motion.div
        animate={{ 
          boxShadow: isFocused ? '0 0 40px rgba(125,249,255,0.2)' : '0 0 0px rgba(125,249,255,0)'
        }}
        className="relative flex items-center rounded-full bg-white/5 border border-white/10 backdrop-blur-md transition-colors hover:bg-white/10"
      >
        <Search className={`absolute left-5 transition-colors ${isFocused ? 'text-cyan-300' : 'text-white/40'}`} size={20} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Ask Music Duniya for a sound, mood, artist..."
          className="h-16 w-full rounded-full bg-transparent pl-14 pr-6 text-lg text-white outline-none transition placeholder:text-white/30"
        />
        <div className="absolute right-2">
           <button type="submit" className="h-12 rounded-full bg-white/10 px-6 text-sm font-bold text-white transition hover:bg-white/20">
             Scan
           </button>
        </div>
      </motion.div>
    </form>
  )
}
