import { useInView } from 'motion/react'
import { useEffect, useRef } from 'react'
import { cn } from '@/lib/cn'
import type { MediaItem } from '@/types'

export const toAspect = (ratio?: string) => (ratio ? ratio.replace('/', ' / ') : undefined)

export const ratioValue = (ratio?: string, fallback = 16 / 9) => {
  const [w, h] = (ratio ?? '').split('/').map(Number)
  return w && h ? w / h : fallback
}

interface MediaProps {
  media: MediaItem
  className?: string
  priority?: boolean
  showLabel?: boolean
}

/**
 * Imagem, vídeo (reproduz sem som quando visível) ou placeholder quando não há `src`.
 * Ocupa 100% do elemento pai.
 */
export function Media({ media, className, priority = false, showLabel = true }: MediaProps) {
  if (!media.src) return <Placeholder media={media} className={className} showLabel={showLabel} />
  if (media.kind === 'video') return <AutoVideo media={media} className={className} />
  return (
    <img
      src={media.src}
      alt={media.alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
      className={cn('block h-full w-full object-cover', className)}
    />
  )
}

function Placeholder({ media, className, showLabel }: { media: MediaItem; className?: string; showLabel: boolean }) {
  const label =
    media.label ?? `${media.kind === 'video' ? 'Vídeo' : 'Imagem'}${media.ratio ? ` · ${media.ratio.replace('/', ':')}` : ''}`
  return (
    <div
      role="img"
      aria-label={media.alt}
      className={cn(
        'flex h-full w-full items-center justify-center select-none',
        media.tone === 'muted' ? 'bg-placeholder-muted' : 'bg-placeholder',
        className,
      )}
    >
      {showLabel && <span className="px-2 text-center text-caption text-inverse/65">{label}</span>}
    </div>
  )
}

function AutoVideo({ media, className }: { media: MediaItem; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const inView = useInView(ref, { amount: 0.35 })

  useEffect(() => {
    const video = ref.current
    if (!video) return
    if (inView) video.play().catch(() => {})
    else video.pause()
  }, [inView])

  return (
    <video
      ref={ref}
      src={media.src}
      poster={media.poster}
      aria-label={media.alt}
      muted
      loop
      playsInline
      preload="metadata"
      className={cn('block h-full w-full object-cover', className)}
    />
  )
}
