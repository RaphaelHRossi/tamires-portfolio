import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useId, useRef, type CSSProperties, type KeyboardEvent } from 'react'
import { useScrollRoot } from '@/components/Page'
import { toRect } from '@/context/FlightContext'
import { useLightbox } from '@/context/LightboxContext'
import { cn } from '@/lib/cn'
import { EASE_OUT } from '@/lib/motion'
import type { MediaItem } from '@/types'
import { Media, ratioValue, toAspect } from './Media'
import { useRevealState } from './Reveal'

interface MediaFrameProps {
  media: MediaItem
  ratio?: string
  className?: string
  hoverZoom?: boolean
  /** Desative quando a mídia estiver dentro de um link. */
  zoomable?: boolean
  parallax?: boolean
  priority?: boolean
  style?: CSSProperties
}

/** Mídia com proporção fixa, revelação ao entrar na tela, parallax e ampliação (lightbox). */
export function MediaFrame({
  media,
  ratio,
  className,
  hoverZoom,
  zoomable = true,
  parallax = true,
  priority,
  style,
}: MediaFrameProps) {
  const id = useId()
  const lightbox = useLightbox()
  const reduceMotion = useReducedMotion()
  const [ref, state] = useRevealState<HTMLDivElement>(0.05)
  const frameRef = useRef<HTMLDivElement>(null)
  const ratioStr = ratio ?? media.ratio ?? '16/9'

  const scrollRoot = useScrollRoot()
  const { scrollYProgress } = useScroll({
    target: ref,
    container: scrollRoot ?? undefined,
    offset: ['start end', 'end start'],
  })
  // O parallax desloca a moldura inteira, sem cortar as bordas da mídia.
  const y = useTransform(scrollYProgress, [0, 1], [24, -24])

  const canZoom = zoomable && !!lightbox
  const isOpen = lightbox?.activeId === id

  const openZoom = () => {
    const el = frameRef.current
    if (!canZoom || !el) return
    // Proporção real do arquivo, para exibir a mídia inteira quando ampliada.
    const img = el.querySelector('img')
    const video = el.querySelector('video')
    const natural =
      img && img.naturalWidth
        ? img.naturalWidth / img.naturalHeight
        : video && video.videoWidth
          ? video.videoWidth / video.videoHeight
          : ratioValue(ratioStr)
    lightbox.open({ id, media, ratio: natural, getRect: () => toRect(el.getBoundingClientRect()) })
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      openZoom()
    }
  }

  return (
    <motion.div
      ref={ref}
      className={cn('relative', isOpen && 'invisible', className)}
      style={{ y: parallax && !reduceMotion ? y : 0 }}
    >
      <div
        ref={frameRef}
        role={canZoom ? 'button' : undefined}
        tabIndex={canZoom ? 0 : undefined}
        aria-label={canZoom ? `Expand: ${media.alt}` : undefined}
        onClick={canZoom ? openZoom : undefined}
        onKeyDown={canZoom ? onKeyDown : undefined}
        className={cn(
          'group/frame relative overflow-hidden transition-transform duration-700 ease-out-expo',
          canZoom && 'cursor-zoom-in',
          (hoverZoom || canZoom) && 'hover:scale-[1.015]',
        )}
        style={{ aspectRatio: toAspect(ratioStr), ...style }}
      >
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.12 }}
          animate={{ scale: state === 'show' ? 1 : 1.12 }}
          transition={{ duration: 1.4, ease: EASE_OUT }}
        >
          <Media media={media} priority={priority} />
        </motion.div>
      </div>
    </motion.div>
  )
}
