import { site } from '@/data/site'
import { cn } from '@/lib/cn'

export function SocialLinks({ className, size = 'md' }: { className?: string; size?: 'md' | 'lg' }) {
  return (
    <ul className={cn('flex items-center gap-3', className)}>
      {site.socials.map((s) => (
        <li key={s.label}>
          <a
            href={s.href}
            target="_blank"
            rel="noreferrer"
            aria-label={s.label}
            className={cn(
              'grid place-items-center rounded-full bg-surface text-caption text-ink transition-all duration-300',
              'hover:-translate-y-0.5 hover:bg-accent hover:text-inverse',
              size === 'lg' ? 'size-[clamp(2.5rem,1.5rem+2vw,3.5rem)]' : 'size-[clamp(2.25rem,1.5rem+1.4vw,3rem)]',
            )}
          >
            {s.short}
          </a>
        </li>
      ))}
    </ul>
  )
}
