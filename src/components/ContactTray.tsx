import { AnimatePresence, motion, type Variants } from 'motion/react'
import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { useContact } from '@/context/ContactContext'
import { site } from '@/data/site'
import { cn } from '@/lib/cn'
import { sendContactMessage } from '@/lib/contact'
import { EASE_IN, EASE_OUT } from '@/lib/motion'
import { SocialLinks } from './SocialLinks'
import { Media } from './ui/Media'

export function ContactTray() {
  const { isOpen, close } = useContact()
  return <AnimatePresence>{isOpen && <Tray key="contact-tray" onClose={close} />}</AnimatePresence>
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

const content: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.25 } },
}
const item: Variants = {
  hidden: { opacity: 0, x: 32 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE_OUT } },
}

function Tray({ onClose }: { onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null)
  const titleId = useId()

  // Esc fecha, Tab fica restrito ao painel e o foco retorna ao elemento de origem.
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    const focusTimer = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>('input, textarea')?.focus({ preventScroll: true })
    }, 450)

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key !== 'Tab' || !panelRef.current) return
      const nodes = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (nodes.length === 0) return
      const first = nodes[0]!
      const last = nodes[nodes.length - 1]!
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(focusTimer)
      window.removeEventListener('keydown', onKey)
      previous?.focus?.({ preventScroll: true })
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50">
      <motion.div
        aria-hidden
        className="absolute inset-0 cursor-pointer bg-scrim backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.5 } }}
        exit={{ opacity: 0, transition: { duration: 0.4, delay: 0.1 } }}
        onClick={onClose}
      />

      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          'absolute inset-y-0 right-0 flex w-full flex-col overflow-y-auto overscroll-contain bg-page shadow-[-24px_0_60px_rgba(0,0,0,0.12)]',
          'md:w-[min(75vw,37.5rem)]',
          'lg:grid lg:w-[min(78vw,93.75rem)] lg:grid-cols-[18fr_37fr_45fr] lg:overflow-hidden',
        )}
        initial={{ x: '100%' }}
        animate={{ x: 0, transition: { duration: 0.75, ease: EASE_OUT } }}
        exit={{ x: '100%', transition: { duration: 0.5, ease: EASE_IN } }}
      >
        <div className="relative h-[7.5rem] shrink-0 overflow-hidden md:h-[12.5rem] lg:h-full">
          <motion.div
            className="h-full w-full"
            initial={{ scale: 1.2 }}
            animate={{ scale: 1, transition: { duration: 1.2, ease: EASE_OUT } }}
          >
            <Media media={site.contact.stripImage} priority />
          </motion.div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close contact form"
            className="absolute top-4 left-4 grid size-10 cursor-pointer place-items-center rounded-full bg-inverse/22 text-inverse transition-all duration-300 hover:rotate-90 hover:bg-inverse/40 lg:top-6 lg:left-6 lg:size-12"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <motion.div
          className="flex min-h-0 flex-1 flex-col px-5 py-8 md:px-12 md:py-12 lg:overflow-y-auto lg:px-[clamp(1.5rem,2vw,2.5rem)] lg:py-[clamp(2.5rem,4vw,4rem)]"
          variants={content}
          initial="hidden"
          animate="show"
        >
          <motion.h2 id={titleId} variants={item} className="text-h3 text-balance lg:text-center">
            {site.contact.title[0]}
            <br />
            {site.contact.title[1]}
          </motion.h2>
          <motion.p variants={item} className="mt-4 text-body lg:mt-8">
            {site.contact.description}
          </motion.p>

          <ContactForm itemVariants={item} />

          <motion.div variants={item} className="mt-8 flex items-center justify-between gap-4 lg:hidden">
            <span className="text-body">Follow me:</span>
            <SocialLinks />
          </motion.div>
        </motion.div>

        <motion.div
          className="hidden min-h-0 flex-col gap-6 pt-[clamp(4rem,6.5vw,7.5rem)] pr-[clamp(2rem,3.4vw,4rem)] pb-[clamp(2rem,3.4vw,4rem)] pl-[clamp(1rem,1.7vw,2rem)] lg:flex"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE_OUT, delay: 0.35 } }}
        >
          <div className="min-h-0 flex-1 overflow-hidden">
            <Media media={site.contact.asideImage} />
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-body-l">Follow me:</span>
            <SocialLinks size="lg" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

type Status = 'idle' | 'sending' | 'sent'
type Errors = Partial<Record<'name' | 'email' | 'message', string>>

function ContactForm({ itemVariants }: { itemVariants: Variants }) {
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Errors>({})
  const formId = useId()

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const payload = {
      name: String(data.get('name') ?? '').trim(),
      email: String(data.get('email') ?? '').trim(),
      message: String(data.get('message') ?? '').trim(),
    }
    const next: Errors = {}
    if (!payload.name) next.name = 'Please tell me your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) next.email = 'Please enter a valid email.'
    if (payload.message.length < 10) next.message = 'Your message needs at least 10 characters.'
    setErrors(next)
    if (Object.keys(next).length) {
      const firstKey = Object.keys(next)[0]
      e.currentTarget.querySelector<HTMLElement>(`[name="${firstKey}"]`)?.focus()
      return
    }
    setStatus('sending')
    try {
      await sendContactMessage(payload)
      setStatus('sent')
    } catch {
      setStatus('idle')
      setErrors({ message: 'Something went wrong. Please try again.' })
    }
  }

  return (
    <div className="relative mt-6 flex min-h-[24rem] flex-1 flex-col lg:mt-10">
      <AnimatePresence mode="wait" initial={false}>
        {status === 'sent' ? (
          <motion.div
            key="sent"
            role="status"
            className="flex flex-1 flex-col items-start justify-center gap-4 lg:items-center lg:text-center"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } }}
            exit={{ opacity: 0, y: -16, transition: { duration: 0.3 } }}
          >
            <svg viewBox="0 0 64 64" className="size-16 text-accent" aria-hidden>
              <motion.circle
                cx="32"
                cy="32"
                r="30"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1, transition: { duration: 0.8, ease: EASE_OUT } }}
              />
              <motion.path
                d="M20 33l8 8 16-17"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1, transition: { duration: 0.5, delay: 0.5, ease: EASE_OUT } }}
              />
            </svg>
            <h3 className="text-h3">Thank you!</h3>
            <p className="max-w-[26rem] text-body">Your message was sent. I’ll get back to you soon.</p>
            <button
              type="button"
              onClick={() => setStatus('idle')}
              className="link-underline mt-2 cursor-pointer text-body"
            >
              Send another message
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            noValidate
            onSubmit={onSubmit}
            className="flex flex-1 flex-col gap-4 lg:gap-5"
            exit={{ opacity: 0, y: -16, transition: { duration: 0.3 } }}
          >
            <Field id={`${formId}-name`} name="name" label="First Name" autoComplete="given-name" error={errors.name} variants={itemVariants} />
            <Field id={`${formId}-email`} name="email" type="email" label="Email Address" autoComplete="email" error={errors.email} variants={itemVariants} />
            <Field id={`${formId}-message`} name="message" label="Message" multiline error={errors.message} variants={itemVariants} />
            <motion.button
              variants={itemVariants}
              type="submit"
              disabled={status === 'sending'}
              whileTap={{ scale: 0.98 }}
              className="mt-2 flex h-12 cursor-pointer items-center justify-center gap-3 rounded-[9px] bg-accent text-body text-inverse transition-colors duration-300 hover:bg-accent-strong disabled:cursor-wait disabled:opacity-80 lg:h-14"
            >
              {status === 'sending' ? (
                <>
                  <motion.span
                    aria-hidden
                    className="size-4 rounded-full border-2 border-inverse/40 border-t-inverse"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                  />
                  Sending…
                </>
              ) : (
                'Send'
              )}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}

interface FieldProps {
  id: string
  name: string
  label: string
  type?: string
  autoComplete?: string
  multiline?: boolean
  error?: string
  variants: Variants
}

function Field({ id, name, label, type = 'text', autoComplete, multiline, error, variants }: FieldProps) {
  const errorId = `${id}-error`
  const control = cn(
    'w-full rounded-[9px] bg-field px-4 text-body text-ink outline-none transition-shadow duration-300 placeholder:text-ink/40',
    'focus:ring-2 focus:ring-accent',
    error && 'ring-2 ring-danger',
  )
  return (
    <motion.div variants={variants} className={cn('flex flex-col gap-2', multiline && 'min-h-40 flex-1')}>
      <label htmlFor={id} className="text-body">
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          name={name}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={cn(control, 'min-h-40 flex-1 resize-none py-3')}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={cn(control, 'h-12 lg:h-14')}
        />
      )}
      <AnimatePresence>
        {error && (
          <motion.p
            id={errorId}
            className="text-caption text-danger"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
