import { motion, useTransform, type MotionValue } from 'motion/react'
import { useRef } from 'react'
import { Media } from '@/components/ui/Media'
import { cn } from '@/lib/cn'
import { EASE_OUT } from '@/lib/motion'
import type { Project } from '@/types'
import { cardGeometry, dimAmount, wrapDelta, type CarouselDims } from './geometry'

const DIM_FILTER = 'grayscale(0.85) brightness(0.84)'

interface CarouselCardProps {
  project: Project
  index: number
  slot: number
  slots: number
  progress: MotionValue<number>
  dimsMV: MotionValue<CarouselDims | null>
  dims: CarouselDims
  active: boolean
  hidden: boolean
  intro: boolean
  introDelay: number
  onSelect: (clip: HTMLElement | null) => void
}

export function CarouselCard({
  project,
  index,
  slot,
  slots,
  progress,
  dimsMV,
  dims,
  active,
  hidden,
  intro,
  introDelay,
  onSelect,
}: CarouselCardProps) {
  const clipRef = useRef<HTMLDivElement>(null)

  // Valores derivados de MotionValues: atualizados por frame sem re-render.
  const geo = () => cardGeometry(wrapDelta(slot - progress.get(), slots), dimsMV.get() ?? dims)
  const x = useTransform(() => geo().left)
  const y = useTransform(() => geo().top)
  const scale = useTransform(() => geo().scale)
  const metaY = useTransform(() => geo().metaTop)
  const metaW = useTransform(() => geo().width)
  const activeMetaOpacity = useTransform(() => 1 - geo().near)
  const inactiveMetaOpacity = useTransform(() => geo().near)
  const dimOpacity = useTransform(() => dimAmount(geo().ad))

  const enter = intro
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.9, ease: EASE_OUT, delay: introDelay } }
    : {}

  return (
    <>
      <motion.button
        type="button"
        data-card={index}
        data-slot={slot}
        aria-label={active ? `Open ${project.title}, ${project.year}` : `Show ${project.title}, ${project.year}`}
        aria-current={active ? 'true' : undefined}
        onClick={() => onSelect(clipRef.current)}
        className={cn(
          'group absolute top-0 left-0 block cursor-pointer outline-none',
          'focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-page',
        )}
        style={{ x, y, scale, originX: 0, originY: 0, width: dims.aw, height: dims.ah }}
        {...enter}
      >
        <div ref={clipRef} className={cn('relative h-full w-full overflow-hidden', hidden && 'invisible')}>
          <div
            className={cn(
              'relative h-full w-full transition-transform duration-[900ms] ease-out-expo',
              active && 'group-hover:scale-[1.04]',
            )}
          >
            <Media media={project.cover} priority={Math.abs(wrapDelta(slot - progress.get(), slots)) < 3} />
            {/* Camada com filtro fixo; apenas a opacidade é animada. */}
            <motion.div aria-hidden className="absolute inset-0" style={{ opacity: dimOpacity, filter: DIM_FILTER }}>
              <Media media={project.cover} showLabel={false} />
            </motion.div>
          </div>
        </div>
      </motion.button>

      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-0 left-0"
        style={{ x, y: metaY, width: metaW }}
        {...enter}
      >
        <motion.div
          style={{ opacity: activeMetaOpacity }}
          className="absolute inset-x-0 top-0 flex items-baseline justify-between gap-4 text-body-l md:text-h3"
        >
          <span className="truncate" title={project.title}>
            {project.title}
          </span>
          <span className="shrink-0">{project.year}</span>
        </motion.div>
        <motion.div
          style={{ opacity: inactiveMetaOpacity }}
          className="absolute inset-x-0 top-0 flex flex-col pt-1 pl-2 text-caption leading-snug lg:pl-4 lg:text-body"
        >
          <span className="truncate">{project.title}</span>
          <span>{project.year}</span>
        </motion.div>
      </motion.div>
    </>
  )
}
