import { motion } from 'framer-motion'

function durationToSec(d) {
  if (!d) return null
  const parts = d.split(':')
  if (parts.length === 3) {
    const [m, s, ms] = parts.map(Number)
    return m * 60 + s + ms / 1000
  }
  if (parts.length === 2) {
    const [s, ms] = parts.map(Number)
    return s + ms / 1000
  }
  return null
}

export default function ResultsTable({ title: _title, rows, sessionType }) {
  const hasPoints = rows.some((r) => r.points > 0)

  const leaderTime = sessionType !== 'qualifying'
    ? null
    : durationToSec(rows[0]?.q1 || rows[0]?.q2 || rows[0]?.q3)

  return (
    <section aria-labelledby="results-heading">
      <div className="overflow-hidden rounded-lg border border-[var(--color-hairline)]">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-[var(--color-hairline)] bg-[var(--color-panel-2)] text-xs uppercase tracking-[0.14em] text-[var(--color-paper-dim)]">
              <th scope="col" className="w-14 px-3 py-2.5 md:px-4">Pos</th>
              <th scope="col" className="px-3 py-2.5 md:px-4">Driver</th>
              <th scope="col" className="hidden px-3 py-2.5 md:table-cell md:px-4">Car</th>
              {sessionType === 'qualifying' && (
                <th scope="col" className="hidden px-3 py-2.5 sm:table-cell md:px-4">Q1</th>
              )}
              {sessionType === 'qualifying' && (
                <th scope="col" className="hidden px-3 py-2.5 sm:table-cell md:px-4">Q2</th>
              )}
              {sessionType === 'qualifying' && (
                <th scope="col" className="px-3 py-2.5 md:px-4">Q3</th>
              )}
              {sessionType !== 'qualifying' && (
                <th scope="col" className="hidden px-3 py-2.5 sm:table-cell md:px-4">Time / Status</th>
              )}
              <th scope="col" className="hidden px-3 py-2.5 sm:table-cell md:px-4">Grid</th>
              {hasPoints && (
                <th scope="col" className="px-3 py-2.5 text-right md:px-4">Pts</th>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const sec = sessionType === 'qualifying' ? durationToSec(row.q1 || row.q2 || row.q3) : null
              const gap = leaderTime && sec ? (sec - leaderTime).toFixed(3) : null
              return (
                <motion.tr
                  key={row.driverId}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.35, ease: 'easeOut' }}
                  className="border-b border-[var(--color-hairline)] last:border-b-0 odd:bg-[var(--color-panel)] even:bg-[var(--color-ink-2)]"
                >
                  <td className="px-3 py-3 md:px-4">
                    <span
                      className={`tnum inline-flex h-7 w-7 items-center justify-center rounded-sm text-sm font-semibold ${
                        row.position === 1
                          ? 'bg-[var(--color-signal)] text-[var(--color-ink)]'
                          : 'bg-[var(--color-panel-2)] text-[var(--color-paper)]'
                      }`}
                    >
                      {row.position}
                    </span>
                  </td>
                  <td className="px-3 py-3 md:px-4">
                    <div className="font-medium text-[var(--color-paper)]">{row.name}</div>
                    <div className="text-xs text-[var(--color-paper-dim)]">{row.code}</div>
                  </td>
                  <td className="hidden px-3 py-3 text-sm text-[var(--color-paper-dim)] md:table-cell md:px-4">
                    {row.constructor}
                  </td>
                  {sessionType === 'qualifying' && (
                    <td className="tnum hidden px-3 py-3 font-mono text-xs text-[var(--color-paper-dim)] sm:table-cell md:px-4">
                      {row.q1 || '-'}
                    </td>
                  )}
                  {sessionType === 'qualifying' && (
                    <td className="tnum hidden px-3 py-3 font-mono text-xs text-[var(--color-paper-dim)] sm:table-cell md:px-4">
                      {row.q2 || '-'}
                    </td>
                  )}
                  {sessionType === 'qualifying' && (
                    <td className="tnum px-3 py-3 font-mono text-xs text-[var(--color-paper)] md:px-4">
                      <span>{row.q3 || '-'}</span>
                      {gap && (
                        <span className="ml-2 text-[var(--color-paper-dim)]">+{gap}</span>
                      )}
                    </td>
                  )}
                  {sessionType !== 'qualifying' && (
                    <td className="tnum hidden px-3 py-3 font-mono text-xs text-[var(--color-paper-dim)] sm:table-cell md:px-4">
                      <span className={row.status === 'Finished' ? 'text-[var(--color-live)]' : ''}>
                        {row.time || row.status || '-'}
                      </span>
                    </td>
                  )}
                  <td className="tnum hidden px-3 py-3 font-mono text-xs text-[var(--color-paper-dim)] sm:table-cell md:px-4">
                    {row.grid != null ? (row.grid === 0 ? 'PIT' : `P${row.grid}`) : '-'}
                  </td>
                  {hasPoints && (
                    <td className="px-3 py-3 md:px-4">
                      <div className="flex items-center justify-end gap-2">
                        <span className="tnum w-10 text-right font-semibold text-[var(--color-paper)]">
                          {row.points}
                        </span>
                      </div>
                    </td>
                  )}
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
