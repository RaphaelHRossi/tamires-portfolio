import { motion } from 'motion/react'
import { Fragment } from 'react'
import { EASE_OUT } from '@/lib/motion'

interface SplitTextProps {
  text: string
  className?: string
  mode?: 'words' | 'chars'
  delay?: number
  stagger?: number
  duration?: number
}

/** Revela o texto por palavra ou caractere a partir de uma máscara. */
export function SplitText({
  text,
  className,
  mode = 'words',
  delay = 0,
  stagger,
  duration = 1,
}: SplitTextProps) {
  const words = text.split(' ')
  const step = stagger ?? (mode === 'chars' ? 0.035 : 0.08)
  let index = 0

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      {words.map((word, w) => (
        <Fragment key={w}>
          <span aria-hidden className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
            {(mode === 'chars' ? Array.from(word) : [word]).map((part, c) => {
              const i = index++
              return (
                <motion.span
                  key={c}
                  className="inline-block whitespace-pre"
                  initial={{ y: '115%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration, ease: EASE_OUT, delay: delay + i * step }}
                >
                  {part}
                </motion.span>
              )
            })}
          </span>
          {w < words.length - 1 && <span aria-hidden> </span>}
        </Fragment>
      ))}
    </span>
  )
}
