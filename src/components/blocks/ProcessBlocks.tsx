import { animate, useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { Media, toAspect } from '@/components/ui/Media'
import { MediaFrame } from '@/components/ui/MediaFrame'
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal'
import { Section, SectionHeader } from '@/components/ui/Section'
import { EASE_OUT } from '@/lib/motion'
import type { BeforeAfterBlock as CompareData, ProcessBlock as ProcessData } from '@/types'

export function ProcessBlock({ kicker, title, steps, tone }: ProcessData) {
  return (
    <Section tone={tone}>
      <SectionHeader kicker={kicker} title={title} />
      <Stagger
        as="ol"
        className="grid grid-cols-2 gap-x-4 gap-y-8 md:gap-x-6 lg:grid-cols-4 lg:gap-8"
        stagger={0.1}
      >
        {steps.map((step) => (
          <StaggerItem as="li" key={step.number} className="flex flex-col gap-2 lg:gap-4">
            <MediaFrame media={step.media} ratio={step.media.ratio ?? '1/1'} />
            <p className="flex gap-2 text-body">
              <span className="opacity-60">{step.number}</span>
              <span>{step.name}</span>
            </p>
            <p className="text-caption opacity-75">{step.description}</p>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  )
}

/** Comparação antes/depois controlada por um `input[type=range]` transparente (mouse, toque e teclado). */
export function BeforeAfterBlock({ kicker, title, before, after, beforeLabel = 'Before', afterLabel = 'After', tone }: CompareData) {
  const [pos, setPos] = useState(50)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const reduceMotion = useReducedMotion()

  // Indica a interação movendo o divisor uma vez ao entrar na tela.
  useEffect(() => {
    if (!inView || reduceMotion) return
    const controls = animate(50, [50, 35, 62, 50], {
      duration: 1.8,
      ease: EASE_OUT,
      delay: 0.3,
      onUpdate: setPos,
    })
    return () => controls.stop()
  }, [inView, reduceMotion])

  return (
    <Section tone={tone}>
      <SectionHeader kicker={kicker} title={title} />
      <Reveal amount={0.1}>
        <div
          ref={ref}
          className="relative overflow-hidden select-none"
          style={{ aspectRatio: toAspect(after.ratio ?? '16/9') }}
        >
          <div className="absolute inset-0">
            <Media media={after} showLabel={false} />
          </div>
          <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
            <Media media={before} showLabel={false} />
          </div>

          <span className="pointer-events-none absolute top-4 left-4 text-caption tracking-[0.08em] text-inverse uppercase">
            {beforeLabel}
          </span>
          <span className="pointer-events-none absolute top-4 right-4 text-caption tracking-[0.08em] text-inverse uppercase">
            {afterLabel}
          </span>

          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-inverse lg:w-1"
            style={{ left: `${pos}%` }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute top-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-inverse text-ink shadow-lg lg:size-16"
            style={{ left: `${pos}%` }}
          >
            <svg viewBox="0 0 20 12" className="w-1/2" fill="none" aria-hidden>
              <path d="M6 1 1 6l5 5M14 1l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <input
            type="range"
            min={0}
            max={100}
            step={0.1}
            value={pos}
            onChange={(e) => setPos(Number(e.target.value))}
            aria-label={`Compare ${beforeLabel} and ${afterLabel}`}
            className="absolute inset-0 h-full w-full cursor-ew-resize touch-pan-y opacity-0"
          />
        </div>
      </Reveal>
    </Section>
  )
}
