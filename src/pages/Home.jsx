import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Hero from '../components/Hero'
import Countdown from '../components/Countdown'
import LiveBadge from '../components/LiveBadge'
import { usePolling } from '../lib/usePolling'
import { fetchSchedule, fetchDriverStandings, deriveLiveSession } from '../lib/api'
import { formatSessionTime } from '../lib/format'

function nextSession(schedule) {
  const now = Date.now()
  const all = schedule.flatMap((r) => r.sessions.map((s) => ({ ...s, race: r })))
  const upcoming = all.filter((s) => s.at && s.at.getTime() > now).sort((a, b) => a.at - b.at)
  return upcoming[0] ?? null
}

export default function Home() {
  const { data: schedule, loading: loadingSchedule, error: scheduleError } = usePolling(
    fetchSchedule,
    5 * 60_000
  )
  const { data: drivers } = usePolling(fetchDriverStandings, 5 * 60_000)

  const session = schedule ? nextSession(schedule) : null
  const isLive = schedule ? !!deriveLiveSession(schedule) : false

  return (
    <>
      <Hero nextRace={session?.race}>
        {scheduleError && (
          <p className="mb-4 text-sm text-[var(--color-red-flag)]" role="alert">
            Couldn't reach the schedule feed. Retrying automatically…
          </p>
        )}

        {loadingSchedule && !schedule && (
          <p className="font-mono text-sm text-[var(--color-paper-dim)]">Loading session clock…</p>
        )}

        {session && (
          <div>
            <div className="mb-3 flex items-center gap-3">
              {isLive && <LiveBadge />}
              <span className="text-sm font-medium text-[var(--color-paper)]">
                {session.label} · {formatSessionTime(session.at)}
              </span>
            </div>
            <Countdown target={session.at} />
          </div>
        )}

        <div className="mt-9 flex flex-wrap gap-3">
          <Link
            to="/watch"
            className="rounded-sm border border-[var(--color-red-flag)]/50 px-5 py-2.5 text-sm font-semibold text-[var(--color-red-flag)] transition-colors hover:bg-[var(--color-red-flag)]/10"
          >
            {isLive ? 'Watch live' : 'Watch'}
          </Link>
          <Link
            to="/schedule"
            className="rounded-sm bg-[var(--color-signal)] px-5 py-2.5 text-sm font-semibold text-[var(--color-ink)] transition-transform hover:scale-[1.02] focus-visible:scale-[1.02]"
          >
            Full race calendar
          </Link>
          <Link
            to="/standings"
            className="rounded-sm border border-[var(--color-hairline)] px-5 py-2.5 text-sm font-semibold text-[var(--color-paper)] transition-colors hover:border-[var(--color-signal)] hover:text-[var(--color-signal)]"
          >
            Championship standings
          </Link>
        </div>
      </Hero>

      <section className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="font-display text-3xl text-[var(--color-paper)] md:text-4xl">
            Drivers' Championship
          </h2>
          <Link
            to="/standings"
            className="text-sm font-medium text-[var(--color-signal)] hover:underline"
          >
            View full table →
          </Link>
        </div>

        {!drivers && (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-20 animate-pulse rounded-lg border border-[var(--color-hairline)] bg-[var(--color-panel)]"
              />
            ))}
          </div>
        )}

        {drivers && (
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
            {drivers.slice(0, 5).map((d, i) => (
              <motion.div
                key={d.driverId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-lg border border-[var(--color-hairline)] bg-[var(--color-panel)] p-4"
              >
                <div className="tnum mb-2 flex h-6 w-6 items-center justify-center rounded-sm bg-[var(--color-panel-2)] text-xs font-semibold text-[var(--color-paper-dim)]">
                  {d.position}
                </div>
                <div className="truncate text-sm font-semibold text-[var(--color-paper)]">
                  {d.code}
                </div>
                <div className="truncate text-xs text-[var(--color-paper-dim)]">{d.constructor}</div>
                <div className="tnum mt-2 font-mono text-lg font-semibold text-[var(--color-signal)]">
                  {d.points}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
