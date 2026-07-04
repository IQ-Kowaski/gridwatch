import { motion } from 'framer-motion'

export default function LiveBadge({ label = 'LIVE' }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-live)]/40 bg-[var(--color-live)]/10 px-2.5 py-1 text-xs font-semibold tracking-wide text-[var(--color-live)]">
      <span className="relative flex h-2 w-2">
        <motion.span
          className="absolute inline-flex h-full w-full rounded-full bg-[var(--color-live)]"
          animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
        />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-live)]" />
      </span>
      {label}
    </span>
  )
}
