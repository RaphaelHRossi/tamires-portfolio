import { Link } from 'react-router'
import { Page } from '@/components/Page'
import { SplitText } from '@/components/ui/SplitText'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export default function NotFound() {
  useDocumentTitle('Page not found')
  return (
    <Page>
      <div className="flex min-h-full flex-col items-center justify-center gap-6 px-(--gutter) text-center">
        <h1 className="font-display text-display text-accent">
          <SplitText text="404" mode="chars" />
        </h1>
        <p className="text-body-l">This page doesn’t exist (yet).</p>
        <Link to="/" className="link-underline text-body">
          Back to home
        </Link>
      </div>
    </Page>
  )
}
