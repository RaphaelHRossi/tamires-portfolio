import { motion, useReducedMotion } from 'motion/react'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Media } from '@/components/ui/Media'
import { EASE_IN_OUT, FLIGHT_DURATION } from '@/lib/motion'
import type { MediaItem } from '@/types'

/**
 * Transição compartilhada da imagem entre o card do carrossel e o banner do projeto.
 * A origem chama `start()` e navega; o destino mede sua posição e chama `land()`.
 * Um clone fixo anima `left/top/width/height`, preservando o recorte de `object-fit: cover`.
 */

export interface Rect {
  left: number
  top: number
  width: number
  height: number
}

type FlightTarget = 'banner' | 'card'

interface Flight {
  id: number
  slug: string
  media: MediaItem
  from: Rect
  to?: Rect
  target: FlightTarget
}

interface FlightApi {
  flight: Flight | null
  start: (flight: Omit<Flight, 'id' | 'to'>) => void
  land: (slug: string, target: FlightTarget, rect: Rect) => void
  isFlying: (slug: string) => boolean
}

const FlightContext = createContext<FlightApi | null>(null)

export const toRect = (r: DOMRect): Rect => ({ left: r.left, top: r.top, width: r.width, height: r.height })

export function FlightProvider({ children }: { children: ReactNode }) {
  const [flight, setFlight] = useState<Flight | null>(null)
  const idRef = useRef(0)
  const reduceMotion = useReducedMotion()

  const start = useCallback<FlightApi['start']>(
    (f) => {
      if (reduceMotion) return
      idRef.current += 1
      setFlight({ ...f, id: idRef.current })
    },
    [reduceMotion],
  )

  const land = useCallback<FlightApi['land']>((slug, target, rect) => {
    setFlight((f) => (f && !f.to && f.slug === slug && f.target === target ? { ...f, to: rect } : f))
  }, [])

  const finish = useCallback((id: number) => setFlight((f) => (f?.id === id ? null : f)), [])

  // Encerra a transição caso o destino não seja montado.
  const flightId = flight?.id
  useEffect(() => {
    if (flightId == null) return
    const t = window.setTimeout(() => finish(flightId), (FLIGHT_DURATION + 1) * 1000)
    return () => window.clearTimeout(t)
  }, [flightId, finish])

  const isFlying = useCallback((slug: string) => flight?.slug === slug, [flight])
  const value = useMemo(() => ({ flight, start, land, isFlying }), [flight, start, land, isFlying])

  return (
    <FlightContext.Provider value={value}>
      {children}
      {flight?.to && <FlightOverlay key={flight.id} flight={flight} onDone={() => finish(flight.id)} />}
    </FlightContext.Provider>
  )
}

function FlightOverlay({ flight, onDone }: { flight: Flight; onDone: () => void }) {
  const { from, to } = flight
  if (!to) return null
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed z-30 overflow-hidden"
      initial={{ left: from.left, top: from.top, width: from.width, height: from.height }}
      animate={{ left: to.left, top: to.top, width: to.width, height: to.height }}
      transition={{ duration: FLIGHT_DURATION, ease: EASE_IN_OUT }}
      onAnimationComplete={onDone}
    >
      <Media media={flight.media} priority />
    </motion.div>
  )
}

export function useFlight() {
  const ctx = useContext(FlightContext)
  if (!ctx) throw new Error('useFlight precisa estar dentro de <FlightProvider>')
  return ctx
}
