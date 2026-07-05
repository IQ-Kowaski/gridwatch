import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Overview' },
  { to: '/schedule', label: 'Schedule' },
  { to: '/results', label: 'Results' },
  { to: '/standings', label: 'Standings' },
  { to: '/watch', label: 'Watch' },
]

export default function Nav() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const utc = now.toISOString().slice(11, 19)

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-hairline)] bg-[var(--color-ink)]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 md:px-8">
        <a href="/" className="flex items-center gap-2.5" translate="no">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-[var(--color-signal)]" aria-hidden="true" />
          <span className="font-display text-lg tracking-wide text-[var(--color-paper)]">
            GRID WATCH
          </span>
        </a>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-[var(--color-signal)] ${
                  isActive ? 'text-[var(--color-signal)]' : 'text-[var(--color-paper-dim)]'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-1.5 font-mono text-xs text-[var(--color-paper-dim)] sm:flex">
          <span>UTC</span>
          <time className="tnum text-[var(--color-paper)]">{utc}</time>
        </div>
      </div>

      <nav className="flex items-center gap-5 border-t border-[var(--color-hairline)] px-5 py-2 md:hidden" aria-label="Primary">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === '/'}
            className={({ isActive }) =>
              `text-sm font-medium ${isActive ? 'text-[var(--color-signal)]' : 'text-[var(--color-paper-dim)]'}`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
