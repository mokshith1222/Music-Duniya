import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, GitBranch, Lock, Mail } from 'lucide-react'
import AuthShell from '../components/AuthShell'
import { useAuth } from '../context/useAuth'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn({ email, password, remember })
      navigate(location.state?.from?.pathname || '/', { replace: true })
    } catch (err) {
      setError(cleanAuthError(err.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      eyebrow="Secure login"
      title="Continue your soundspace."
      subtitle="Sign in with your Music Duniya ID to restore favorites, playlists, and protected listening memory."
      alternate={<>New here? <Link className="font-black text-cyan-200" to="/signup">Create an account</Link></>}
    >
      <form onSubmit={submit} className="space-y-4">
        <Field icon={Mail} label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
        <Field icon={Lock} label="Password" type={showPassword ? 'text' : 'password'} value={password} onChange={setPassword} placeholder="Your password" action={<button type="button" onClick={() => setShowPassword((value) => !value)} className="text-slate-300">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>} />
        <div className="flex items-center justify-between gap-4 text-sm">
          <label className="flex items-center gap-2 text-slate-300">
            <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} className="size-4 accent-cyan-200" />
            Remember me
          </label>
          <button type="button" className="font-bold text-cyan-200">Forgot password?</button>
        </div>
        {error && <p className="rounded-2xl border border-fuchsia-300/20 bg-fuchsia-400/10 p-3 text-sm text-fuchsia-100">{error}</p>}
        <button disabled={loading} className="h-14 w-full rounded-2xl bg-white font-black text-black shadow-[0_0_42px_rgba(255,255,255,.2)] transition hover:scale-[1.01] disabled:opacity-60">
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
        <div className="grid gap-3 sm:grid-cols-2">
          <button type="button" className="h-12 rounded-2xl border border-white/10 bg-white/[0.06] font-bold text-white"><GitBranch className="mr-2 inline" size={17} /> GitHub soon</button>
          <button type="button" className="h-12 rounded-2xl border border-white/10 bg-white/[0.06] font-bold text-white">Google soon</button>
        </div>
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
        <input required minLength={type === 'password' ? 6 : undefined} type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.07] pl-12 pr-12 outline-none transition placeholder:text-slate-500 focus:border-cyan-200/70" />
        {action && <span className="absolute right-4 top-1/2 -translate-y-1/2">{action}</span>}
      </div>
    </label>
  )
}

function cleanAuthError(message = '') {
  if (message.toLowerCase().includes('invalid login')) return 'Email or password is incorrect.'
  if (message.toLowerCase().includes('email not confirmed')) return 'Please confirm your email before signing in.'
  return message || 'Unable to sign in.'
}
