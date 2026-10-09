import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import type { Tone } from '@/types'
import { Reveal } from './Reveal'

interface SectionProps {
  tone?: Tone
  className?: string
  innerClassName?: string
  children: ReactNode
  id?: string
}

export function Section({ tone = 'default', className, innerClassName, children, id }: SectionProps) {
  return (
    <section
      id={id}
      data-tone={tone}
      className={cn('px-(--gutter) py-(--section-y)', tone === 'alt' && 'bg-alt text-inverse', className)}
    >
      <div className={cn('mx-auto w-full max-w-[105rem]', innerClassName)}>{children}</div>
    </section>
  )
}

export function SectionHeader({
  kicker,
  title,
  align = 'left',
  className,
}: {
  kicker?: string
  title: string
  align?: 'left' | 'center' | 'right'
  className?: string
}) {
  return (
    <Reveal
      className={cn(
        'mb-(--gap) flex flex-col gap-2 lg:gap-4',
        align === 'center' && 'items-center text-center',
        align === 'right' && 'items-end text-right',
        className,
      )}
    >
      {kicker && <p className="text-caption tracking-[0.08em] uppercase opacity-70">{kicker}</p>}
      <h2 className="text-h2 text-balance">{title}</h2>
    </Reveal>
  )
}
