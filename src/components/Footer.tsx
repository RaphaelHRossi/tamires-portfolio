import { site } from '@/data/site'
import { SocialLinks } from './SocialLinks'

export function Footer() {
  return (
    <footer className="border-t border-ink/80 px-(--gutter-header) py-[clamp(2rem,1.5rem+1.5vw,3rem)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-caption">
          © {new Date().getFullYear()} {site.name} · {site.footerLocation}
        </p>
        <SocialLinks />
      </div>
    </footer>
  )
}
