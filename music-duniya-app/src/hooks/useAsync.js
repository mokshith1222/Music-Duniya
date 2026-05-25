import { useEffect, useState } from 'react'

export function useAsync(factory, deps = [], fallback = []) {
  const [data, setData] = useState(fallback)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    // Async API calls reset UI state whenever the caller changes dependencies.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
    setError('')
    factory()
      .then((value) => active && setData(value))
      .catch((err) => {
        if (active) setError(err?.message ?? 'Something went wrong')
      })
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { data, loading, error }
}
