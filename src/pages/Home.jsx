import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Hero from '../components/Hero'
import Countdown from '../components/Countdown'
import LiveBadge from '../components/LiveBadge'
import { usePolling } from '../lib/usePolling'
import { fetchSchedule, fetchDriverStandings, deriveLiveSession } from '../lib/api'
import { formatSessionTime } from '../lib/format'

function DriverCard({ driver: d, index, leaderPoints }) {
  const [imgErr, setImgErr] = useState(false)
  const initials = d.name
    ? d.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : d.code

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
      className="group relative rounded-lg border border-[var(--color-hairline)] bg-[var(--color-panel)] p-4 transition-colors hover:border-[var(--color-signal)]/40 hover:bg-[var(--color-panel-2)]"
    >
      <span
        className={`tnum absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold ${
          d.position === 1
            ? 'bg-[var(--color-signal)] text-[var(--color-ink)]'
            : 'bg-[var(--color-panel-2)] text-[var(--color-paper-dim)]'
        }`}
      >
        {d.position}
      </span>

      <div className="mb-3 flex justify-center pt-2">
        {imgErr ? (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-panel-2)] ring-2 ring-[var(--color-hairline)] transition-all group-hover:ring-[var(--color-signal)]/40">
            <span className="text-sm font-bold tracking-wide text-[var(--color-paper-dim)]">
              {initials}
            </span>
          </div>
        ) : (
          <img
            src={`https://media.formula1.com/content/dam/fom-website/drivers/2025DRIVERS/${d.code}/${d.code}01.png`}
            alt={d.name}
            className="h-16 w-16 rounded-full object-cover ring-2 ring-[var(--color-hairline)] transition-all group-hover:ring-[var(--color-signal)]/40"
            onError={() => setImgErr(true)}
            loading="lazy"
          />
        )}
      </div>

      <div className="text-center">
        <p className="truncate text-sm font-semibold text-[var(--color-paper)]">{d.code}</p>
        <p className="truncate text-xs text-[var(--color-paper-dim)]">{d.constructor}</p>
      </div>

      <div className="mt-3 flex items-center justify-center gap-1.5 border-t border-[var(--color-hairline)] pt-2.5">
        <div className="h-1 w-12 overflow-hidden rounded-full bg-[var(--color-hairline)]">
          <div
            className="h-full rounded-full bg-[var(--color-signal)] transition-all group-hover:opacity-80"
            style={{
              width: `${Math.min(100, leaderPoints > 0 ? (d.points / leaderPoints) * 100 : 0)}%`,
            }}
          />
        </div>
        <span className="tnum font-mono text-sm font-semibold text-[var(--color-signal)]">
          {d.points}
        </span>
      </div>
    </motion.div>
  )
}

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
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-44 animate-pulse rounded-lg border border-[var(--color-hairline)] bg-[var(--color-panel)]"
              />
            ))}
          </div>
        )}

        {drivers && (
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
            {drivers.slice(0, 5).map((d, i) => (
              <DriverCard key={d.driverId} driver={d} index={i} leaderPoints={drivers[0]?.points ?? 1} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}
