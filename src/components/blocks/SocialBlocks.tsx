import { MediaFrame } from '@/components/ui/MediaFrame'
import { Stagger, StaggerItem } from '@/components/ui/Reveal'
import { Section, SectionHeader } from '@/components/ui/Section'
import type { SocialFeedBlock as FeedData, StoriesBlock as StoriesData } from '@/types'

export function SocialFeedBlock({ kicker, title, posts, tone }: FeedData) {
  return (
    <Section tone={tone}>
      <SectionHeader kicker={kicker} title={title} />
      <Stagger className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-4 lg:gap-6" stagger={0.06}>
        {posts.map((post, i) => (
          <StaggerItem key={i} className="group">
            <MediaFrame media={post} ratio={post.ratio ?? '4/5'} hoverZoom />
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  )
}

export function StoriesBlock({ kicker, title, items, tone }: StoriesData) {
  return (
    <Section tone={tone}>
      <SectionHeader kicker={kicker} title={title} />
      <Stagger
        className="no-scrollbar mx-[calc(var(--gutter)*-1)] flex snap-x snap-mandatory scroll-px-(--gutter) gap-4 overflow-x-auto px-(--gutter) lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-8 lg:overflow-visible lg:px-0"
        stagger={0.08}
      >
        {items.map((item, i) => (
          <StaggerItem key={i} className="w-[42vw] shrink-0 snap-start md:w-[28vw] lg:w-auto">
            <MediaFrame media={item} ratio={item.ratio ?? '9/16'} />
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  )
}
