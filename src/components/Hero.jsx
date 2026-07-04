import { motion } from 'framer-motion'
import { useState } from 'react'
import StartLights from './StartLights'

export default function Hero({ nextRace, children }) {
  const [revealed, setRevealed] = useState(false)

  return (
    <section className="relative overflow-hidden border-b border-[var(--color-hairline)] bg-[var(--color-ink)]">
      <div className="grain absolute" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, transparent, transparent 79px, var(--color-paper) 79px, var(--color-paper) 80px)',
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-5 pb-14 pt-14 md:px-8 md:pb-20 md:pt-20">
        <StartLights onOut={() => setRevealed(true)} className="mb-8 md:mb-10" />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: revealed ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-signal)]"
        >
          {nextRace ? `Round ${nextRace.round} · ${nextRace.country}` : 'Formula 1 · Live season'}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={revealed ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="max-w-3xl font-display text-5xl font-bold leading-[0.95] tracking-tight text-[var(--color-paper)] sm:text-6xl md:text-7xl"
        >
          {nextRace ? nextRace.name.replace(' Grand Prix', '') : 'Race Control'}
          <span className="block text-[var(--color-signal)]">Grand&nbsp;Prix</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={revealed ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-5 max-w-xl text-base text-[var(--color-paper-dim)] md:text-lg"
        >
          Live session countdown, the full race calendar, and championship points —
          refreshed automatically as the season moves.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={revealed ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-9"
        >
          {children}
        </motion.div>
      </div>
    </section>
  )
}
