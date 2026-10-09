import { inView, motion, type HTMLMotionProps, type Variants } from 'motion/react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { EASE_OUT } from '@/lib/motion'

export type RevealState = 'show' | 'hiddenDown' | 'hiddenUp'

/** Visibilidade do elemento e, quando fora da tela, por qual borda ele saiu. */
export function useRevealState<T extends Element>(amount = 0.15) {
  const ref = useRef<T>(null)
  const [state, setState] = useState<RevealState>('hiddenDown')

  useEffect(() => {
    const el = ref.current
    if (!el) return
    return inView(
      el,
      () => {
        setState('show')
        return (entry) => {
          const viewportH = entry.rootBounds?.height ?? window.innerHeight
          setState(entry.boundingClientRect.top < viewportH / 2 ? 'hiddenUp' : 'hiddenDown')
        }
      },
      { amount },
    )
  }, [amount])

  return [ref, state] as const
}

const offsetVariants = (y: number, duration = 0.9, delay = 0): Variants => ({
  hiddenDown: { opacity: 0, y, transition: { duration: 0.5, ease: EASE_OUT } },
  hiddenUp: { opacity: 0, y: -y, transition: { duration: 0.5, ease: EASE_OUT } },
  show: { opacity: 1, y: 0, transition: { duration, ease: EASE_OUT, delay } },
})

interface RevealProps extends Omit<HTMLMotionProps<'div'>, 'initial' | 'animate'> {
  delay?: number
  y?: number
  amount?: number
}

/** Anima a entrada e a saída da tela conforme a direção da rolagem. */
export function Reveal({ delay = 0, y = 40, amount = 0.15, children, ...rest }: RevealProps) {
  const [ref, state] = useRevealState<HTMLDivElement>(amount)
  return (
    <motion.div ref={ref} variants={offsetVariants(y, 0.9, delay)} initial="hiddenDown" animate={state} {...rest}>
      {children}
    </motion.div>
  )
}

const itemVariants = offsetVariants(36, 0.85)

const containers = { div: motion.div, ul: motion.ul, ol: motion.ol, dl: motion.dl }

interface StaggerProps {
  as?: keyof typeof containers
  className?: string
  children: ReactNode
  stagger?: number
  amount?: number
}

/** Revela os filhos (`StaggerItem`) em sequência; ao rolar para cima, a ordem é invertida. */
export function Stagger({ as = 'div', className, children, stagger = 0.08, amount = 0.1 }: StaggerProps) {
  const Comp = containers[as] as typeof motion.div
  const [ref, state] = useRevealState<HTMLDivElement>(amount)
  const [fromTop, setFromTop] = useState(false)
  useEffect(() => {
    if (state === 'hiddenUp') setFromTop(true)
    else if (state === 'hiddenDown') setFromTop(false)
  }, [state])

  return (
    <Comp
      ref={ref}
      className={className}
      initial="hiddenDown"
      animate={state}
      variants={{
        hiddenDown: {},
        hiddenUp: {},
        show: { transition: { staggerChildren: stagger, staggerDirection: fromTop ? -1 : 1 } },
      }}
    >
      {children}
    </Comp>
  )
}

export function StaggerItem({
  as = 'div',
  className,
  children,
}: {
  as?: 'div' | 'li'
  className?: string
  children: ReactNode
}) {
  const Comp = (as === 'li' ? motion.li : motion.div) as typeof motion.div
  return (
    <Comp className={className} variants={itemVariants}>
      {children}
    </Comp>
  )
}
