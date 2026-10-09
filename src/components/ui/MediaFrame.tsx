import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useId, type CSSProperties, type KeyboardEvent } from 'react'
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
  const ratioStr = ratio ?? media.ratio ?? '16/9'

  const scrollRoot = useScrollRoot()
  const { scrollYProgress } = useScroll({
    target: ref,
    container: scrollRoot ?? undefined,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])

  const canZoom = zoomable && !!lightbox
  const isOpen = lightbox?.activeId === id

  const openZoom = () => {
    const el = ref.current
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
    <div
      ref={ref}
      role={canZoom ? 'button' : undefined}
      tabIndex={canZoom ? 0 : undefined}
      aria-label={canZoom ? `Expand: ${media.alt}` : undefined}
      onClick={canZoom ? openZoom : undefined}
      onKeyDown={canZoom ? onKeyDown : undefined}
      className={cn('group/frame relative overflow-hidden', canZoom && 'cursor-zoom-in', isOpen && 'invisible', className)}
      style={{ aspectRatio: toAspect(ratioStr), ...style }}
    >
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.12 }}
        animate={{ scale: state === 'show' ? 1 : 1.12 }}
        transition={{ duration: 1.4, ease: EASE_OUT }}
      >
        {/* Maior que a moldura para o deslocamento do parallax não expor as bordas. */}
        <motion.div className="absolute inset-x-0 -inset-y-[8%]" style={{ y: parallax && !reduceMotion ? y : 0 }}>
          <div
            className={cn(
              'h-full w-full transition-transform duration-700 ease-out-expo',
              (hoverZoom || canZoom) && 'group-hover/frame:scale-[1.035]',
            )}
          >
            <Media media={media} priority={priority} />
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
