import { usePolling } from '../lib/usePolling'
import { fetchDriverStandings, fetchConstructorStandings } from '../lib/api'
import StandingsTable from '../components/StandingsTable'

function TableSkeleton() {
  return (
    <div className="h-64 animate-pulse rounded-lg border border-[var(--color-hairline)] bg-[var(--color-panel)]" />
  )
}

export default function Standings() {
  const { data: drivers, loading: dLoading, error: dError, updatedAt } = usePolling(
    fetchDriverStandings,
    5 * 60_000
  )
  const { data: constructors, loading: cLoading, error: cError } = usePolling(
    fetchConstructorStandings,
    5 * 60_000
  )

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
      <p className="mb-2 font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-signal)]">
        Championship points
      </p>
      <h1 className="mb-2 font-display text-4xl text-[var(--color-paper)] md:text-5xl">
        Standings
      </h1>
      {updatedAt && (
        <p className="mb-10 text-xs text-[var(--color-paper-dim)]">
          Updated {updatedAt.toLocaleTimeString()} · refreshes automatically
        </p>
      )}

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {dError && <p className="text-sm text-[var(--color-red-flag)]">Couldn't load driver standings.</p>}
        {dLoading && !drivers ? (
          <TableSkeleton />
        ) : (
          drivers && (
            <StandingsTable
              title="Drivers"
              rows={drivers}
              renderPrimary={(r) => r.name}
              renderSecondary={(r) => r.constructor}
            />
          )
        )}

        {cError && <p className="text-sm text-[var(--color-red-flag)]">Couldn't load constructor standings.</p>}
        {cLoading && !constructors ? (
          <TableSkeleton />
        ) : (
          constructors && (
            <StandingsTable
              title="Constructors"
              rows={constructors}
              renderPrimary={(r) => r.name}
              renderSecondary={(r) => r.nationality}
            />
          )
        )}
      </div>
    </div>
  )
}
