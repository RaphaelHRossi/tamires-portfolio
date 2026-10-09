import { motion } from 'motion/react'
import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { Footer } from '@/components/Footer'
import { Page, ScrollProgress } from '@/components/Page'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { LetsTalk, MoreProjects } from '@/components/blocks/EndBlocks'
import { Media } from '@/components/ui/Media'
import { SplitText } from '@/components/ui/SplitText'
import { toRect, useFlight } from '@/context/FlightContext'
import { getProject, getProjectIndex } from '@/data/projects'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { carouselMemory } from '@/lib/carouselMemory'
import { cn } from '@/lib/cn'
import { EASE_IN_OUT, EASE_OUT } from '@/lib/motion'
import type { Project } from '@/types'
import NotFound from './NotFound'

export default function ProjectPage() {
  const { slug = '' } = useParams()
  const project = getProject(slug)
  if (!project) return <NotFound />
  return <ProjectView project={project} />
}

function ProjectView({ project }: { project: Project }) {
  useDocumentTitle(project.title)
  const navigate = useNavigate()
  const { flight, start, land, isFlying } = useFlight()
  const bannerRef = useRef<HTMLDivElement>(null)

  // Com a transição compartilhada, o banner dispensa a animação de entrada própria.
  const [arriving] = useState(() => flight?.target === 'banner' && flight.slug === project.slug)

  useLayoutEffect(() => {
    if (!flight || flight.target !== 'banner' || flight.slug !== project.slug || flight.to) return
    const el = bannerRef.current
    if (el) land(project.slug, 'banner', toRect(el.getBoundingClientRect()))
  }, [flight, project.slug, land])

  useEffect(() => carouselMemory.set(getProjectIndex(project.slug)), [project.slug])

  const goBack = (e: MouseEvent) => {
    e.preventDefault()
    const el = bannerRef.current
    if (el) {
      const r = el.getBoundingClientRect()
      // A transição de volta só ocorre se o banner estiver visível.
      if (r.bottom > 0 && r.top < window.innerHeight) {
        start({ slug: project.slug, media: project.cover, from: toRect(r), target: 'card' })
      }
    }
    navigate('/')
  }

  const textDelay = arriving ? 0.45 : 0.15

  return (
    <Page>
      <ScrollProgress />
      <article>
        <header className="grid grid-cols-[1fr_auto_1fr] items-start gap-x-4 px-(--gutter-header) pt-[clamp(0.75rem,0.5rem+0.8vw,1.5rem)]">
          <Link
            to="/"
            onClick={goBack}
            className="group inline-flex items-center gap-2 justify-self-start text-body"
          >
            <span aria-hidden className="transition-transform duration-500 ease-out-expo group-hover:-translate-x-1">
              ←
            </span>
            <span className="link-underline">Back</span>
          </Link>
          <motion.p
            className="text-body md:text-h3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_OUT, delay: textDelay }}
          >
            {project.year}
          </motion.p>
        </header>

        <div className="px-(--gutter-header) pt-1 pb-[clamp(1.25rem,0.75rem+1.6vw,2.75rem)] text-center">
          <h1 className="mx-auto max-w-[105rem] text-h1 text-balance">
            <SplitText text={project.title} delay={textDelay + 0.05} />
          </h1>
          <motion.p
            className="mt-[clamp(0.5rem,0.25rem+0.6vw,1rem)] text-caption tracking-[0.08em] uppercase opacity-70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 0.8, delay: textDelay + 0.3 }}
          >
            {project.category}
          </motion.p>
        </div>

        <div
          ref={bannerRef}
          className={cn(
            'relative aspect-[3/2] w-full overflow-hidden md:aspect-[19/10] lg:aspect-[26/10]',
            isFlying(project.slug) && 'invisible',
          )}
        >
          {arriving ? (
            <Media media={project.cover} priority />
          ) : (
            <motion.div
              className="h-full w-full"
              initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
              animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
              transition={{ duration: 1.1, ease: EASE_IN_OUT, delay: 0.15 }}
            >
              <motion.div
                className="h-full w-full"
                initial={{ scale: 1.15 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.6, ease: EASE_OUT, delay: 0.15 }}
              >
                <Media media={project.cover} priority />
              </motion.div>
            </motion.div>
          )}
        </div>

        <BlockRenderer blocks={project.blocks} />
      </article>

      <LetsTalk />
      <MoreProjects currentSlug={project.slug} />
      <Footer />
    </Page>
  )
}
