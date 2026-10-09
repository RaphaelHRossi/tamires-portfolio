import { useEffect } from 'react'

const BASE = 'Tamires Da Pont'
const DEFAULT = `${BASE} — 3D, Motion & UX Designer`

export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} — ${BASE}` : DEFAULT
  }, [title])
}
