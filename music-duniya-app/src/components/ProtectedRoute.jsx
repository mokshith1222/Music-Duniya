import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div className="grid min-h-[60svh] place-items-center text-sm font-bold text-cyan-100">Opening secure soundspace...</div>
  }

  if (!user) return <Navigate to="/login" replace state={{ from: location }} />

  return children
}
