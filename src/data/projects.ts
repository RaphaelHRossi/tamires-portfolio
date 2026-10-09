import type { InfoItem, MediaItem, Project, ResultsBlock } from '@/types'

/**
 * A ordem do array define a ordem do carrossel.
 * Mídias sem `src` são exibidas como placeholder; arquivos reais ficam em `public/media/<slug>/`.
 */

const ph = (ratio: string, kind: MediaItem['kind'] = 'image', label?: string): MediaItem => ({
  kind,
  ratio,
  alt: 'Placeholder',
  label,
})

const cover = (title: string): MediaItem => ({ kind: 'image', alt: title, label: 'Capa' })

const info = (year: string, services: string, tools: string): InfoItem[] => [
  { label: 'Client', value: 'Client name' },
  { label: 'Year', value: year },
  { label: 'Services', value: services },
  { label: 'Tools', value: tools },
]

const introText = [
  'Short context about the brief: who the client is, what the challenge was and what you were asked to deliver.',
  'How you approached it and what makes this work special. Keep it to two or three short paragraphs.',
]

const credits = [
  { role: 'Creative direction', name: 'Name Surname' },
  { role: '3D & Motion', name: 'Tamires Da Pont' },
  { role: 'Agency', name: 'Agency name' },
  { role: 'Client', name: 'Client name' },
]

const results: ResultsBlock = {
  type: 'results',
  kicker: 'Impact',
  title: 'Results',
  metrics: [
    { value: '+00%', label: 'engagement' },
    { value: '00k', label: 'views' },
    { value: '00', label: 'deliverables' },
  ],
  quote: 'Client quote or a sentence about the outcome of the project.',
  quoteAuthor: 'Name, Role at Company',
}

export const projects: Project[] = [
  {
    slug: 'kv-turma-da-monica-baby',
    title: 'KV Turma da Mônica Baby',
    year: '2025',
    category: '3D · Key visual',
    cover: cover('KV Turma da Mônica Baby'),
    blocks: [
      {
        type: 'intro',
        title: 'About the project',
        paragraphs: introText,
        info: info('2025', 'Rebranding\n3D\nSocial media\nWeb design', 'Blender · After Effects · Photoshop'),
      },
      { type: 'image-full', tone: 'alt', items: [ph('16/9'), ph('16/9'), ph('16/9')] },
      { type: 'image-pair', items: [ph('3/4'), ph('3/4')] },
      { type: 'image-grid', tone: 'alt', items: [ph('3/4'), ph('3/4'), ph('3/4'), ph('3/4')] },
      { type: 'credits', title: 'Credits', items: credits },
    ],
  },
  {
    slug: 'project-02',
    title: 'Project 02',
    year: '2025',
    category: 'Social media',
    cover: cover('Project 02'),
    blocks: [
      { type: 'intro', title: 'About the project', paragraphs: introText, info: info('2025', 'Social media\nMotion', 'Figma · After Effects') },
      { type: 'social-feed', kicker: 'Social media', title: 'Feed posts', posts: Array.from({ length: 6 }, () => ph('4/5', 'image', 'Post · 4:5')) },
      { type: 'stories', kicker: 'Social media', title: 'Stories & Reels', items: Array.from({ length: 4 }, () => ph('9/16', 'video', 'Story · 9:16')) },
      results,
      { type: 'credits', title: 'Credits', items: credits },
    ],
  },
  {
    slug: 'project-03',
    title: 'Project 03',
    year: '2024',
    category: '3D',
    cover: cover('Project 03'),
    blocks: [
      { type: 'intro', title: 'About the project', paragraphs: introText, info: info('2024', '3D modeling\nLook-dev\nRendering', 'Blender · Substance · Redshift') },
      { type: 'image-full', items: [ph('16/9')], caption: 'Caption: what we are looking at.' },
      {
        type: 'process',
        kicker: '3D',
        title: 'Process',
        tone: 'alt',
        steps: [
          { number: '01', name: 'Sketch', description: 'References and first ideas.', media: ph('1/1', 'image', 'Etapa · 1:1') },
          { number: '02', name: 'Blockout', description: 'Shapes, scale and camera.', media: ph('1/1', 'image', 'Etapa · 1:1') },
          { number: '03', name: 'Clay / Wireframe', description: 'Modeling and topology.', media: ph('1/1', 'image', 'Etapa · 1:1') },
          { number: '04', name: 'Final render', description: 'Materials, light and post.', media: ph('1/1', 'image', 'Etapa · 1:1') },
        ],
      },
      {
        type: 'before-after',
        kicker: '3D',
        title: 'Wireframe vs. Render',
        before: { ...ph('16/9', 'image', 'Wireframe'), tone: 'muted' },
        after: ph('16/9', 'image', 'Render'),
        beforeLabel: 'Wireframe',
        afterLabel: 'Render',
      },
      { type: 'image-pair', items: [ph('3/4'), ph('3/4')] },
      { type: 'credits', title: 'Credits', items: credits },
    ],
  },
  {
    slug: 'project-04',
    title: 'Project 04',
    year: '2024',
    category: 'Social media',
    cover: cover('Project 04'),
    blocks: [
      { type: 'intro', title: 'About the project', paragraphs: introText, info: info('2024', 'Social media\n3D', 'Blender · Photoshop') },
      { type: 'social-feed', kicker: 'Social media', title: 'Feed posts', posts: Array.from({ length: 6 }, () => ph('4/5', 'image', 'Post · 4:5')) },
      { type: 'stories', kicker: 'Social media', title: 'Stories & Reels', items: Array.from({ length: 4 }, () => ph('9/16', 'video', 'Story · 9:16')) },
      { type: 'image-full', items: [ph('16/9')] },
      results,
      { type: 'credits', title: 'Credits', items: credits },
    ],
  },
  {
    slug: 'project-05',
    title: 'Project 05',
    year: '2023',
    category: 'Motion',
    cover: cover('Project 05'),
    blocks: [
      { type: 'intro', title: 'About the project', paragraphs: introText, info: info('2023', 'Motion design\nAnimation', 'After Effects · Cinema 4D') },
      { type: 'video', tone: 'alt', media: ph('16/9', 'video'), title: 'Video title', duration: '0:45' },
      {
        type: 'reel-feature',
        kicker: 'Motion',
        title: 'Reel highlight',
        description: 'Explain the idea behind the animation, the duration, where it was published and how it performed.',
        media: ph('9/16', 'video'),
      },
      { type: 'image-grid', tone: 'alt', items: [ph('3/4'), ph('3/4'), ph('3/4'), ph('3/4')] },
      results,
      { type: 'credits', title: 'Credits', items: credits },
    ],
  },
  {
    slug: 'project-06',
    title: 'Project 06',
    year: '2023',
    category: 'Motion',
    cover: cover('Project 06'),
    blocks: [
      { type: 'intro', title: 'About the project', paragraphs: introText, info: info('2023', 'Motion design', 'After Effects · Premiere') },
      {
        type: 'reel-feature',
        kicker: 'Motion',
        title: 'Reel highlight',
        description: 'Explain the idea behind the animation, the duration, where it was published and how it performed.',
        media: ph('9/16', 'video'),
      },
      { type: 'video', tone: 'alt', media: ph('16/9', 'video'), title: 'Full film', duration: '1:30' },
      { type: 'credits', title: 'Credits', items: credits },
    ],
  },
  {
    slug: 'project-07',
    title: 'Project 07',
    year: '2022',
    category: '3D',
    cover: cover('Project 07'),
    blocks: [
      { type: 'intro', title: 'About the project', paragraphs: introText, info: info('2022', '3D\nProduct visualization', 'Cinema 4D · Redshift') },
      {
        type: 'before-after',
        kicker: '3D',
        title: 'Clay vs. Final',
        before: { ...ph('16/9', 'image', 'Clay'), tone: 'muted' },
        after: ph('16/9', 'image', 'Final'),
        beforeLabel: 'Clay',
        afterLabel: 'Final',
      },
      { type: 'image-full', tone: 'alt', items: [ph('16/9'), ph('16/9')] },
      { type: 'credits', title: 'Credits', items: credits },
    ],
  },
]

export const getProject = (slug: string) => projects.find((p) => p.slug === slug)

export const getProjectIndex = (slug: string) => projects.findIndex((p) => p.slug === slug)

/** Projetos seguintes ao atual, em ordem circular. */
export function getOtherProjects(slug: string, count = 5): Project[] {
  const start = getProjectIndex(slug)
  const out: Project[] = []
  for (let i = 1; i <= projects.length && out.length < count; i++) {
    const p = projects[(start + i) % projects.length]
    if (p && p.slug !== slug) out.push(p)
  }
  return out
}
