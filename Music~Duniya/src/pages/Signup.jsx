import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react'
import AuthShell from '../components/AuthShell'
import { useAuth } from '../context/useAuth'

export default function Signup() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setStatus('')
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    try {
      const result = await signUp({ email, password, fullName })
      if (result.mode === 'signed-up') {
        setStatus('Account created. If confirmation is enabled, check your email. Redirecting to login...')
        window.setTimeout(() => navigate('/login'), 900)
      } else {
        navigate('/', { replace: true })
      }
    } catch (err) {
      setError(err.message || 'Unable to create account.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      eyebrow="New identity"
      title="Build your Music Duniya."
      subtitle="Create an account for protected playlists, favorites, Telugu discovery, and future AI recommendations."
      alternate={<>Already have an account? <Link className="font-black text-cyan-200" to="/login">Sign in</Link></>}
    >
      <form onSubmit={submit} className="space-y-4">
        <Field icon={User} label="Display name" type="text" value={fullName} onChange={setFullName} placeholder="Your name" />
        <Field icon={Mail} label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
        <Field icon={Lock} label="Password" type={showPassword ? 'text' : 'password'} value={password} onChange={setPassword} placeholder="Minimum 6 characters" action={<button type="button" onClick={() => setShowPassword((value) => !value)} className="text-slate-300">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>} />
        {error && <p className="rounded-2xl border border-fuchsia-300/20 bg-fuchsia-400/10 p-3 text-sm text-fuchsia-100">{error}</p>}
        {status && <p className="rounded-2xl border border-cyan-200/20 bg-cyan-300/10 p-3 text-sm text-cyan-100">{status}</p>}
        <button disabled={loading} className="h-14 w-full rounded-2xl bg-gradient-to-r from-cyan-100 via-white to-fuchsia-100 font-black text-black shadow-[0_0_42px_rgba(125,249,255,.2)] transition hover:scale-[1.01] disabled:opacity-60">
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>
    </AuthShell>
  )
}

function Field({ icon: Icon, label, type, value, onChange, placeholder, action }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-300">{label}</span>
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-100/60" size={18} />
        <input required type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.07] pl-12 pr-12 outline-none transition placeholder:text-slate-500 focus:border-cyan-200/70" />
        {action && <span className="absolute right-4 top-1/2 -translate-y-1/2">{action}</span>}
      </div>
    </label>
  )
}
