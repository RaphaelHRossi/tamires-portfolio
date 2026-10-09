import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

interface ContactApi {
  isOpen: boolean
  open: () => void
  close: () => void
}

const ContactContext = createContext<ContactApi | null>(null)

export function ContactProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const value = useMemo(() => ({ isOpen, open, close }), [isOpen, open, close])
  return <ContactContext.Provider value={value}>{children}</ContactContext.Provider>
}

export function useContact() {
  const ctx = useContext(ContactContext)
  if (!ctx) throw new Error('useContact precisa estar dentro de <ContactProvider>')
  return ctx
}
