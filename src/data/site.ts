import type { MediaItem } from '@/types'

export const site = {
  name: 'Tamires Da Pont',
  shortName: 'Tamires',
  roles: '3D, MOTION, UX DESIGNER',
  location: 'São Paulo, SP, Brasil',
  footerLocation: 'São Paulo, Brasil',
  socials: [
    { label: 'Instagram', short: 'IG', href: 'https://instagram.com/' },
    { label: 'Behance', short: 'BE', href: 'https://behance.net/' },
    { label: 'LinkedIn', short: 'IN', href: 'https://linkedin.com/' },
  ],
  contact: {
    title: ['Have a project idea?', 'Let’s discuss it together.'],
    description: 'I’m always open to new opportunities. Feel free to send any questions or projects.',
    stripImage: { kind: 'image', alt: 'Detail of a 3D render', label: 'Imagem' } satisfies MediaItem,
    asideImage: { kind: 'image', alt: 'Portrait of Tamires', label: 'Imagem · retrato' } satisfies MediaItem,
  },
} as const
