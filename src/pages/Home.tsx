import { motion } from 'motion/react'
import { Page } from '@/components/Page'
import { Carousel } from '@/components/carousel/Carousel'
import { Typewriter } from '@/components/ui/Typewriter'
import { projects } from '@/data/projects'
import { site } from '@/data/site'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { cn } from '@/lib/cn'
import { EASE_OUT } from '@/lib/motion'

function Roles({ className }: { className?: string }) {
  return (
    <motion.div
      className={cn('flex items-baseline justify-between gap-4 px-(--gutter-header)', className)}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: EASE_OUT, delay: 1.1 }}
    >
      <p>{site.roles}</p>
      <p className="text-right">{site.location}</p>
    </motion.div>
  )
}

export default function Home() {
  useDocumentTitle()

  return (
    <Page scrollable={false}>
      <div className="flex h-full flex-col">
        <h1
          className={cn(
            'shrink-0 px-(--gutter-header) pt-[min(1vw,1.5svh)] text-center font-display leading-[0.95] tracking-[-0.01em] text-accent',
            'text-[min(16.4vw,9svh)] md:text-[min(12.5vw,12svh)] lg:text-[min(11.46vw,20.5svh)]',
          )}
        >
          {/* Espaço inquebrável mantém "Da Pont" na mesma linha em telas estreitas. */}
          <Typewriter text={'Tamires Da\u00A0Pont'} startDelay={0.45} caretAfter="hide" />
        </h1>

        <Roles className="mt-[clamp(0.75rem,2svh,1.5rem)] mb-[clamp(0.5rem,2svh,1.5rem)] text-caption md:text-body lg:hidden" />

        <Carousel projects={projects} className="min-h-0 flex-1 lg:mb-[clamp(0.75rem,3svh,2rem)]">
          <Roles className="pointer-events-none absolute inset-x-0 top-[0.75rem] z-10 hidden text-body-l lg:flex" />
        </Carousel>

        <motion.p
          aria-hidden
          className="shrink-0 py-[clamp(0.75rem,3svh,2rem)] text-center text-caption opacity-60 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <span className="md:hidden">Swipe ← →</span>
          <span className="hidden md:inline">Swipe, scroll or use ← → to explore</span>
        </motion.p>
      </div>
    </Page>
  )
}
