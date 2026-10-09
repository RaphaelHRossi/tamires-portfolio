import { motion, useIsPresent, useScroll, useSpring } from 'motion/react'
import { createContext, useContext, useRef, type ReactNode, type RefObject } from 'react'
import { cn } from '@/lib/cn'
import { EASE_OUT } from '@/lib/motion'

const ScrollRootContext = createContext<RefObject<HTMLElement | null> | null>(null)

/** Container de rolagem da página atual. */
export const useScrollRoot = () => useContext(ScrollRootContext)

interface PageProps {
  children: ReactNode
  scrollable?: boolean
  className?: string
}

/**
 * Camada fixa com rolagem própria abaixo do header. Permite que a página que sai
 * e a que entra fiquem sobrepostas durante a transição, sem salto de scroll.
 */
export function Page({ children, scrollable = true, className }: PageProps) {
  const ref = useRef<HTMLElement>(null)
  const isPresent = useIsPresent()

  return (
    <ScrollRootContext.Provider value={ref}>
      <motion.main
        ref={ref}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.6, ease: EASE_OUT } }}
        exit={{ opacity: 0, transition: { duration: 0.4, ease: 'easeOut' } }}
        className={cn(
          'fixed inset-x-0 top-(--header-h) bottom-0',
          scrollable ? 'overflow-x-hidden overflow-y-auto overscroll-y-contain' : 'overflow-hidden',
          isPresent ? 'z-20' : 'pointer-events-none z-10',
          className,
        )}
      >
        {children}
      </motion.main>
    </ScrollRootContext.Provider>
  )
}

export function ScrollProgress() {
  const container = useScrollRoot()
  const { scrollYProgress } = useScroll({ container: container ?? undefined })
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40 })
  return (
    <motion.div
      aria-hidden
      className="sticky top-0 z-10 -mb-[2px] h-[2px] origin-left bg-accent"
      style={{ scaleX }}
    />
  )
}
