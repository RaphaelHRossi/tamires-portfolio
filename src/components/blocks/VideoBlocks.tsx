import { motion } from 'motion/react'
import { useRef, useState } from 'react'
import { Media, toAspect } from '@/components/ui/Media'
import { MediaFrame } from '@/components/ui/MediaFrame'
import { Reveal } from '@/components/ui/Reveal'
import { Section } from '@/components/ui/Section'
import { EASE_OUT } from '@/lib/motion'
import type { MediaItem, ReelFeatureBlock as ReelData, VideoBlock as VideoData } from '@/types'

function PlayIcon() {
  return (
    <span className="grid size-[clamp(3.5rem,2rem+4vw,7.5rem)] place-items-center rounded-full bg-inverse/85 text-ink shadow-lg transition-transform duration-500 ease-out-expo group-hover:scale-110">
      <svg viewBox="0 0 16 18" className="ml-[8%] w-[32%]" aria-hidden>
        <path d="M16 9 0 18V0z" fill="currentColor" />
      </svg>
    </span>
  )
}

export function VideoPlayer({ media }: { media: MediaItem }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  if (!media.src) {
    return (
      <div className="group relative h-full w-full">
        <Media media={media} showLabel={false} />
        <div className="absolute inset-0 grid place-items-center">
          <PlayIcon />
        </div>
        <span className="absolute bottom-4 left-4 text-caption text-inverse/65">Vídeo · {media.ratio?.replace('/', ':')}</span>
      </div>
    )
  }

  return (
    <div className="group relative h-full w-full bg-black">
      <video
        ref={ref}
        src={media.src}
        poster={media.poster}
        aria-label={media.alt}
        playsInline
        preload="metadata"
        controls={playing}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="h-full w-full object-cover"
      />
      {!playing && (
        <button
          type="button"
          aria-label={`Play ${media.alt}`}
          onClick={() => ref.current?.play()}
          className="absolute inset-0 grid cursor-pointer place-items-center"
        >
          <PlayIcon />
        </button>
      )}
    </div>
  )
}

export function VideoBlock({ media, title, duration, tone }: VideoData) {
  return (
    <Section tone={tone}>
      <Reveal amount={0.1}>
        <motion.div
          className="overflow-hidden"
          style={{ aspectRatio: toAspect(media.ratio ?? '16/9') }}
          initial={{ clipPath: 'inset(6% 6% 6% 6%)' }}
          whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.2, ease: EASE_OUT }}
        >
          <VideoPlayer media={media} />
        </motion.div>
      </Reveal>
      {(title || duration) && (
        <Reveal delay={0.1} className="mt-[clamp(1rem,0.5rem+1vw,2rem)] flex items-baseline justify-between gap-4">
          {title && <h3 className="text-h3">{title}</h3>}
          {duration && <span className="text-body opacity-80">{duration}</span>}
        </Reveal>
      )}
    </Section>
  )
}

export function ReelFeatureBlock({ kicker, title, description, media, tone }: ReelData) {
  return (
    <Section tone={tone}>
      <div className="grid items-center gap-(--gap) md:grid-cols-[1fr_auto] lg:gap-[clamp(3rem,5vw,6rem)]">
        <Reveal className="flex flex-col gap-4">
          {kicker && <p className="text-caption tracking-[0.08em] uppercase opacity-70">{kicker}</p>}
          <h2 className="text-h2">{title}</h2>
          <p className="max-w-[38rem] text-body-l text-pretty">{description}</p>
        </Reveal>
        <Reveal delay={0.15} className="w-full md:w-[36vw] lg:w-[27vw] lg:max-w-[32.5rem]">
          <MediaFrame media={media} ratio={media.ratio ?? '9/16'} />
        </Reveal>
      </div>
    </Section>
  )
}
