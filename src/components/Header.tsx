import { motion } from 'motion/react'
import { Link, useLocation } from 'react-router'
import { site } from '@/data/site'
import { ContactButton } from './ui/ContactButton'

const links = [{ to: '/about', label: 'About' }]

export function Header() {
  const { pathname } = useLocation()

  return (
    <header className="fixed inset-x-0 top-0 z-40 bg-page">
      <div className="flex h-(--header-h) items-center justify-between gap-4 px-(--gutter-header)">
        <Link to="/" aria-label={`${site.shortName} — Home`} className="text-logo tracking-[-0.01em]">
          {site.shortName}
        </Link>

        <div className="flex items-center gap-(--nav-gap)">
          <nav aria-label="Main">
            <ul className="flex items-center text-nav">
              {links.map((link) => {
                const active = pathname === link.to
                return (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      aria-current={active ? 'page' : undefined}
                      className="relative block py-1 transition-opacity duration-300 hover:opacity-60"
                    >
                      {link.label}
                      {active && (
                        <motion.span
                          layoutId="nav-active"
                          className="absolute inset-x-0 bottom-0 h-px bg-ink"
                          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        />
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
          <ContactButton />
        </div>
      </div>
    </header>
  )
}
