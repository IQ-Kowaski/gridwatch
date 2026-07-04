import { usePolling } from '../lib/usePolling'
import { fetchSchedule } from '../lib/api'
import { getStreamsForSession } from '../lib/streamProvider'
import { useEffect, useState } from 'react'
import StreamPlayer, { StreamPlayerSkeleton } from '../components/StreamPlayer'
import LiveBadge from '../components/LiveBadge'
import Countdown from '../components/Countdown'
import { formatSessionTime } from '../lib/format'

function currentOrNextSession(schedule) {
  const now = Date.now()
  const all = schedule.flatMap((r) => r.sessions.map((s) => ({ ...s, race: r })))
  const live = all.find((s) => s.at && now - s.at.getTime() > -15 * 60_000 && now - s.at.getTime() < 3 * 3600_000)
  if (live) return { session: live, isLive: true }
  const upcoming = all.filter((s) => s.at && s.at.getTime() > now).sort((a, b) => a.at - b.at)[0]
  return { session: upcoming ?? null, isLive: false }
}

export default function Watch() {
  const { data: schedule, loading, error } = usePolling(fetchSchedule, 5 * 60_000)
  const [feeds, setFeeds] = useState(null)

  const result = schedule ? currentOrNextSession(schedule) : null
  const session = result?.session ?? null
  const isLive = result?.isLive ?? false

  useEffect(() => {
    let cancelled = false
    if (!session) return
    setFeeds(null)
    getStreamsForSession(`${session.race.round}-${session.label}`, session.race.name).then((f) => {
      if (!cancelled) setFeeds(f)
    })
    return () => {
      cancelled = true
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.race?.round, session?.label])

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
      <p className="mb-2 font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-signal)]">
        Live coverage
      </p>
      <h1 className="mb-8 font-display text-4xl text-[var(--color-paper)] md:text-5xl">Watch</h1>

      {error && (
        <p className="mb-6 text-sm text-[var(--color-red-flag)]" role="alert">
          Couldn't reach the schedule feed. Retrying automatically…
        </p>
      )}

      {loading && !schedule && <StreamPlayerSkeleton />}

      {schedule && !session && (
        <p className="text-sm text-[var(--color-paper-dim)]">No upcoming sessions found.</p>
      )}

      {session && (
        <>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="mb-1 flex items-center gap-2">
                {isLive && <LiveBadge />}
                <h2 className="font-display text-2xl text-[var(--color-paper)]">
                  {session.race.name} · {session.label}
                </h2>
              </div>
              <p className="text-sm text-[var(--color-paper-dim)]">
                {session.race.circuit} · {formatSessionTime(session.at)}
              </p>
            </div>
            {!isLive && <Countdown target={session.at} />}
          </div>

          {feeds === null ? (
            <StreamPlayerSkeleton />
          ) : (
            <StreamPlayer feeds={feeds} sessionLabel={`${session.race.name} · ${session.label}`} />
          )}
        </>
      )}
    </div>
  )
}
