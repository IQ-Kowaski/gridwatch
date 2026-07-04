import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'

const LIGHT_COUNT = 5
const STEP_MS = 550

export default function StartLights({ onOut, className = '' }) {
  const reduced = useReducedMotion()
  const [lit, setLit] = useState(reduced ? LIGHT_COUNT : 0)
  const [out, setOut] = useState(reduced)

  useEffect(() => {
    if (reduced) {
      onOut?.()
      return
    }
    const timers = []
    for (let i = 1; i <= LIGHT_COUNT; i++) {
      timers.push(setTimeout(() => setLit(i), i * STEP_MS))
    }
    timers.push(
      setTimeout(() => {
        setOut(true)
        onOut?.()
      }, LIGHT_COUNT * STEP_MS + 700)
    )
    return () => timers.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced])

  return (
    <div className={`flex items-center gap-3 md:gap-4 ${className}`} aria-hidden="true">
      {Array.from({ length: LIGHT_COUNT }).map((_, i) => {
        const isLit = !out && i < lit
        return (
          <div
            key={i}
            className="relative flex h-9 w-9 md:h-12 md:w-12 items-center justify-center rounded-sm border border-[var(--color-hairline)] bg-[var(--color-panel-2)]"
          >
            <motion.div
              className="h-5 w-5 md:h-7 md:w-7 rounded-full"
              animate={{
                backgroundColor: isLit ? '#e04338' : '#2a2e33',
                boxShadow: isLit
                  ? '0 0 16px 4px rgba(224,67,56,0.65)'
                  : '0 0 0 0 rgba(224,67,56,0)',
              }}
              transition={{ duration: 0.15 }}
            />
          </div>
        )
      })}
    </div>
  )
}
