import { motion } from 'framer-motion'
import { usePolling } from '../lib/usePolling'
import { fetchSchedule, deriveLiveSession } from '../lib/api'
import { formatSessionTime } from '../lib/format'
import LiveBadge from '../components/LiveBadge'

export default function Schedule() {
  const { data: schedule, loading, error } = usePolling(fetchSchedule, 5 * 60_000)
  const isLive = schedule ? !!deriveLiveSession(schedule) : false
  const now = Date.now()

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
      <p className="mb-2 font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-signal)]">
        Season calendar
      </p>
      <h1 className="mb-8 font-display text-4xl text-[var(--color-paper)] md:text-5xl">
        Race Schedule
      </h1>

      {error && (
        <p className="mb-6 text-sm text-[var(--color-red-flag)]" role="alert">
          Couldn't reach the schedule feed. Retrying automatically…
        </p>
      )}

      {loading && !schedule && (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-lg border border-[var(--color-hairline)] bg-[var(--color-panel)]"
            />
          ))}
        </div>
      )}

      <ol className="space-y-3">
        {schedule?.map((race, i) => {
          const raceSession = race.sessions.find((s) => s.label === 'Race')
          const isPast = raceSession && raceSession.at.getTime() < now
          const isThisRaceLive = isLive && !isPast && raceSession && now - raceSession.at.getTime() > -3 * 3600_000

          return (
            <motion.li
              key={race.round}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i, 10) * 0.03 }}
              className={`rounded-lg border p-4 md:p-5 ${
                isPast
                  ? 'border-[var(--color-hairline)] bg-[var(--color-ink-2)] opacity-60'
                  : 'border-[var(--color-hairline)] bg-[var(--color-panel)]'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <span className="tnum font-mono text-xs text-[var(--color-paper-dim)]">
                      RD {String(race.round).padStart(2, '0')}
                    </span>
                    {isThisRaceLive && <LiveBadge />}
                  </div>
                  <h2 className="font-display text-xl text-[var(--color-paper)] md:text-2xl">
                    {race.name}
                  </h2>
                  <p className="text-sm text-[var(--color-paper-dim)]">
                    {race.circuit} · {race.locality}, {race.country}
                  </p>
                </div>
                {raceSession && (
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-wide text-[var(--color-paper-dim)]">
                      Race start
                    </p>
                    <p className="tnum font-mono text-sm text-[var(--color-paper)]">
                      {formatSessionTime(raceSession.at)}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {race.sessions.map((s) => (
                  <span
                    key={s.label}
                    className="rounded-full border border-[var(--color-hairline)] px-2.5 py-1 text-[11px] text-[var(--color-paper-dim)]"
                  >
                    {s.label}: <span className="tnum text-[var(--color-paper)]">{formatSessionTime(s.at)}</span>
                  </span>
                ))}
              </div>
            </motion.li>
          )
        })}
      </ol>
    </div>
  )
}
