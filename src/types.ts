/** Imagem ou vídeo. Sem `src`, é exibido um placeholder com o rótulo e a proporção. */
export interface MediaItem {
  kind?: 'image' | 'video'
  src?: string
  poster?: string
  alt: string
  /** ex.: '16/9', '4/5', '9/16' */
  ratio?: string
  label?: string
  tone?: 'primary' | 'muted'
}

export type Tone = 'default' | 'alt'

export interface InfoItem {
  label: string
  value: string
}

export interface Metric {
  value: string
  label: string
}

export interface IntroBlock {
  type: 'intro'
  title: string
  paragraphs: string[]
  info: InfoItem[]
  tone?: Tone
}

export interface TextBlock {
  type: 'text'
  kicker?: string
  title?: string
  paragraphs: string[]
  tone?: Tone
}

export interface ImageFullBlock {
  type: 'image-full'
  items: MediaItem[]
  caption?: string
  tone?: Tone
}

export interface ImagePairBlock {
  type: 'image-pair'
  items: [MediaItem, MediaItem]
  tone?: Tone
}

export interface ImageGridBlock {
  type: 'image-grid'
  items: MediaItem[]
  tone?: Tone
}

export interface SocialFeedBlock {
  type: 'social-feed'
  kicker?: string
  title: string
  posts: MediaItem[]
  tone?: Tone
}

export interface StoriesBlock {
  type: 'stories'
  kicker?: string
  title: string
  items: MediaItem[]
  tone?: Tone
}

export interface VideoBlock {
  type: 'video'
  media: MediaItem
  title?: string
  duration?: string
  tone?: Tone
}

export interface ReelFeatureBlock {
  type: 'reel-feature'
  kicker?: string
  title: string
  description: string
  media: MediaItem
  tone?: Tone
}

export interface ProcessStep {
  number: string
  name: string
  description: string
  media: MediaItem
}

export interface ProcessBlock {
  type: 'process'
  kicker?: string
  title: string
  steps: ProcessStep[]
  tone?: Tone
}

export interface BeforeAfterBlock {
  type: 'before-after'
  kicker?: string
  title: string
  before: MediaItem
  after: MediaItem
  beforeLabel?: string
  afterLabel?: string
  tone?: Tone
}

export interface ResultsBlock {
  type: 'results'
  kicker?: string
  title: string
  metrics: Metric[]
  quote?: string
  quoteAuthor?: string
  tone?: Tone
}

export interface CreditsBlock {
  type: 'credits'
  title?: string
  items: { role: string; name: string }[]
  tone?: Tone
}

export type ProjectBlock =
  | IntroBlock
  | TextBlock
  | ImageFullBlock
  | ImagePairBlock
  | ImageGridBlock
  | SocialFeedBlock
  | StoriesBlock
  | VideoBlock
  | ReelFeatureBlock
  | ProcessBlock
  | BeforeAfterBlock
  | ResultsBlock
  | CreditsBlock

export interface Project {
  slug: string
  title: string
  year: string
  category: string
  /** Usada no card do carrossel e no banner da página. */
  cover: MediaItem
  blocks: ProjectBlock[]
}
