import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const SOURCE_STYLES = {
  golf: { bg: '#064e3b', text: '#6ee7b7', border: '#065f46' },
  admin: { bg: '#78350f', text: '#fcd34d', border: '#92400e' },
  echo: { bg: '#164e63', text: '#67e8f9', border: '#155e75' },
  alpha: { bg: '#1e3a5f', text: '#93c5fd', border: '#1e40af' },
  bravo: { bg: '#7f1d1d', text: '#fca5a5', border: '#991b1b' },
  charlie: { bg: '#4c1d95', text: '#c4b5fd', border: '#6d28d9' },
  delta: { bg: '#831843', text: '#f9a8d4', border: '#be185d' },
}

function SourceBadge({ source }) {
  const s = SOURCE_STYLES[source]
  if (!s) {
    return (
      <span className="inline-flex items-center rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider bg-[var(--color-panel-2)] text-[var(--color-paper-dim)] border border-[var(--color-hairline)]">
        {source}
      </span>
    )
  }
  return (
    <span
      className="inline-flex items-center rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider border"
      style={{ backgroundColor: s.bg, color: s.text, borderColor: s.border }}
    >
      {source}
    </span>
  )
}

function EmptyState({ sessionLabel }) {
  return (
    <div className="flex aspect-video w-full flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-[var(--color-hairline)] bg-[var(--color-panel)] px-6 text-center">
      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-hairline)] bg-[var(--color-panel-2)]">
        <svg className="h-5 w-5 text-[var(--color-paper-dim)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
        </svg>
      </span>
      <div>
        <p className="text-sm font-medium text-[var(--color-paper)]">No streams available</p>
        <p className="mt-1 text-xs text-[var(--color-paper-dim)]">
          {sessionLabel
            ? `${sessionLabel} — no active streams found`
            : 'No streams currently available for this event.'}
        </p>
      </div>
    </div>
  )
}

function PlayerOverlay({ stream }) {
  return (
    <div className="pointer-events-none absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pt-12">
      <div className="flex flex-wrap items-center gap-2">
        <SourceBadge source={stream.source} />
        <span className="text-xs font-medium text-[var(--color-paper)]">{stream.language}</span>
        {stream.hd && (
          <span className="inline-flex items-center rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-paper)]">
            HD
          </span>
        )}
        {stream.viewerCount > 0 && (
          <span className="ml-auto flex items-center gap-1 text-xs text-[var(--color-paper-dim)]">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
            {stream.viewerCount}
          </span>
        )}
      </div>
    </div>
  )
}

export default function StreamPlayer({ feeds, sessionLabel }) {
  const [activeId, setActiveId] = useState(feeds?.[0]?.id ?? null)
  const active = feeds?.find((f) => f.id === activeId) ?? null

  const groups = useMemo(() => {
    if (!feeds || feeds.length === 0) return []
    const map = {}
    for (const f of feeds) {
      const key = f.eventTitle || 'Unknown'
      if (!map[key]) map[key] = []
      map[key].push(f)
    }
    return Object.entries(map)
  }, [feeds])

  if (!feeds || feeds.length === 0) {
    return <EmptyState sessionLabel={sessionLabel} />
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-[var(--color-hairline)] bg-black">
        {active?.embedUrl && (
          <iframe
            key={active.id}
            src={active.embedUrl}
            title={active.label}
            className="h-full w-full"
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        )}
        {active && <PlayerOverlay stream={active} />}
      </div>

      <div className="space-y-4">
        <div className="flex items-baseline justify-between">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-[var(--color-paper-dim)]">
            Available streams
          </p>
          <span className="text-[11px] text-[var(--color-paper-dim)]">
            {feeds.length} source{feeds.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {groups.map(([event, streams]) => (
              <motion.div
                key={event}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-1"
              >
                {groups.length > 1 && (
                  <p className="px-1 pt-2 pb-1 text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-paper-dim)]">
                    {event}
                  </p>
                )}
                {streams.map((f) => {
                  const isActive = f.id === activeId
                  return (
                    <button
                      key={f.id}
                      onClick={() => setActiveId(f.id)}
                      className={`w-full rounded-lg border px-3 py-2.5 text-left transition-all ${
                        isActive
                          ? 'border-[var(--color-signal)] bg-[var(--color-signal)]/5 shadow-sm shadow-[var(--color-signal)]/5'
                          : 'border-[var(--color-hairline)] bg-[var(--color-panel)] hover:border-[var(--color-paper-dim)] hover:bg-[var(--color-panel-2)]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                            isActive
                              ? 'border-[var(--color-signal)] bg-[var(--color-signal)]'
                              : 'border-[var(--color-paper-dim)]'
                          }`}
                        >
                          {isActive && (
                            <svg className="h-2.5 w-2.5 text-[var(--color-ink)]" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.751.751 0 01.018-1.042.751.751 0 011.042-.018L6 10.94l6.72-6.72a.75.75 0 011.06 0z" />
                            </svg>
                          )}
                        </span>
                        <div className="flex min-w-0 flex-1 items-center gap-2">
                          <SourceBadge source={f.source} />
                          <span className="truncate text-sm font-medium text-[var(--color-paper)]">
                            {f.language}
                          </span>
                          {f.hd && (
                            <span className="shrink-0 rounded bg-[var(--color-panel-2)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--color-paper-dim)]">
                              HD
                            </span>
                          )}
                          {f.viewerCount > 0 && (
                            <span className="ml-auto hidden shrink-0 items-center gap-1 text-[11px] text-[var(--color-paper-dim)] sm:flex">
                              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                              </svg>
                              {f.viewerCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export function StreamPlayerSkeleton() {
  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0.4 }}
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 1.6, repeat: Infinity }}
        className="aspect-video w-full rounded-lg border border-[var(--color-hairline)] bg-[var(--color-panel)]"
      />
      <div className="space-y-2">
        <div className="h-3 w-24 animate-pulse rounded bg-[var(--color-panel-2)]" />
        <div className="h-12 animate-pulse rounded-lg border border-[var(--color-hairline)] bg-[var(--color-panel)]" />
        <div className="h-12 animate-pulse rounded-lg border border-[var(--color-hairline)] bg-[var(--color-panel)]" />
      </div>
    </div>
  )
}
