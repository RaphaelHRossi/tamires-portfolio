import type { MediaItem, Metric } from '@/types'

export const about = {
  hero: { kind: 'video', alt: 'Showreel of Tamires Da Pont', label: 'Foto / showreel em loop' } satisfies MediaItem,

  whoAmI: {
    intro: 'Hey, I’m Tamires. I’m a Graphic Designer turned Motion Designer turned 3D Artist.',
    passion:
      'I love bringing brands and products to life through the power of CG, and teaching the process along the way.',
    remote:
      'An experienced designer based in São Paulo, Brazil. I’ve spent most of my career working remotely — flexibility and focus are my secret weapons.',
    portrait: { kind: 'image', alt: 'Portrait of Tamires', ratio: '3/4', label: 'Retrato · 3:4' } satisfies MediaItem,
  },

  highlights: [
    { value: '00+', label: 'projects delivered' },
    { value: '00', label: 'years of experience' },
    { value: '00', label: 'brands & studios' },
  ] satisfies Metric[],

  skills: [
    {
      name: '3D',
      description: 'Modeling, lighting, look-dev and rendering for products and characters.',
      tools: ['Blender', 'Cinema 4D', 'Redshift'],
    },
    {
      name: 'Motion',
      description: 'Motion graphics, animation and video for brands and social.',
      tools: ['After Effects', 'Premiere'],
    },
    {
      name: 'UX / UI',
      description: 'Interfaces, prototypes and web design focused on clarity.',
      tools: ['Figma'],
    },
    {
      name: 'Graphic Design',
      description: 'Branding, rebranding and social media systems.',
      tools: ['Illustrator', 'Photoshop'],
    },
  ],

  tools: [
    { name: 'Blender', short: 'Bl' },
    { name: 'Cinema 4D', short: 'C4D' },
    { name: 'After Effects', short: 'Ae' },
    { name: 'Figma', short: 'Fi' },
    { name: 'Photoshop', short: 'Ps' },
    { name: 'Illustrator', short: 'Ai' },
    { name: 'Premiere', short: 'Pr' },
  ],

  experience: [
    { period: '20XX — Now', role: '3D Artist', company: 'Studio / Freelance' },
    { period: '20XX — 20XX', role: 'Motion Designer', company: 'Company name' },
    { period: '20XX — 20XX', role: 'Graphic Designer', company: 'Company name' },
  ],

  clients: Array.from({ length: 6 }, (_, i) => `Logo ${i + 1}`),
}
