import { useIsPresent, useMotionValue, useMotionValueEvent, useReducedMotion, useSpring } from 'motion/react'
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { useContact } from '@/context/ContactContext'
import { toRect, useFlight } from '@/context/FlightContext'
import { carouselMemory } from '@/lib/carouselMemory'
import { cn } from '@/lib/cn'
import { CAROUSEL_SPRING } from '@/lib/motion'
import type { Project } from '@/types'
import { CarouselCard } from './CarouselCard'
import { activeRect, computeDims, mod, sameDims, slotCount, stepPx, wrapDelta, type CarouselDims } from './geometry'

/** Deslocamento da roda/trackpad (px) equivalente a um card. */
const WHEEL_PX_PER_CARD = 200
/** Inatividade (ms) antes de alinhar ao card mais próximo. */
const WHEEL_SETTLE_MS = 140

interface CarouselProps {
  projects: Project[]
  className?: string
  children?: ReactNode
}

/**
 * Carrossel infinito controlado por roda/trackpad, arrasto, teclado e clique.
 * A lista é repetida em slots (`slotCount`) e cada slot é posicionado pela distância
 * circular até `progress`, de modo que a troca de posição ocorre fora da área visível.
 */
export function Carousel({ projects, className, children }: CarouselProps) {
  const navigate = useNavigate()
  const { flight, start, land, isFlying } = useFlight()
  const { isOpen: contactOpen } = useContact()
  const isPresent = useIsPresent()
  const reduceMotion = useReducedMotion()

  const n = projects.length
  const slots = slotCount(n)
  const projectAt = useCallback((slot: number) => mod(slot, n), [n])

  // Prioridade: projeto de origem da transição de volta, último visto, item central.
  const [setup] = useState(() => {
    const returning = flight?.target === 'card' ? projects.findIndex((p) => p.slug === flight.slug) : -1
    const memory = carouselMemory.get()
    const index = returning >= 0 ? returning : memory != null && memory < n ? memory : Math.floor(n / 2)
    return { index, intro: returning < 0 && !reduceMotion }
  })

  // `target` recebe as entradas; `progress` o acompanha com uma mola e dirige a animação.
  const target = useMotionValue(setup.intro ? setup.index + 2.5 : setup.index)
  const progress = useSpring(target, reduceMotion ? { stiffness: 900, damping: 90 } : CAROUSEL_SPRING)

  const [activeSlot, setActiveSlot] = useState(setup.index)
  useMotionValueEvent(progress, 'change', (v) => {
    const slot = mod(Math.round(v), slots)
    setActiveSlot((prev) => (prev === slot ? prev : slot))
  })
  const active = projectAt(activeSlot)
  useEffect(() => carouselMemory.set(active), [active])

  useEffect(() => {
    if (!setup.intro) return
    const id = requestAnimationFrame(() => target.set(setup.index))
    return () => cancelAnimationFrame(id)
  }, [setup, target])

  const regionRef = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState<CarouselDims | null>(null)
  const dimsMV = useMotionValue<CarouselDims | null>(null)

  useLayoutEffect(() => {
    const el = regionRef.current
    if (!el) return
    const measure = () => {
      const r = el.getBoundingClientRect()
      const next = computeDims(r.width, r.height)
      if (sameDims(dimsMV.get(), next)) return
      dimsMV.set(next)
      setDims(next)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [dimsMV])

  // Transição de volta: centraliza o projeto e informa o destino da imagem.
  useLayoutEffect(() => {
    if (!dims || !flight || flight.target !== 'card' || flight.to) return
    const idx = projects.findIndex((p) => p.slug === flight.slug)
    const el = regionRef.current
    if (idx < 0 || !el) return
    target.jump(idx)
    progress.jump(idx)
    const r = el.getBoundingClientRect()
    const a = activeRect(dims)
    land(flight.slug, 'card', { left: r.left + a.left, top: r.top + a.top, width: a.width, height: a.height })
  }, [dims, flight, projects, target, progress, land])

  const step = useCallback((dir: 1 | -1) => target.set(Math.round(target.get()) + dir), [target])

  const goToSlot = useCallback(
    (slot: number) => {
      const from = Math.round(target.get())
      target.set(from + Math.round(wrapDelta(slot - from, slots)))
    },
    [target, slots],
  )

  const goToProject = useCallback(
    (index: number) => {
      const from = Math.round(target.get())
      target.set(from + Math.round(wrapDelta(index - projectAt(from), n)))
    },
    [target, projectAt, n],
  )

  const open = (index: number, clip: HTMLElement | null) => {
    const project = projects[index]
    if (!project) return
    if (clip) start({ slug: project.slug, media: project.cover, from: toRect(clip.getBoundingClientRect()), target: 'banner' })
    carouselMemory.set(index)
    navigate(`/projects/${project.slug}`)
  }

  const select = (slot: number, clip: HTMLElement | null) => {
    if (slot === activeSlot && Math.abs(wrapDelta(slot - progress.get(), slots)) < 0.2) open(projectAt(slot), clip)
    else goToSlot(slot)
  }

  const enabledRef = useRef(true)
  enabledRef.current = isPresent && !contactOpen

  useEffect(() => {
    let settle: number | undefined
    let gestureFrom: number | null = null

    const onWheel = (e: WheelEvent) => {
      if (!enabledRef.current) return
      e.preventDefault()
      const raw = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
      const delta = e.deltaMode === 1 ? raw * 40 : e.deltaMode === 2 ? raw * 800 : raw
      if (!delta) return
      if (gestureFrom === null) gestureFrom = Math.round(target.get())
      target.set(target.get() + delta / WHEEL_PX_PER_CARD)

      window.clearTimeout(settle)
      settle = window.setTimeout(() => {
        const from = gestureFrom ?? Math.round(target.get())
        const v = target.get()
        let snap = Math.round(v)
        // Um único passo da roda já avança um card.
        if (snap === from && Math.abs(v - from) > 0.12) snap = from + Math.sign(v - from)
        target.set(snap)
        gestureFrom = null
      }, WHEEL_SETTLE_MS)
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.clearTimeout(settle)
    }
  }, [target])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!enabledRef.current) return
      const el = e.target as HTMLElement | null
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) return
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') step(1)
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') step(-1)
      else if (e.key === 'Home') goToProject(0)
      else if (e.key === 'End') goToProject(n - 1)
      else return
      e.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [step, goToProject, n])

  const drag = useRef<{
    id: number
    x: number
    fromValue: number
    fromIndex: number
    moved: boolean
    lastX: number
    lastT: number
    v: number
  } | null>(null)
  const suppressClick = useRef(false)

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (!enabledRef.current || (e.pointerType === 'mouse' && e.button !== 0)) return
    const v = target.get()
    drag.current = { id: e.pointerId, x: e.clientX, fromValue: v, fromIndex: Math.round(v), moved: false, lastX: e.clientX, lastT: e.timeStamp, v: 0 }
  }

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const g = drag.current
    if (!g || g.id !== e.pointerId || !dims) return
    const dx = e.clientX - g.x
    if (!g.moved) {
      if (Math.abs(dx) < 6) return
      g.moved = true
      e.currentTarget.setPointerCapture(e.pointerId)
    }
    target.set(g.fromValue - dx / stepPx(dims))
    const dt = e.timeStamp - g.lastT
    if (dt > 0) g.v = (e.clientX - g.lastX) / dt
    g.lastX = e.clientX
    g.lastT = e.timeStamp
  }

  const endDrag = (e: PointerEvent<HTMLDivElement>) => {
    const g = drag.current
    if (!g || g.id !== e.pointerId) return
    drag.current = null
    if (!g.moved || !dims) return
    suppressClick.current = true
    window.setTimeout(() => (suppressClick.current = false), 50)
    // Projeta a posição final a partir da velocidade do gesto.
    const projected = target.get() - (g.v * 120) / stepPx(dims)
    let snap = Math.round(projected)
    if (snap === g.fromIndex && Math.abs(projected - g.fromIndex) > 0.15) snap = g.fromIndex + Math.sign(projected - g.fromIndex)
    target.set(snap)
  }

  const current = projects[active]
  const slotList = Array.from({ length: slots }, (_, slot) => slot)

  return (
    <div
      ref={regionRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Selected projects"
      className={cn('relative touch-none overflow-hidden select-none', className)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onClickCapture={(e) => {
        if (suppressClick.current) {
          e.stopPropagation()
          e.preventDefault()
        }
      }}
    >
      {children}
      {dims &&
        slotList.map((slot) => {
          const project = projects[projectAt(slot)]!
          const isActive = slot === activeSlot
          return (
            <CarouselCard
              key={`${project.slug}-${Math.floor(slot / n)}`}
              project={project}
              index={projectAt(slot)}
              slot={slot}
              slots={slots}
              progress={progress}
              dims={dims}
              dimsMV={dimsMV}
              active={isActive}
              hidden={isActive && isFlying(project.slug)}
              intro={setup.intro}
              introDelay={0.25 + Math.abs(wrapDelta(slot - setup.index, slots)) * 0.06}
              onSelect={(clip) => select(slot, clip)}
            />
          )
        })}
      {current && (
        <p className="sr-only" aria-live="polite">
          {`${current.title}, ${current.year} — ${active + 1} of ${n}`}
        </p>
      )}
    </div>
  )
}
