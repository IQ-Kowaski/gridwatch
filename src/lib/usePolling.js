import { useEffect, useRef, useState } from 'react'

/**
 * Runs `fetcher` immediately, then again every `intervalMs`, keeping the
 * page's data current without a manual refresh. Exposes loading/error state
 * so the UI can show something honest while data is in flight.
 */
export function usePolling(fetcher, intervalMs = 60_000, deps = []) {
  const [state, setState] = useState({ data: null, error: null, loading: true, updatedAt: null })
  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  useEffect(() => {
    let cancelled = false

    async function run() {
      try {
        const data = await fetcherRef.current()
        if (!cancelled) setState({ data, error: null, loading: false, updatedAt: new Date() })
      } catch (err) {
        if (!cancelled) setState((s) => ({ ...s, error: err, loading: false }))
      }
    }

    run()
    const id = setInterval(run, intervalMs)
    return () => {
      cancelled = true
      clearInterval(id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return state
}
