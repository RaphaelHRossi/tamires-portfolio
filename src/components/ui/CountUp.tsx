import { animate, useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef } from 'react'
import { EASE_OUT } from '@/lib/motion'

/** Anima um valor numérico a partir de zero ao entrar na tela. Preserva prefixo, sufixo e zeros à esquerda. */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { amount: 0.6 })
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    const match = value.match(/^(\D*)(\d+(?:[.,]\d+)?)(.*)$/)
    if (!inView || !el || !match || reduceMotion) return
    const [, prefix = '', num = '0', suffix = ''] = match
    const target = parseFloat(num.replace(',', '.'))
    const decimals = num.includes('.') || num.includes(',') ? (num.split(/[.,]/)[1]?.length ?? 0) : 0
    const intDigits = num.split(/[.,]/)[0]?.length ?? 1
    const format = (v: number) => {
      const [int = '0', dec] = v.toFixed(decimals).split('.')
      return int.padStart(intDigits, '0') + (dec ? (num.includes(',') ? ',' : '.') + dec : '')
    }
    const controls = animate(0, target, {
      duration: 1.8,
      ease: EASE_OUT,
      onUpdate: (v) => {
        el.textContent = prefix + format(v) + suffix
      },
    })
    return () => controls.stop()
  }, [inView, value, reduceMotion])

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  )
}
