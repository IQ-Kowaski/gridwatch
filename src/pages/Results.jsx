import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { usePolling } from '../lib/usePolling'
import { fetchSchedule, fetchRaceResults, fetchQualifyingResults, fetchSprintResults } from '../lib/api'
import ResultsTable from '../components/ResultsTable'

const SESSIONS = [
  { key: 'race', label: 'Race', fetcher: fetchRaceResults },
  { key: 'qualifying', label: 'Qualifying', fetcher: fetchQualifyingResults },
  { key: 'sprint', label: 'Sprint', fetcher: fetchSprintResults },
]

function TableSkeleton() {
  return (
    <div className="h-64 animate-pulse rounded-lg border border-[var(--color-hairline)] bg-[var(--color-panel)]" />
  )
}

export default function Results() {
  const { data: schedule, loading: scheduleLoading, error: scheduleError } = usePolling(fetchSchedule, 5 * 60_000)
  const [round, setRound] = useState(null)
  const [session, setSession] = useState('race')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!schedule || schedule.length === 0) return
    const latest = [...schedule].reverse().find((r) => {
      const raceSession = r.sessions.find((s) => s.label === 'Race')
      return raceSession && raceSession.at.getTime() < Date.now()
    })
    setRound(latest?.round ?? schedule[schedule.length - 1]?.round)
  }, [schedule])

  useEffect(() => {
    if (!round) return
    const active = SESSIONS.find((s) => s.key === session)
    if (!active) return
    let cancelled = false
    setLoading(true)
    setError(null)
    active.fetcher(round).then((data) => {
      if (!cancelled) {
        setResults(data)
        setLoading(false)
      }
    }).catch((e) => {
      if (!cancelled) {
        setError(e.message)
        setLoading(false)
      }
    })
    return () => { cancelled = true }
  }, [round, session])

  const selectedRound = schedule?.find((r) => r.round === round)

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
      <p className="mb-2 font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-signal)]">
        Session results
      </p>
      <h1 className="mb-8 font-display text-4xl text-[var(--color-paper)] md:text-5xl">
        Results
      </h1>

      {scheduleError && (
        <p className="mb-6 text-sm text-[var(--color-red-flag)]" role="alert">
          Couldn't reach the schedule feed. Retrying automatically…
        </p>
      )}

      <div className="mb-8 flex flex-wrap items-center gap-4">
        <div className="relative">
          <select
            value={round ?? ''}
            onChange={(e) => setRound(Number(e.target.value))}
            className="appearance-none rounded-lg border border-[var(--color-hairline)] bg-[var(--color-panel)] px-4 py-2.5 pr-10 text-sm font-medium text-[var(--color-paper)] transition-colors hover:border-[var(--color-paper-dim)] focus:outline-none focus-visible:border-[var(--color-signal)]"
          >
            {scheduleLoading && <option value="">Loading rounds…</option>}
            {schedule?.map((r) => {
              const raceSession = r.sessions.find((s) => s.label === 'Race')
              const isPast = raceSession && raceSession.at.getTime() < Date.now()
              return (
                <option key={r.round} value={r.round} disabled={!isPast}>
                  R{r.round.toString().padStart(2, '0')} — {r.name}
                </option>
              )
            })}
          </select>
          <svg
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-paper-dim)]"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>

        <div className="flex gap-1.5 rounded-lg border border-[var(--color-hairline)] bg-[var(--color-panel)] p-1">
          {SESSIONS.map((s) => (
            <button
              key={s.key}
              onClick={() => setSession(s.key)}
              className={`rounded-md px-3.5 py-1.5 text-xs font-medium transition-all ${
                session === s.key
                  ? 'bg-[var(--color-signal)] text-[var(--color-ink)]'
                  : 'text-[var(--color-paper-dim)] hover:text-[var(--color-paper)]'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {selectedRound && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h2 className="font-display text-2xl text-[var(--color-paper)] md:text-3xl">
            {selectedRound.name}
          </h2>
          <p className="mt-1 text-sm text-[var(--color-paper-dim)]">
            {selectedRound.circuit} · {selectedRound.locality}, {selectedRound.country}
          </p>
        </motion.div>
      )}

      {error && (
        <p className="mb-6 text-sm text-[var(--color-red-flag)]" role="alert">
          Couldn't load results for this round.
        </p>
      )}

      {loading && <TableSkeleton />}

      {!loading && results && results.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-[var(--color-hairline)] bg-[var(--color-panel)] px-6 py-16 text-center">
          <p className="text-sm text-[var(--color-paper-dim)]">
            No results available yet for this session.
          </p>
        </div>
      )}

      {!loading && results && results.length > 0 && (
        <ResultsTable
          title={SESSIONS.find((s) => s.key === session)?.label ?? ''}
          rows={results}
          sessionType={session}
        />
      )}
    </div>
  )
}
