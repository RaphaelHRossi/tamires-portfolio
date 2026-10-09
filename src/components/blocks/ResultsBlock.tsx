import { CountUp } from '@/components/ui/CountUp'
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal'
import { Section, SectionHeader } from '@/components/ui/Section'
import { cn } from '@/lib/cn'
import type { Metric, ResultsBlock as ResultsData } from '@/types'

export function MetricsRow({ metrics, inverse }: { metrics: Metric[]; inverse?: boolean }) {
  return (
    <Stagger as="dl" className="grid gap-6 md:grid-cols-3 lg:gap-12" stagger={0.1}>
      {metrics.map((m) => (
        <StaggerItem key={m.label} className="flex flex-col gap-1 border-t border-current/80 pt-4 lg:pt-6">
          <dt className="sr-only">{m.label}</dt>
          <dd className={cn('font-display text-[clamp(3.5rem,2.3rem+4.6vw,7rem)] leading-[0.95] lining-nums', !inverse && 'text-accent')}>
            <CountUp value={m.value} />
          </dd>
          <dd aria-hidden className="text-body-l">
            {m.label}
          </dd>
        </StaggerItem>
      ))}
    </Stagger>
  )
}

export function ResultsBlock({ kicker, title, metrics, quote, quoteAuthor, tone }: ResultsData) {
  return (
    <Section tone={tone}>
      <SectionHeader kicker={kicker} title={title} />
      <MetricsRow metrics={metrics} inverse={tone === 'alt'} />
      {quote && (
        <Reveal className="mt-[calc(var(--gap)*2)] max-w-[68rem]">
          <blockquote className="font-display text-[clamp(1.5rem,1.04rem+1.9vw,2.75rem)] leading-[1.1] text-balance italic">
            “{quote.replace(/^[“"]|[”"]$/g, '')}”
          </blockquote>
          {quoteAuthor && <p className="mt-4 text-body opacity-70">— {quoteAuthor}</p>}
        </Reveal>
      )}
    </Section>
  )
}
