import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AudioLines, Fingerprint, Sparkles } from 'lucide-react'

export default function AuthShell({ eyebrow, title, subtitle, children, alternate }) {
  return (
    <main className="relative grid min-h-svh place-items-center overflow-hidden bg-[#03050b] p-4 text-white">
      <div className="aurora-blob left-[-12rem] top-[-8rem] bg-cyan-300" />
      <div className="aurora-blob bottom-[-10rem] right-[-10rem] bg-fuchsia-400 [animation-delay:1.7s]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(255,255,255,.08),transparent_28%),linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] bg-[size:auto,72px_72px,72px_72px]" />

      <motion.section initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 grid w-full max-w-6xl overflow-hidden rounded-[2.5rem] border border-white/12 bg-white/[0.055] shadow-[0_42px_150px_rgba(0,0,0,.7)] backdrop-blur-3xl lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative hidden min-h-[680px] overflow-hidden p-10 lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_22%,rgba(125,249,255,.28),transparent_32%),radial-gradient(circle_at_78%_76%,rgba(255,106,213,.24),transparent_34%)]" />
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 34, repeat: Infinity, ease: 'linear' }} className="absolute left-20 top-28 size-72 rounded-full border border-dashed border-cyan-200/20" />
          <motion.div animate={{ y: [0, -18, 0] }} transition={{ duration: 5, repeat: Infinity }} className="glass-orbit relative mt-12 rounded-[2rem] p-6">
            <Fingerprint className="text-cyan-100" size={34} />
            <h2 className="mt-20 text-5xl font-black leading-none">Neural access for your music universe.</h2>
            <p className="mt-5 text-sm leading-6 text-slate-300">Protected Supabase sessions, saved taste memory, YouTube discovery, and future AI recommendations.</p>
          </motion.div>
          <div className="absolute bottom-10 left-10 right-10 grid gap-3">
            {['Password auth', 'Remember me', 'Protected library'].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/[0.07] p-3">
                <Sparkles size={17} className="text-cyan-200" />
                <span className="text-sm font-bold">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 sm:p-8 lg:p-12">
          <Link to="/" className="mb-10 inline-flex items-center gap-3 text-sm font-black">
            <span className="grid size-11 place-items-center rounded-2xl bg-white text-black"><AudioLines size={22} /></span>
            Music Duniya
          </Link>
          <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-200">{eyebrow}</p>
          <h1 className="mt-3 text-4xl font-black leading-tight sm:text-6xl">{title}</h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-slate-400">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <p className="mt-6 text-center text-sm text-slate-400">{alternate}</p>
        </div>
      </motion.section>
    </main>
  )
}
