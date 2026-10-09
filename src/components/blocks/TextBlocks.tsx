import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal'
import { Section, SectionHeader } from '@/components/ui/Section'
import type { CreditsBlock as CreditsData, IntroBlock as IntroData, TextBlock as TextData } from '@/types'

export function IntroBlock({ title, paragraphs, info, tone }: IntroData) {
  return (
    <Section tone={tone}>
      <div className="grid gap-[calc(var(--gap)*1.5)] lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:gap-[clamp(3rem,5vw,6rem)]">
        <Reveal className="flex flex-col gap-[clamp(1rem,0.5rem+1.2vw,2rem)]">
          <h2 className="text-h2">{title}</h2>
          {paragraphs.map((p, i) => (
            <p key={i} className="max-w-[60rem] text-body-l text-pretty">
              {p}
            </p>
          ))}
        </Reveal>
        <Stagger as="dl" className="grid grid-cols-2 gap-x-6 gap-y-6 md:grid-cols-4 lg:grid-cols-1 lg:content-start">
          {info.map((item) => (
            <StaggerItem key={item.label}>
              <dt className="text-caption tracking-[0.08em] uppercase opacity-60">{item.label}</dt>
              <dd className="mt-1 text-body whitespace-pre-line">{item.value}</dd>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  )
}

export function TextBlock({ kicker, title, paragraphs, tone }: TextData) {
  return (
    <Section tone={tone}>
      {title && <SectionHeader kicker={kicker} title={title} />}
      <Reveal className="flex max-w-[60rem] flex-col gap-[clamp(1rem,0.5rem+1.2vw,2rem)]">
        {paragraphs.map((p, i) => (
          <p key={i} className="text-body-l text-pretty">
            {p}
          </p>
        ))}
      </Reveal>
    </Section>
  )
}

export function CreditsBlock({ title = 'Credits', items, tone }: CreditsData) {
  return (
    <Section tone={tone}>
      <div className="grid gap-(--gap) md:grid-cols-[minmax(0,15rem)_1fr] lg:grid-cols-[minmax(0,35rem)_1fr] lg:gap-[clamp(3rem,5vw,6rem)]">
        <Reveal>
          <h2 className="text-h2">{title}</h2>
        </Reveal>
        <Stagger as="ul" stagger={0.06}>
          {items.map((c) => (
            <StaggerItem
              as="li"
              key={c.role + c.name}
              className="flex items-baseline justify-between gap-4 border-b border-current/80 py-[clamp(0.75rem,0.5rem+0.5vw,1rem)]"
            >
              <span className="text-body opacity-70">{c.role}</span>
              <span className="text-right text-body">{c.name}</span>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  )
}
