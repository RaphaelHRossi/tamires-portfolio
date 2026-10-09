import { motion } from 'motion/react'
import { Footer } from '@/components/Footer'
import { Page } from '@/components/Page'
import { LetsTalk } from '@/components/blocks/EndBlocks'
import { MetricsRow } from '@/components/blocks/ResultsBlock'
import { Media } from '@/components/ui/Media'
import { MediaFrame } from '@/components/ui/MediaFrame'
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal'
import { Section } from '@/components/ui/Section'
import { SplitText } from '@/components/ui/SplitText'
import { SplitTextInView } from '@/components/ui/SplitTextInView'
import { about } from '@/data/about'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { EASE_IN_OUT, EASE_OUT } from '@/lib/motion'

const R = 'clamp(1rem, 0.5rem + 1.6vw, 2rem)'

/** Canto côncavo que integra o recorte do título à imagem. */
function InvertedCorner({ className }: { className: string }) {
  return (
    <span
      aria-hidden
      className={`absolute ${className}`}
      style={{
        width: R,
        height: R,
        background: `radial-gradient(circle at 100% 100%, transparent calc(${R} - 0.5px), var(--color-page) ${R})`,
      }}
    />
  )
}

export default function About() {
  useDocumentTitle('About')

  return (
    <Page>
      <section className="px-(--gutter-header) pt-[clamp(0.5rem,0.25rem+1vw,2rem)]">
        <motion.div
          className="relative aspect-[5/4] w-full overflow-hidden md:aspect-[2/1] lg:aspect-[11/4]"
          style={{ borderRadius: R }}
          initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          transition={{ duration: 1.2, ease: EASE_IN_OUT, delay: 0.1 }}
        >
          <motion.div
            className="h-full w-full"
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.8, ease: EASE_OUT, delay: 0.1 }}
          >
            <Media media={about.hero} priority />
          </motion.div>

          <div
            className="absolute top-0 left-0 bg-page pr-[clamp(1.25rem,0.75rem+2vw,3rem)] pb-[clamp(0.75rem,0.5rem+1.2vw,2rem)]"
            style={{ borderBottomRightRadius: R }}
          >
            <h1 className="text-h2 leading-[1]">
              <SplitText text="About" delay={0.5} />
              <br />
              <SplitText text="Me" delay={0.6} />
            </h1>
            <InvertedCorner className="top-0 left-full" />
            <InvertedCorner className="top-full left-0" />
          </div>
        </motion.div>
      </section>

      <Section>
        <h2 className="text-h1">
          <SplitTextInView text="WHO AM I?" />
        </h2>
        <div className="mt-[calc(var(--gap)*1.5)] grid gap-(--gap) md:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] md:items-end lg:grid-cols-[1fr_minmax(0,30vw)_1fr] lg:items-stretch lg:gap-[clamp(2rem,3.4vw,4rem)]">
          <Reveal className="md:col-start-2 md:row-start-1 lg:col-start-1 lg:self-start">
            <p className="text-body-l text-pretty">{about.whoAmI.intro}</p>
          </Reveal>
          <Reveal
            delay={0.1}
            className="md:col-start-1 md:row-span-2 md:row-start-1 lg:col-start-2 lg:row-span-1 lg:max-w-[36.625rem]"
          >
            <MediaFrame media={about.whoAmI.portrait} ratio="3/4" priority />
          </Reveal>
          <Reveal
            delay={0.2}
            className="flex flex-col gap-6 md:col-start-2 lg:col-start-3 lg:row-start-1 lg:self-end"
          >
            <p className="text-body-l text-pretty">{about.whoAmI.passion}</p>
            <p className="text-body text-pretty opacity-80">{about.whoAmI.remote}</p>
          </Reveal>
        </div>
      </Section>

      <Section className="pt-0">
        <MetricsRow metrics={about.highlights} />
      </Section>

      <Section tone="alt">
        <h2 className="text-right text-h1">
          <SplitTextInView text="SKILLS" />
        </h2>
        <Stagger className="mt-[calc(var(--gap)*1.5)] grid gap-x-(--gap) gap-y-[calc(var(--gap)*1.5)] md:grid-cols-2 lg:grid-cols-4" stagger={0.1}>
          {about.skills.map((skill) => (
            <StaggerItem key={skill.name} className="group flex flex-col gap-3">
              <MediaFrame
                media={{ kind: 'image', alt: `${skill.name} work`, label: 'Trabalho · 16:10' }}
                ratio="16/10"
                hoverZoom
              />
              <h3 className="mt-1 text-h3">{skill.name}</h3>
              <p className="text-body text-pretty opacity-90">{skill.description}</p>
              <ul className="mt-1 flex flex-wrap gap-2">
                {skill.tools.map((t) => (
                  <li key={t} className="rounded-full border border-current/60 px-3 py-1 text-caption">
                    {t}
                  </li>
                ))}
              </ul>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <Section>
        <Reveal>
          <h2 className="text-h2">TOOLS</h2>
        </Reveal>
        <Stagger as="ul" className="mt-(--gap) flex flex-wrap gap-x-[clamp(1.5rem,1rem+2vw,3rem)] gap-y-6" stagger={0.05}>
          {about.tools.map((tool) => (
            <StaggerItem as="li" key={tool.name} className="group flex flex-col items-center gap-3">
              <span className="grid size-[clamp(3.5rem,2.7rem+3.2vw,6rem)] place-items-center rounded-full bg-surface text-body transition-all duration-500 ease-out-expo group-hover:-translate-y-1 group-hover:bg-accent group-hover:text-inverse">
                {tool.short}
              </span>
              <span className="text-caption">{tool.name}</span>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <Section className="pt-0">
        <Reveal>
          <h2 className="text-h2">EXPERIENCE</h2>
        </Reveal>
        <Stagger as="ul" className="mt-(--gap)" stagger={0.08}>
          {about.experience.map((job) => (
            <StaggerItem
              as="li"
              key={job.period + job.role}
              className="grid gap-1 border-t border-ink/80 py-[clamp(1rem,0.75rem+0.6vw,1.5rem)] md:grid-cols-[1fr_1.4fr_1fr] md:items-baseline md:gap-6"
            >
              <span className="text-body opacity-70">{job.period}</span>
              <span className="text-h3">{job.role}</span>
              <span className="text-body md:text-right">{job.company}</span>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <Section className="pt-0">
        <Reveal>
          <p className="text-caption tracking-[0.08em] uppercase">Brands I’ve worked with</p>
        </Reveal>
        <Stagger as="ul" className="mt-(--gap) grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6" stagger={0.05}>
          {about.clients.map((client) => (
            <StaggerItem
              as="li"
              key={client}
              className="grid aspect-[2/1] place-items-center rounded-[4px] bg-surface text-caption opacity-90"
            >
              {client}
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <LetsTalk />
      <Footer />
    </Page>
  )
}
