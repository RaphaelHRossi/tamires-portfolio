import { MediaFrame } from '@/components/ui/MediaFrame'
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal'
import { Section } from '@/components/ui/Section'
import type { ImageFullBlock as FullData, ImageGridBlock as GridData, ImagePairBlock as PairData } from '@/types'

export function ImageFullBlock({ items, caption, tone }: FullData) {
  return (
    <Section tone={tone}>
      <div className="flex flex-col gap-(--gap)">
        {items.map((media, i) => (
          <Reveal key={i} amount={0.1}>
            <MediaFrame media={media} ratio={media.ratio ?? '16/9'} />
          </Reveal>
        ))}
        {caption && <p className="-mt-[calc(var(--gap)/2)] text-caption opacity-70">{caption}</p>}
      </div>
    </Section>
  )
}

export function ImagePairBlock({ items, tone }: PairData) {
  return (
    <Section tone={tone}>
      <Stagger className="grid gap-(--gap) md:grid-cols-2" stagger={0.12}>
        {items.map((media, i) => (
          <StaggerItem key={i}>
            <MediaFrame media={media} ratio={media.ratio ?? '3/4'} />
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  )
}

export function ImageGridBlock({ items, tone }: GridData) {
  return (
    <Section tone={tone}>
      <Stagger className="grid grid-cols-2 gap-(--gap)" stagger={0.1}>
        {items.map((media, i) => (
          <StaggerItem key={i}>
            <MediaFrame media={media} ratio={media.ratio ?? '3/4'} />
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  )
}
