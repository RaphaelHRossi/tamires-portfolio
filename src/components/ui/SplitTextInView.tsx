import { motion } from 'motion/react'
import { Fragment } from 'react'
import { EASE_OUT } from '@/lib/motion'
import { useRevealState } from './Reveal'

/** Variante do SplitText disparada pela rolagem, respeitando a direção. */
export function SplitTextInView({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const words = text.split(' ')
  const [ref, state] = useRevealState<HTMLSpanElement>(0.5)
  return (
    <motion.span
      ref={ref}
      className={className}
      initial="hiddenDown"
      animate={state}
      variants={{
        hiddenDown: {},
        hiddenUp: {},
        show: { transition: { staggerChildren: 0.08, delayChildren: delay } },
      }}
    >
      <span className="sr-only">{text}</span>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span aria-hidden className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
            <motion.span
              className="inline-block"
              variants={{
                hiddenDown: { y: '115%', transition: { duration: 0.4 } },
                hiddenUp: { y: '-115%', transition: { duration: 0.4 } },
                show: { y: '0%', transition: { duration: 1, ease: EASE_OUT } },
              }}
            >
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 && <span aria-hidden> </span>}
        </Fragment>
      ))}
    </motion.span>
  )
}
