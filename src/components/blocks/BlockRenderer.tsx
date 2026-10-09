import type { ProjectBlock } from '@/types'
import { ImageFullBlock, ImageGridBlock, ImagePairBlock } from './ImageBlocks'
import { BeforeAfterBlock, ProcessBlock } from './ProcessBlocks'
import { ResultsBlock } from './ResultsBlock'
import { SocialFeedBlock, StoriesBlock } from './SocialBlocks'
import { CreditsBlock, IntroBlock, TextBlock } from './TextBlocks'
import { ReelFeatureBlock, VideoBlock } from './VideoBlocks'

/** Novos tipos de bloco: declare em `types.ts`, crie o componente e adicione o `case`. */
export function BlockRenderer({ blocks }: { blocks: ProjectBlock[] }) {
  return (
    <>
      {blocks.map((block, i) => (
        <Block key={`${block.type}-${i}`} block={block} />
      ))}
    </>
  )
}

function Block({ block }: { block: ProjectBlock }) {
  switch (block.type) {
    case 'intro':
      return <IntroBlock {...block} />
    case 'text':
      return <TextBlock {...block} />
    case 'image-full':
      return <ImageFullBlock {...block} />
    case 'image-pair':
      return <ImagePairBlock {...block} />
    case 'image-grid':
      return <ImageGridBlock {...block} />
    case 'social-feed':
      return <SocialFeedBlock {...block} />
    case 'stories':
      return <StoriesBlock {...block} />
    case 'video':
      return <VideoBlock {...block} />
    case 'reel-feature':
      return <ReelFeatureBlock {...block} />
    case 'process':
      return <ProcessBlock {...block} />
    case 'before-after':
      return <BeforeAfterBlock {...block} />
    case 'results':
      return <ResultsBlock {...block} />
    case 'credits':
      return <CreditsBlock {...block} />
    default: {
      const unknown: never = block
      if (import.meta.env.DEV) console.warn('Bloco desconhecido:', unknown)
      return null
    }
  }
}
