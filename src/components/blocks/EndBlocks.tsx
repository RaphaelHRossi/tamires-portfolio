import { Link } from 'react-router'
import { ContactButton } from '@/components/ui/ContactButton'
import { MediaFrame } from '@/components/ui/MediaFrame'
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal'
import { Section, SectionHeader } from '@/components/ui/Section'
import { SplitTextInView } from '@/components/ui/SplitTextInView'
import { getOtherProjects } from '@/data/projects'
import { site } from '@/data/site'

export function LetsTalk() {
  return (
    <Section tone="alt">
      <h2 className="text-h1">
        <SplitTextInView text="Let’s Talk" />
      </h2>
      <Reveal delay={0.15}>
        <p className="mt-[clamp(1rem,0.5rem+1vw,2rem)] max-w-[38rem] text-body-l text-pretty">
          {site.contact.description}
        </p>
      </Reveal>
      <Reveal delay={0.25} className="mt-(--gap)">
        <ContactButton />
      </Reveal>
    </Section>
  )
}

export function MoreProjects({ currentSlug }: { currentSlug: string }) {
  const items = getOtherProjects(currentSlug, 5)
  return (
    <Section>
      <SectionHeader title="You May Also Like" align="center" />
      <Stagger
        className="no-scrollbar mx-[calc(var(--gutter)*-1)] flex snap-x snap-mandatory scroll-px-(--gutter) gap-4 overflow-x-auto px-(--gutter) pb-1 lg:mx-0 lg:grid lg:grid-cols-5 lg:gap-[clamp(1rem,1.7vw,2rem)] lg:overflow-visible lg:px-0"
        stagger={0.07}
      >
        {items.map((p) => (
          <StaggerItem key={p.slug} className="w-[40vw] shrink-0 snap-start md:w-[26vw] lg:w-auto">
            <Link to={`/projects/${p.slug}`} className="group block">
              <MediaFrame media={p.cover} ratio="4/5" hoverZoom zoomable={false} />
              <div className="mt-3 flex items-baseline justify-between gap-2 text-body">
                <span className="link-underline truncate">{p.title}</span>
                <span className="shrink-0 opacity-60">{p.year}</span>
              </div>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  )
}
