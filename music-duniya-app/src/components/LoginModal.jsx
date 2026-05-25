import { useState } from 'react'
import { Fingerprint, Lock, Mail, ShieldCheck, Sparkles, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/useAuth'

export default function LoginModal({ onClose }) {
  const { configured, signIn, signUp } = useAuth()
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setStatus('')
    setSubmitting(true)

    try {
      const result = mode === 'signin' ? await signIn(email.trim(), password) : await signUp(email.trim(), password)
      if (result.mode === 'signed-up') {
        setStatus('Account created. If email confirmation is enabled, verify your inbox before signing in.')
      } else if (result.mode === 'existing-user') {
        setStatus('This email already exists. Use Sign in to continue.')
      } else {
        setStatus(result.mode === 'demo' ? 'Demo profile unlocked.' : 'Welcome back. Loading your soundspace.')
        window.setTimeout(onClose, 650)
      }
    } catch (err) {
      setError(cleanAuthError(err.message))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-auto bg-[#02040a]/82 p-4 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative grid w-full max-w-5xl overflow-hidden rounded-[2.2rem] border border-white/12 bg-[#080b14]/88 shadow-[0_40px_140px_rgba(0,0,0,0.68)] backdrop-blur-3xl lg:grid-cols-[0.9fr_1.1fr]"
      >
        <button onClick={onClose} className="absolute right-4 top-4 z-10 grid size-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Close sign in">
          <X size={18} />
        </button>

        <div className="relative hidden min-h-[620px] overflow-hidden p-8 lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_12%,rgba(125,249,255,.28),transparent_34%),radial-gradient(circle_at_80%_72%,rgba(255,106,213,.26),transparent_38%),linear-gradient(135deg,#0b1020,#100818)]" />
          <div className="absolute left-12 top-20 h-64 w-64 rounded-full border border-cyan-200/18" />
          <div className="absolute right-10 top-28 h-80 w-80 rounded-full border border-fuchsia-200/18" />
          <div className="relative flex h-full flex-col justify-between">
            <div>
              <div className="inline-grid size-14 place-items-center rounded-2xl bg-white text-black shadow-[0_0_44px_rgba(255,255,255,.28)]">
                <Fingerprint size={27} />
              </div>
              <h2 className="mt-8 text-5xl font-black leading-none">Your neural music identity.</h2>
              <p className="mt-5 max-w-sm text-sm leading-6 text-slate-300">
                Save favorites, playlists, recently played tracks, and future AI recommendations behind one secure Music Duniya profile.
              </p>
            </div>

            <div className="grid gap-3">
              {[
                ['Encrypted Supabase session', ShieldCheck],
                ['Password sign in and sign up', Lock],
                ['Ready for recommendation profiles', Sparkles],
              ].map(([label, Icon]) => (
                <div key={label} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.07] p-3">
                  <Icon size={18} className="text-cyan-200" />
                  <span className="text-sm font-bold">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-8 lg:p-10">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-200">Music Duniya ID</p>
          <h1 className="mt-3 text-3xl font-black text-white sm:text-5xl">{mode === 'signin' ? 'Continue listening.' : 'Create your universe.'}</h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            {mode === 'signin' ? 'Enter your email and password to restore your library.' : 'Start with email and password. Your AI music profile comes next.'}
          </p>

          <div className="mt-7 grid grid-cols-2 rounded-2xl border border-white/10 bg-white/[0.055] p-1">
            {[
              ['signin', 'Sign in'],
              ['signup', 'Sign up'],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setMode(key)
                  setError('')
                  setStatus('')
                }}
                className={`rounded-xl px-4 py-3 text-sm font-black transition ${mode === key ? 'bg-white text-black' : 'text-slate-300 hover:bg-white/8 hover:text-white'}`}
              >
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="mt-7 space-y-4">
            <AuthField icon={Mail} label="Email address" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
            <AuthField icon={Lock} label="Password" type="password" value={password} onChange={setPassword} placeholder="Minimum 6 characters" />

            {!configured && (
              <p className="rounded-2xl border border-amber-200/25 bg-amber-200/10 p-3 text-sm text-amber-50">
                Supabase keys are missing, so this will use a local demo profile.
              </p>
            )}

            {error && <p className="rounded-2xl border border-fuchsia-300/20 bg-fuchsia-400/10 p-3 text-sm text-fuchsia-100">{error}</p>}
            {status && <p className="rounded-2xl border border-cyan-200/20 bg-cyan-300/10 p-3 text-sm text-cyan-100">{status}</p>}

            <button disabled={submitting} className="h-14 w-full rounded-2xl bg-gradient-to-r from-cyan-100 via-white to-fuchsia-100 font-black text-black shadow-[0_0_42px_rgba(125,249,255,0.22)] transition hover:scale-[1.01] disabled:opacity-60">
              {submitting ? 'Working...' : mode === 'signin' ? 'Sign in and continue' : 'Create account and continue'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

function AuthField({ icon: Icon, label, type, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-300">{label}</span>
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-100/60" size={18} />
        <input
          type={type}
          required
          minLength={type === 'password' ? 6 : undefined}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.07] pl-12 pr-4 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-200/70 focus:bg-white/[0.1] focus:shadow-[0_0_34px_rgba(125,249,255,0.12)]"
        />
      </div>
    </label>
  )
}

function cleanAuthError(message = '') {
  if (message.toLowerCase().includes('invalid login')) return 'Email or password is incorrect.'
  if (message.toLowerCase().includes('email not confirmed')) return 'Please confirm your email before signing in.'
  return message || 'Could not continue right now.'
}
