import { motion } from 'motion/react'
import { useContact } from '@/context/ContactContext'
import { cn } from '@/lib/cn'

export function ContactButton({ className, label = 'Contact Me' }: { className?: string; label?: string }) {
  const { open } = useContact()
  return (
    <motion.button
      type="button"
      onClick={open}
      aria-haspopup="dialog"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={cn(
        'inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full bg-accent px-[1.25em] py-[0.6em]',
        'text-nav whitespace-nowrap text-inverse transition-colors duration-300 hover:bg-accent-strong',
        className,
      )}
    >
      {label}
    </motion.button>
  )
}
