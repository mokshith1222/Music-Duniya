import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Dock from './Dock'
import Navbar from './Navbar'
import Player from './Player'
import DynamicBackground from '../visuals/DynamicBackground'

export default function Layout() {
  const location = useLocation()
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Throttle/requestAnimationFrame could be used here for ultra-optimization, 
      // but native React state with CSS vars is often smooth enough for simple glows.
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div 
      className="relative overflow-hidden selection:bg-cyan-500/30 font-sans antialiased text-white"
    >
      <DynamicBackground />
      
      {/* Global Reactive Cursor Glow */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 opacity-40 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(125,249,255,0.06), transparent 40%)`
        }}
      />
      
      <Navbar />
      
      <main className="relative z-10 mx-auto min-h-svh max-w-7xl px-4 pb-48 pt-6 md:px-8 lg:px-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -15, filter: 'blur(8px)' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Dock />
      <Player />
    </div>
  )
}
