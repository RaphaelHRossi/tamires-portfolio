import { AnimatePresence, motion } from 'motion/react'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Media } from '@/components/ui/Media'
import { EASE_IN_OUT, EASE_OUT } from '@/lib/motion'
import type { MediaItem } from '@/types'
import type { Rect } from './FlightContext'

/** Lightbox: a mídia é ampliada a partir da posição de origem e retorna a ela ao fechar. */

interface OpenArgs {
  id: string
  media: MediaItem
  /** largura / altura */
  ratio: number
  getRect: () => Rect
}

interface LightboxApi {
  open: (args: OpenArgs) => void
  activeId: string | null
}

const LightboxContext = createContext<LightboxApi | null>(null)

function fitRect(ratio: number): Rect {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const pad = Math.min(64, Math.max(16, vw * 0.04))
  const maxW = vw - pad * 2
  const maxH = vh - pad * 2 - (vw < 768 ? 56 : 0) // área do botão de fechar no mobile
  let width = maxW
  let height = width / ratio
  if (height > maxH) {
    height = maxH
    width = height * ratio
  }
  return { left: (vw - width) / 2, top: (vh - height) / 2 + (vw < 768 ? 20 : 0), width, height }
}

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [item, setItem] = useState<(OpenArgs & { from: Rect; to: Rect }) | null>(null)
  const [exitRect, setExitRect] = useState<Rect | null>(null)
  const itemRef = useRef(item)
  itemRef.current = item

  const open = useCallback((args: OpenArgs) => {
    const from = args.getRect()
    setExitRect(from)
    setItem({ ...args, from, to: fitRect(args.ratio) })
  }, [])

  const close = useCallback(() => {
    const current = itemRef.current
    if (current) setExitRect(current.getRect())
    setItem(null)
  }, [])

  useEffect(() => {
    if (!item) return
    const onResize = () => setItem((c) => (c ? { ...c, to: fitRect(c.ratio) } : c))
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [item])

  const value = useMemo(() => ({ open, activeId: item?.id ?? null }), [open, item?.id])

  return (
    <LightboxContext.Provider value={value}>
      {children}
      <AnimatePresence custom={exitRect}>{item && <LightboxView key={item.id} item={item} onClose={close} />}</AnimatePresence>
    </LightboxContext.Provider>
  )
}

function LightboxView({ item, onClose }: { item: OpenArgs & { from: Rect; to: Rect }; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    closeRef.current?.focus({ preventScroll: true })
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Tab') {
        e.preventDefault()
        if (e.key === 'Escape') onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      previous?.focus?.({ preventScroll: true })
    }
  }, [onClose])

  const isVideo = item.media.kind === 'video' && !!item.media.src

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label={item.media.alt}>
      <motion.div
        aria-hidden
        className="absolute inset-0 cursor-zoom-out bg-black/85"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.45 } }}
        exit={{ opacity: 0, transition: { duration: 0.45, delay: 0.05 } }}
        onClick={onClose}
      />

      <motion.div
        className="absolute overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
        custom={item.from}
        variants={{
          from: (rect: Rect) => ({ ...rect }),
        }}
        initial={{ ...item.from }}
        animate={{ ...item.to, transition: { duration: 0.65, ease: EASE_IN_OUT } }}
        exit="from"
        transition={{ duration: 0.55, ease: EASE_IN_OUT }}
      >
        {isVideo ? (
          <video
            src={item.media.src}
            poster={item.media.poster}
            aria-label={item.media.alt}
            controls
            autoPlay
            playsInline
            loop
            className="h-full w-full bg-black object-contain"
          />
        ) : (
          <Media media={item.media} priority />
        )}
      </motion.div>

      <motion.button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 grid size-11 cursor-pointer place-items-center rounded-full bg-inverse/15 text-inverse backdrop-blur transition-colors duration-300 hover:bg-inverse/30 md:top-6 md:right-6 md:size-12"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1, transition: { duration: 0.4, delay: 0.3, ease: EASE_OUT } }}
        exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </motion.button>
    </div>
  )
}

export function useLightbox() {
  return useContext(LightboxContext)
}
