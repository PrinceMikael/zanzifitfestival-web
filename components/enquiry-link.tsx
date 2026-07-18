import { MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const WHATSAPP_NUMBER = '255686915587'

const CONTEXT_VERB: Record<'accommodation' | 'experience', string> = {
  accommodation: "I'd like to know more about booking",
  experience: "I'd like to know more about",
}

export function EnquiryLink({
  label,
  context,
  className,
}: {
  label: string
  context: 'accommodation' | 'experience'
  className?: string
}) {
  const message = `Hi ZanziFit team, ${CONTEXT_VERB[context]}: ${label}.`
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor-label="Chat"
      className={cn(
        'inline-flex items-center gap-2 font-utility text-sm font-semibold uppercase tracking-[0.14em] text-amber transition-colors hover:text-surface-dark-foreground',
        className,
      )}
    >
      <MessageCircle className="size-4" />
      Enquire on WhatsApp
    </a>
  )
}
