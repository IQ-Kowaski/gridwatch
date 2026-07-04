import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'

const LIGHT_COUNT = 5
const STEP_MS = 550

export default function StartLights({ onOut, className = '' }) {
  const reduced = useReducedMotion()
  const [lit, setLit] = useState(0)
  const [phase, setPhase] = useState(reduced ? 'off' : 'red')

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
      setTimeout(() => setPhase('green'), LIGHT_COUNT * STEP_MS + 700)
    )
    timers.push(
      setTimeout(() => {
        setPhase('off')
        onOut?.()
      }, LIGHT_COUNT * STEP_MS + 700 + 1200)
    )
    return () => timers.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced])

  return (
    <div className={`flex items-center gap-3 md:gap-4 ${className}`} aria-hidden="true">
      {Array.from({ length: LIGHT_COUNT }).map((_, i) => {
        const isRed = phase === 'red' && i < lit
        const isGreen = phase === 'green'

        let color = '#2a2e33'
        let glow = '0 0 0 0 rgba(0,0,0,0)'
        if (isRed) {
          color = '#e04338'
          glow = '0 0 16px 4px rgba(224,67,56,0.65)'
        } else if (isGreen) {
          color = '#33d6a6'
          glow = '0 0 16px 4px rgba(51,214,166,0.65)'
        }

        return (
          <div
            key={i}
            className="relative flex h-9 w-9 md:h-12 md:w-12 items-center justify-center rounded-sm border border-[var(--color-hairline)] bg-[var(--color-panel-2)]"
          >
            <motion.div
              className="h-5 w-5 md:h-7 md:w-7 rounded-full"
              animate={{ backgroundColor: color, boxShadow: glow }}
              transition={{ duration: 0.2 }}
            />
          </div>
        )
      })}
    </div>
  )
}
