import { motion, useReducedMotion } from 'motion/react'
import { Fragment, useEffect, useState } from 'react'
import { cn } from '@/lib/cn'

interface TypewriterProps {
  text: string
  className?: string
  /** Atraso inicial, em segundos. */
  startDelay?: number
  /** Intervalo médio entre caracteres, em segundos. */
  speed?: number
  caretAfter?: 'blink' | 'hide'
  onDone?: () => void
}

/**
 * Efeito de digitação. Os caracteres ocupam espaço desde o início (apenas invisíveis),
 * evitando deslocamento do layout em textos centralizados.
 */
export function Typewriter({
  text,
  className,
  startDelay = 0.5,
  speed = 0.09,
  caretAfter = 'hide',
  onDone,
}: TypewriterProps) {
  const reduceMotion = useReducedMotion()
  const chars = Array.from(text)
  const [count, setCount] = useState(reduceMotion ? chars.length : 0)
  const done = count >= chars.length

  useEffect(() => {
    if (reduceMotion) {
      onDone?.()
      return
    }
    let i = 0
    let timer: number
    const tick = () => {
      i += 1
      setCount(i)
      if (i >= chars.length) {
        onDone?.()
        return
      }
      const prev = chars[i - 1]
      const pause = prev === ' ' || prev === ' ' ? 0.12 : 0
      timer = window.setTimeout(tick, (speed * (0.55 + Math.random() * 0.9) + pause) * 1000)
    }
    timer = window.setTimeout(tick, startDelay * 1000)
    return () => window.clearTimeout(timer)
  }, [text, reduceMotion])

  const caret = <Caret blinking={count === 0 || done} hidden={done && caretAfter === 'hide'} />

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {count === 0 && caret}
        {chars.map((char, i) => (
          <Fragment key={i}>
            <span className={cn('transition-opacity duration-75', i < count ? 'opacity-100' : 'opacity-0')}>
              {char}
            </span>
            {i === count - 1 && caret}
          </Fragment>
        ))}
      </span>
    </span>
  )
}

/** Posicionado de forma absoluta para não alterar a largura do texto. */
function Caret({ blinking, hidden }: { blinking: boolean; hidden: boolean }) {
  return (
    <span className="relative">
      <motion.span
        className="absolute bottom-[0.18em] left-[0.04em] h-[0.72em] w-[0.04em] bg-current"
        animate={hidden ? { opacity: 0 } : blinking ? { opacity: [1, 1, 0, 0] } : { opacity: 1 }}
        transition={
          hidden
            ? { duration: 0.4 }
            : blinking
              ? { duration: 1.05, repeat: Infinity, times: [0, 0.5, 0.5, 1], ease: 'linear' }
              : { duration: 0 }
        }
      />
    </span>
  )
}
